import axios from 'axios';
import {getUser} from "@/service/userDataService.js";
import {isTokenExpired} from "@/service/checkToken.js";


export async function getFavorites(userID) {
    try {
        const userInfo = await getUser(userID);

        const favoriteUslugas = userInfo.favoriteUslugas; //Массив объектов-услуг
        //сохраним только айдишники избранных услуг
        const favoriteUslugasIds = favoriteUslugas.map(usluga => usluga.id);
        console.log(favoriteUslugasIds);

        return favoriteUslugasIds;
    } catch (error){
        console.error(error)
        return [];
    }
}

export async function getFavoriteUslugas(userID) {
    try {
        const userInfo = await getUser(userID);

        const favoriteUslugas = userInfo.favoriteUslugas; //Массив объектов-услуг

        return favoriteUslugas;
    } catch (error){
        console.error(error)
        return [];
    }
}

export async function modifyFavoriteUslugas(userID, uslugaID) {
    const token = localStorage.getItem('token');

    // Проверяем, есть ли токен и не истёк ли он
    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try{
        const favorites = await getFavorites(userID);
        const isFavorite = favorites.includes(uslugaID);
        const result = !isFavorite;

        // Определяем метод и URL для запроса
        const method = isFavorite ? 'DELETE' : 'POST';
        const url = `http://localhost:8080/user/${userID}/${uslugaID}/favorite`;

        // Заголовки запроса с токеном авторизации
        const headers = {
            'Authorization': token
        };

        // Выполняем запрос
        const response = await fetch(url, { method, headers });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return result;
    } catch (error){
        console.error(error)
        return null;
    }
}


/*
{
    "id": 6,
    "name": "Екатерина IVanova",
    "email": "23@ex.ru",
    "telephone_number": "89934293969",
    "role": "user",
    "portfolio": {
        "id": 34,
        "experience": 0,
        "certificates": null,
        "description": "Мое первое портфолио",
    },
    "favoriteUslugas": [],
    "uslugas": [
        {
            "id": 8,
            "name": "2",
            "description": "2",
            "category": "Категория 2",
            "location": "Rfpfym",
            "coordinates": null,
            "slots": [
                {
                    "id": 18,
                    "date": "2024-12-23T00:00:00.000+00:00",
                    "time": "13:13:00",
                    "available": false
                },
                {
                    "id": 19,
                    "date": "2024-12-25T00:00:00.000+00:00",
                    "time": "12:12:00",
                    "available": false
                },
                {
                    "id": 20,
                    "date": "2024-12-25T00:00:00.000+00:00",
                    "time": "17:17:00",
                    "available": true
                },
                {
                    "id": 21,
                    "date": "2024-12-26T00:00:00.000+00:00",
                    "time": "19:14:00",
                    "available": false
                },
                {
                    "id": 22,
                    "date": "2024-12-22T00:00:00.000+00:00",
                    "time": "12:12:00",
                    "available": true
                }
            ],
            "price": 2000,
            "durationMinutes": 90
        },
        {
            "id": 9,
            "name": "dsbjb",
            "description": "dsjbdjs",
            "category": "Категория 2",
            "location": "sdbs",
            "coordinates": null,
            "slots": [
                {
                    "id": 23,
                    "date": "2024-12-26T00:00:00.000+00:00",
                    "time": "12:12:00",
                    "available": true
                },
                {
                    "id": 24,
                    "date": "2024-12-24T00:00:00.000+00:00",
                    "time": "12:12:00",
                    "available": true
                },
                {
                    "id": 25,
                    "date": "2024-12-25T00:00:00.000+00:00",
                    "time": "12:12:00",
                    "available": true
                },
                {
                    "id": 26,
                    "date": "2024-12-24T00:00:00.000+00:00",
                    "time": "22:26:00",
                    "available": true
                },
                {
                    "id": 27,
                    "date": "2024-12-23T00:00:00.000+00:00",
                    "time": "07:15:00",
                    "available": true
                }
            ],
            "price": 2000,
            "durationMinutes": 90
        }
    ],
    "writtenReviews": [],
    "receivedReviews": []
}
 */