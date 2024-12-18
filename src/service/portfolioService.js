import axios from 'axios';
import {isTokenExpired} from "@/service/checkToken.js";

const BASE_URL = 'http://localhost:8080/portfolio';

const token = localStorage.getItem('token');

export const createPortfolio = async (userId, portfolioData) => {
    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        // Отправляем данные на сервер в формате JSON
        const response = await axios.post(`http://localhost:8080/create/${userId}`, portfolioData, {
            headers: {
                Authorization: ` ${token}`,  // Убедитесь, что токен передается правильно
                'Content-Type': 'application/json', // Отправляем как JSON
            },
        });

        return response.data; // возвращаем данные созданного портфолио
    } catch (error) {
        console.error('Ошибка при создании портфолио:', error);
        throw error;
    }
};




// Обновление портфолио
export const updatePortfolio = async (portfolioId, portfolioData) => {

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        const response = await axios.put(`${BASE_URL}/${portfolioId}`, portfolioData, {
            headers: {
                Authorization: ` ${token}`,
            },
        });
        return response.data; // возвращаем обновленные данные портфолио
    } catch (error) {
        console.error('Ошибка при обновлении портфолио:', error);
        throw error;
    }
};

// Удаление портфолио
export const deletePortfolio = async (portfolioId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${portfolioId}`, {
            headers: {
                Authorization: ` ${token}`,
            },
        });
        return response.status; // возвращаем код статуса
    } catch (error) {
        console.error('Ошибка при удалении портфолио:', error);
        throw error;
    }
};

// Получение портфолио по ID master
export const getPortfolioByMasterId = async (portfolioId) => {
    try {
        const response = await axios.get(`http://localhost:8080/portfolio/${portfolioId}`, {
            headers: {
                Authorization: ` ${token}`,
            },
        });

        if (response.data == null) {
            console.log("У мастера нет портфолио.")
            return null;
        }

        // Преобразование массива байтов фотографий в Blob
        if (response.data.photos && Array.isArray(response.data.photos)) {
            response.data.photos = response.data.photos.map(photoBytes => {
                const blob = new Blob([new Uint8Array(photoBytes)], { type: 'image/png' });
                return URL.createObjectURL(blob); // Преобразуем в URL для отображения в <img>
            });
        }

        return response.data; // возвращаем данные портфолио с преобразованными изображениями
    } catch (error) {
        console.error('Ошибка при получении портфолио по ID:', error);
        throw error;
    }
};

