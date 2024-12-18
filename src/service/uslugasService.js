import axios from "axios";
import {isTokenExpired} from "@/service/checkToken.js";



export async function filterServices({ selectedCategories, searchQuery, location, minPrice, maxPrice }) {
    let url = 'http://localhost:8080/usluga/all';  // По умолчанию получаем все услуги

    // Если локация указана, делаем запрос по локации
    if (location) {
        url = `http://localhost:8080/usluga/city?location=${encodeURIComponent(location)}`;
    }

    try {
        // Получаем услуги с сервера (по локации или все услуги)
        const response = await axios.get(url);
        const services = response.data || [];
        console.log(services);

        // Фильтрация услуг по категориям, цене и поисковому запросу
        return services.filter(service => {
            let matchesCategory = true;
            if (selectedCategories.length > 0) {
                matchesCategory = selectedCategories.includes(service.category);
            }

            let matchesPrice = true;
            if (minPrice && service.price < minPrice) {
                matchesPrice = false;
            }
            if (maxPrice && service.price > maxPrice) {
                matchesPrice = false;
            }

            let matchesSearchQuery = true;
            if (searchQuery) {
                matchesSearchQuery = service.name.toLowerCase().includes(searchQuery.toLowerCase());
            }

            return matchesCategory && matchesPrice && matchesSearchQuery;
        });
    } catch (error) {
        console.error("Ошибка фильтрации услуг:", error);
        return [];
    }
}


export async function fetchUslugas() {
    try {
        const response = await axios.get('http://localhost:8080/usluga/all');
        return response.data || [];

    } catch (error) {
        console.error("Ошибка получения списка всех услуг:", error);
        return [];
    }
}

export async function getServiceByMasterID(masterID) {

    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        const response = await axios.get(`http://localhost:8080/usluga/${masterID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return(response.data);
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        throw error;
    }
}

export async function createServiceByMasterID(masterID, usluga) {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        const response = await axios.post(`http://localhost:8080/usluga/create/${masterID}`,
            usluga,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        return( response.data );
    } catch (error){
        console.error('Ошибка при создании услуги:', error);
        throw error;
    }
}

export async function updateService(usluga) {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }
    console.log(usluga)

    try {
        const response = await axios.put(`http://localhost:8080/usluga/${usluga.id}`,
            usluga,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        return( response.data );
    } catch (error){
        console.error('Ошибка при создании услуги:', error);
        throw error;
    }
}


export async function filter2({ selectedCategories, searchQuery, location, minPrice, maxPrice }){
    try {
        // Получаем услуги с сервера (по локации или все услуги)
        const services = [
            {
                "id": 1,
                "name": "услуга 1",
                "description": "Пример описания услуги 1",
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
                "name": "услуга 2",
                "description": "Услуга 2, категория 4",
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
                "name": "Пример",
                "description": "Пример услуги, категория 3",
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
        ];

        console.log("here", services)

        // Фильтрация услуг по категориям, цене и поисковому запросу
        return services.filter(service => {
            let matchesCategory = true;
            if (selectedCategories.length > 0) {
                matchesCategory = selectedCategories.includes(service.category);
            }

            let matchesPrice = true;
            if (minPrice && service.price < minPrice) {
                matchesPrice = false;
            }
            if (maxPrice && service.price > maxPrice) {
                matchesPrice = false;
            }

            let matchesSearchQuery = true;
            if (searchQuery) {
                matchesSearchQuery = service.name.toLowerCase().includes(searchQuery.toLowerCase());
            }

            return matchesCategory && matchesPrice && matchesSearchQuery;
        });
    } catch (error) {
        console.error("Ошибка фильтрации услуг:", error);
        return [];
    }
}