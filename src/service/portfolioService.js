import axios from 'axios';
import {isTokenExpired} from "@/service/checkToken.js";

const BASE_URL = 'http://localhost:8080/portfolio';

const token = localStorage.getItem('token');

export const createPortfolio = async (userId, portfolioData) => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        // Создаём пустое портфолио
        const response = await axios.post(
            `http://localhost:8080/create/${userId}`,
            { description: portfolioData.description },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const createdPortfolioID = response.data.id;

        return await updatePortfolio(createdPortfolioID, portfolioData);
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


    const formData = new FormData();
    formData.append('description', portfolioData.description);

    portfolioData.photos.forEach((photo, index) => {
        if (typeof photo === 'string') {
            // Если это строка, конвертируем Base64 в Blob
            const blob = base64ToBlob(photo);
            formData.append('photos', blob, `photo_${index}.png`); // Добавляем имя файла
        } else if (photo instanceof File) {
            // Если это уже файл, добавляем напрямую
            formData.append('photos', photo);
        } else {
            console.warn(`Неизвестный формат данных: ${photo}`);
        }
    });

    try {
        const responseToUpdate = await axios.put(
            `http://localhost:8080/portfolio/${portfolioId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return responseToUpdate.data; // возвращаем обновленные данные портфолио
    } catch (error) {
        console.error('Ошибка при обновлении портфолио:', error);
        throw error;
    }
};

// Утилита для преобразования Base64 в Blob
export function base64ToBlob(base64, mimeType = 'image/png') {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
}


// Удаление портфолио
export const deletePortfolio = async (portfolioId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${portfolioId}`, {
            headers: {
                Authorization: ` ${token}`,
            },
        });
        return response.status;
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

        return response.data;
    } catch (error) {
        console.error('Ошибка при получении портфолио по masterID:', error);
        throw error;
    }
};

