import axios from 'axios';
import {isTokenExpired} from "@/service/checkToken.js";
import {base64ToBlob} from "@/service/portfolioService.js"

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

            if (response.status === 500) {
                return {
                    "id": 1,
                    "name": "Екатерина Банько",
                    "email": "4@ex.ru",
                    "telephone_number": "89934223969",
                    "profilePicture": null,
                    "role": "master",
                    "portfolio": null,
                    "favoriteUslugas": [],
                    "uslugas": [
                    {
                        "id": 1,
                        "name": "услуга 1",
                        "description": "рвиарв",
                        "category": "Категория 1",
                        "location": "Казань",
                        "coordinates": null,
                        "slots": [
                            {
                                "id": 1,
                                "date": "2024-12-23T00:00:00.000+00:00",
                                "time": "10:37:00",
                                "available": false
                            }
                        ],
                        "price": 2000,
                        "durationMinutes": 90
                    },
                    {
                        "id": 2,
                        "name": "услуга 23рнпыв",
                        "description": "оваравор",
                        "category": "Категория 4",
                        "location": "Казань",
                        "coordinates": null,
                        "slots": [
                            {
                                "id": 2,
                                "date": "2024-12-19T00:00:00.000+00:00",
                                "time": "12:38:00",
                                "available": true
                            },
                            {
                                "id": 3,
                                "date": "2024-12-22T00:00:00.000+00:00",
                                "time": "10:38:00",
                                "available": false
                            },
                            {
                                "id": 4,
                                "date": "2024-12-23T00:00:00.000+00:00",
                                "time": "12:38:00",
                                "available": false
                            },
                            {
                                "id": 5,
                                "date": "2024-12-18T00:00:00.000+00:00",
                                "time": "12:12:00",
                                "available": false
                            }
                        ],
                        "price": 2000,
                        "durationMinutes": 90
                    },
                    {
                        "id": 3,
                        "name": "вривра",
                        "description": "варива",
                        "category": "Категория 3",
                        "location": "Казань",
                        "coordinates": null,
                        "slots": [
                            {
                                "id": 6,
                                "date": "2024-12-18T00:00:00.000+00:00",
                                "time": "20:53:00",
                                "available": false
                            }
                        ],
                        "price": 2000,
                        "durationMinutes": 90
                    }
                ],
                    "writtenReviews": [],
                    "receivedReviews": []
                }
            }

            localStorage.removeItem('userID');
            localStorage.removeItem('token');
            console.error(`Ошибка: неожиданный статус ${response.status}`);
            throw new Error(`Неожиданный статус: ${response.status}`);
        }
    } catch (error) {

        if (localStorage.getItem(userID) === "0") {
            return {
                "id": 1,
                "name": "Екатерина Банько",
                "email": "4@ex.ru",
                "telephone_number": "89934223969",
                "profilePicture": null,
                "role": "master",
                "portfolio": null,
                "favoriteUslugas": [],
                "uslugas": [
                    {
                        "id": 1,
                        "name": "услуга 1",
                        "description": "рвиарв",
                        "category": "Категория 1",
                        "location": "Казань",
                        "coordinates": null,
                        "slots": [
                            {
                                "id": 1,
                                "date": "2024-12-23T00:00:00.000+00:00",
                                "time": "10:37:00",
                                "available": false
                            }
                        ],
                        "price": 2000,
                        "durationMinutes": 90
                    },
                    {
                        "id": 2,
                        "name": "услуга 23рнпыв",
                        "description": "оваравор",
                        "category": "Категория 4",
                        "location": "Казань",
                        "coordinates": null,
                        "slots": [
                            {
                                "id": 2,
                                "date": "2024-12-19T00:00:00.000+00:00",
                                "time": "12:38:00",
                                "available": true
                            },
                            {
                                "id": 3,
                                "date": "2024-12-22T00:00:00.000+00:00",
                                "time": "10:38:00",
                                "available": false
                            },
                            {
                                "id": 4,
                                "date": "2024-12-23T00:00:00.000+00:00",
                                "time": "12:38:00",
                                "available": false
                            },
                            {
                                "id": 5,
                                "date": "2024-12-18T00:00:00.000+00:00",
                                "time": "12:12:00",
                                "available": false
                            }
                        ],
                        "price": 2000,
                        "durationMinutes": 90
                    },
                    {
                        "id": 3,
                        "name": "вривра",
                        "description": "варива",
                        "category": "Категория 3",
                        "location": "Казань",
                        "coordinates": null,
                        "slots": [
                            {
                                "id": 6,
                                "date": "2024-12-18T00:00:00.000+00:00",
                                "time": "20:53:00",
                                "available": false
                            }
                        ],
                        "price": 2000,
                        "durationMinutes": 90
                    }
                ],
                "writtenReviews": [],
                "receivedReviews": []
            }
        }

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

export async function uploadUserPhoto(userID, profilePhoto){
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    const formData = new FormData();

    if (typeof profilePhoto === 'string') {
        const blob = base64ToBlob(profilePhoto);
        formData.append('file', blob, `photo.png`);
    } else if (profilePhoto instanceof File) {
        formData.append('file', profilePhoto);
    } else {
        console.warn(`Неизвестный формат данных: ${profilePhoto}`);
    }

    try {

        const response = await axios.put(`http://localhost:8080/user/${userID}`, formData,
            {
                headers:{
                    Authorization: token
                }
        })

        return response.data;
    } catch (error){
        console.error(error);
        return error;
    }
}

export async function updateUserInfo(userID, userName, userEmail){
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try{

        const response = await axios.put(`http://localhost:8080/user/${userID}`,
            {
                email: userEmail,
                name: userName
            },
            {
            headers: {
                Authorization: token,
            },
        });

    } catch (error){

    }
}