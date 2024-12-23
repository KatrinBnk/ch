import axios from 'axios';
import {isTokenExpired} from "@/service/checkToken.js";
import {fetchUslugas} from "@/service/uslugasService.js"

// Запись по ID слота
export async function makeAppointment(userID, slotID) {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        const response = await axios.post(`http://localhost:8080/applications/${userID}/${slotID}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
        });

        return response.data;

    } catch (error){
        console.error(error);
    }
}

export async function canselAppointment(appID) {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    try {
        const response = await axios.delete(`http://localhost:8080/applications/${appID}`, {
            headers:{
                "Authorization": token,
            }
        })

        return true;
    } catch (error){
        console.error(error);
        return false
    }
}

export async function getFreeSlots(uslugaID) {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    const allUslugas = await fetchUslugas();

    const currentUsluga = allUslugas.filter(usluga => usluga.id === uslugaID)[0];

    return currentUsluga.slots.filter(slot => slot.available);
}


