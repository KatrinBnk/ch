import axios from 'axios';

export async function getAllUslugar() {
    try {
        const response = await axios.get('http://localhost:8080/usluga/all');
        return response.data || []; // Возвращаем массив
    } catch (error) {
        console.error("Ошибка получения списка всех услуг:", error);
        return [];
    }
}

export async function getLocationUslugas(location) {
    try {
        const response = await axios.get(`http://localhost:8080/usluga/city?location=${location}`);
        return response.data || []; // Возвращаем массив
    } catch (error) {
        console.error("Ошибка получения услуг по локации:", error);
        return [];
    }
}


export async function getUslugasByName(name) {
    try {
        const response = await axios.get(`http://localhost:8080/usluga/search`, {
            params: { name: name }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка получения услуг по имени:", error);
        throw error;
    }
}

export async function getFilteredServices(filters, searchQuery, location) {
    try {

        if (!location && !searchQuery && filters.length === 0) {
            return await getAllUslugar();
        }


        let results = [];
        let locationResults = [];

        if (location) {
            locationResults = await getLocationUslugas(location);
            if (!searchQuery && filters.length === 0){
                return locationResults;
            }
        }

        if (searchQuery) {
            const searchResults = await getUslugasByName(searchQuery);
            results = [...results, ...searchResults];
        }

        for (const filter of filters) {
            const filterResults = await getUslugasByName(filter);
            results = [...results, ...filterResults];
        }

        const uniqueResults = results.reduce((acc, current) => {
            const exists = acc.find(item => item.id === current.id);
            if (!exists) acc.push(current);
            return acc;
        }, []);

        if (location) {
            const locationIds = new Set(locationResults.map(service => service.id));
            return uniqueResults.filter(service => locationIds.has(service.id));
        }

        return uniqueResults;
    } catch (error) {
        console.error("Ошибка фильтрации услуг:", error);
        throw error;
    }
}
