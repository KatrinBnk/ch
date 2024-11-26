import axios from 'axios';
import { isTokenExpired } from '@/service/checkToken.js';

export async function getScheduleItemsForDay(userId, day) {
    console.log(`Запрос расписания для пользователя ${userId} на день ${day}`);

    const token = localStorage.getItem('token');

    // Проверяем, есть ли токен и не истёк ли он
    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }


    try {
        // Выполняем GET-запрос для получения всех записей к мастеру
        const response = await axios.get(`http://localhost:8080/applications/master/${userId}`, {
            headers: {
                Authorization: token,
            },
        });

        if (response.status === 200) {
            const applications = response.data;

            const filteredApplications = applications.filter(application => {
                const applicationDate = new Date(application.date).toISOString().split('T')[0];
                return applicationDate === day;
            });

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

// Вспомогательная функция для вычисления времени окончания услуги
function calculateEndTime(startTimeISO, durationMinutes) {
    const startDate = new Date(startTimeISO);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000); // Добавляем длительность услуги

    return endDate.toISOString(); // Возвращаем время окончания
}
