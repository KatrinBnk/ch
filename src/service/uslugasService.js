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