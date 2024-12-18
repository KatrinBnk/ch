import axios from 'axios';
import {isTokenExpired} from "@/service/checkToken.js";

export async function getUser(userID) {

    const token = localStorage.getItem('token');

    // Проверяем, есть ли токен и не истёк ли он
    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        const response = await axios.get(`http://localhost:8080/user/${userID}`, {
            headers: {
                Authorization: token,
            },
        });


        if (response.status === 200) {
            const userData = response.data;

            if (userData.password) {
                delete userData.password;
            }

            return userData;
        } else {
            localStorage.removeItem('userID');
            localStorage.removeItem('token');
            console.error(`Ошибка: неожиданный статус ${response.status}`);
            throw new Error(`Неожиданный статус: ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error.message);
        throw new Error('Не удалось получить данные пользователя. Проверьте соединение с сервером.');
    }
}


export async function getUserPhoto(userID) {

    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        // Запрос данных пользователя по ID
        const response = await axios.get(`http://localhost:8080/user/${userID}`, {
            headers: {
                Authorization: token,
            },
        });

        if (response.status === 200) {
            const userData = response.data;

            if (userData.profilePicture) {
                return `data:image/png;base64,${userData.profilePicture}`;
            } else {
                console.warn('У пользователя нет фотографии профиля');
                return null;
            }
        } else {
            console.error(`Ошибка: неожиданный статус ${response.status}`);
            throw new Error(`Неожиданный статус: ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка при получении фотографии пользователя:', error.message);
        throw new Error('Не удалось получить фотографию пользователя. Проверьте соединение с сервером.');
    }
}
