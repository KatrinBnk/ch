import axios from 'axios';
import { isTokenExpired } from '@/service/checkToken.js';

const DB_NAME = 'scheduleDB';
const DB_VERSION = 1;
const STORE_NAME = 'applicationsByDate';
const TTL = 60000; // 1 мин

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

// Получаем записи для конкретной даты из IndexedDB (если срок не истёк)
async function getApplicationsForDayFromIndexDB(day) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.get(day);
        request.onsuccess = () => {
            const data = request.result;
            if (data && data.expiry > Date.now()) {
                resolve(data.applications);
            } else {
                resolve(null);
            }
        };
        request.onerror = () => {
            reject('Ошибка при получении данных из IndexedDB');
        };
    });
}

// Получаем все даты, у которых есть какие-то записи, фильтруя просроченные
export async function getAllDatesWithApplications() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.getAllKeys();
        request.onsuccess = async () => {
            const keys = request.result || [];
            const validDates = [];
            for (let day of keys) {
                const applications = await getApplicationsForDayFromIndexDB(day);
                if (applications && applications.length > 0) {
                    const formattedDate = new Date(day).toISOString().split('T')[0];
                    validDates.push(formattedDate); // Форматируем дату
                }
            }
            resolve(validDates);
        };
        request.onerror = () => {
            reject('Ошибка при получении списка дат из IndexedDB');
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

// Функция для получения уникальных дат, на которые есть записи
export async function getUniqueDatesWithApplications() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = store.getAllKeys();
        request.onsuccess = async () => {
            const keys = request.result || [];
            const uniqueDates = new Set(); // Используем Set для уникальности

            for (let day of keys) {
                const applications = await getApplicationsForDayFromIndexDB(day);
                if (applications && applications.length > 0) {
                    const formattedDate = new Date(day).toISOString().split('T')[0];
                    uniqueDates.add(formattedDate); // Добавляем уникальную дату
                }
            }
            resolve(Array.from(uniqueDates)); // Преобразуем Set обратно в массив
        };
        request.onerror = () => {
            reject('Ошибка при получении списка уникальных дат из IndexedDB');
        };
    });
}


// Получаем все дни месяца в формате YYYY-MM-DD
function getAllDaysInMonth(year, month) {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
        const day = date.toISOString().split('T')[0]; // Форматируем как YYYY-MM-DD
        days.push(day);
        date.setDate(date.getDate() + 1); // Переходим к следующему дню
    }

    return days;
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
            startTime: `${application.date}T${application.time}`,
            endTime: calculateEndTime(`${application.date}T${application.time}`, application.usluga.durationMinutes)
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

        // Извлекаем уникальные даты для текущего месяца
        const highlightedDates = applications.map(application => application.startTime.split('T')[0]);

        // Убираем повторяющиеся даты
        return [...new Set(highlightedDates)];
    } catch (error) {
        console.error("Ошибка при получении расписания за месяц:", error);
        return [];
    }
}