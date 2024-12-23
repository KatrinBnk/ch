import {getUser} from "@/service/userDataService.js";
import {isTokenExpired} from "@/service/checkToken.js";


export async function getFavorites(userID) {
    try {
        const userInfo = await getUser(userID);

        const favoriteUslugas = userInfo.favoriteUslugas; //Массив объектов-услуг
        //сохраним только айдишники избранных услуг
        return favoriteUslugas.map(usluga => usluga.id);
    } catch (error){
        console.error(error)
        return [];
    }
}

export async function getFavoriteUslugas(userID) {
    try {
        const userInfo = await getUser(userID);
         //Массив объектов-услуг
        return userInfo.favoriteUslugas;
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