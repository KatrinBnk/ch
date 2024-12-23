import axios from 'axios';
import { isTokenExpired } from '@/service/checkToken.js';

const DB_NAME = 'scheduleDB';
const DB_VERSION = 1;
const STORE_NAME = 'applicationsByDate';
const TTL = 60; // 1 мин

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'date' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('Ошибка при открытии базы данных: ' + event.target.error);
        };
    });
}

async function storeApplicationsInIndexDB(day, applications) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const expiry = Date.now() + TTL;
    const record = { date: day, applications, expiry };

    return new Promise((resolve, reject) => {
        const request = store.put(record);
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            reject('Ошибка при сохранении данных в IndexedDB');
        };
    });
}

// Основная функция, которая получает расписание с сервера и кэширует в IndexedDB
export async function getScheduleItemsForDay(userId, day) {
    console.log(`Запрос расписания для пользователя ${userId} на день ${day}`);

    const token = localStorage.getItem('token');

    // Проверяем, есть ли токен и не истёк ли он
    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        const response = await axios.get(`http://localhost:8080/applications/master/${userId}`, {
            headers: {
                Authorization: token,
            },
        });


        if (response.status === 200) {
            const applications = response.data;

            // Фильтруем по дню
            const filteredApplications = applications.filter(application => {
                const applicationDate = new Date(application.date).toISOString().split('T')[0];
                return applicationDate === day;
            });

            // Добавляем в IndexedDB только если найдены записи для данного дня
            if (filteredApplications.length > 0) {
                await storeApplicationsInIndexDB(day, filteredApplications);
            }

            return filteredApplications.map(application => ({
                id: application.id,
                uslugaName: application.usluga.name,
                startTime: `${day}T${application.time}`,
                endTime: calculateEndTime(`${day}T${application.time}`, application.usluga.durationMinutes)
            }));
        } else {
            console.error(`Ошибка: неожиданный статус ${response.status}`);
            throw new Error(`Неожиданный статус: ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка при запросе расписания:', error.message);
        throw new Error('Не удалось получить расписание. Проверьте соединение с сервером.');
    }
}

// Функция для вычисления времени окончания услуги
function calculateEndTime(startTimeISO, durationMinutes) {
    const startDate = new Date(startTimeISO);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000); // Добавляем длительность услуги
    return endDate.toISOString(); // Возвращаем время окончания
}

// Основная функция для получения всех записей мастера на месяц
export async function getScheduleForMasterInMonth(userId, year, month) {
    console.log(`Запрос расписания для мастера ${userId} на месяц ${year}-${month + 1}`);

    const token = localStorage.getItem('token');

    // Проверяем, есть ли токен и не истёк ли он
    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    // Массив для хранения всех записей для данного месяца
    const allApplications = [];

    try {
        // Получаем все записи для мастера
        const response = await axios.get(`http://localhost:8080/applications/master/${userId}`, {
            headers: {
                Authorization: token,
            },
        });

        if (response.status === 200) {
            const applications = response.data;

            // Фильтруем записи на текущий месяц
            const filteredApplications = applications.filter(application => {
                const applicationDate = new Date(application.date);
                return applicationDate.getFullYear() === year && applicationDate.getMonth() === month;
            });

            if (filteredApplications.length > 0) {
                // Сохраняем отфильтрованные записи в IndexedDB
                for (let app of filteredApplications) {
                    const applicationDate = new Date(app.date).toISOString().split('T')[0]; // YYYY-MM-DD
                    await storeApplicationsInIndexDB(applicationDate, [app]);
                }

                allApplications.push(...filteredApplications);
            }
        } else {
            console.error(`Ошибка: неожиданный статус ${response.status}`);
        }

        // Возвращаем все записи для данного месяца
        return allApplications.map(application => ({
            uslugaName: application.usluga.name,
            startTime: `${formatDateToYYYYMMDD(application.date)}T${application.time}`,
            endTime: calculateEndTime(`${formatDateToYYYYMMDD(application.date)}T${application.time}`, application.usluga.durationMinutes)
        }));
    } catch (error) {
        console.error('Ошибка при запросе расписания:', error.message);
        throw new Error('Не удалось получить расписание. Проверьте соединение с сервером.');
    }
}

// Функция для получения уникальных дат для текущего месяца
export async function getHighlightedDatesForCurrentMonth(userId) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Месяц от 0 (январь) до 11 (декабрь)

    try {
        const applications = await getScheduleForMasterInMonth(userId, currentYear, currentMonth);

        const highlightedDates = applications.map(application => application.startTime.split('T')[0]);

        // Убираем повторяющиеся даты
        return [...new Set(highlightedDates)];
    } catch (error) {
        console.error("Ошибка при получении расписания за месяц:", error);
        return [];
    }
}

function formatDateToYYYYMMDD(date) {
    const d = new Date(date);

    // Проверка корректности даты
    if (isNaN(d.getTime())) {
        console.error("Некорректный формат даты:", date);
        return null;
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Месяцы с 0 по 11
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}