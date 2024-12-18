import axios from 'axios';
import {isTokenExpired} from "@/service/checkToken.js";
import {fetchUslugas} from "@/service/uslugasService.js"

export async function makeAppointment(userID, uslugaID, slot) {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    console.log(slot);

    try {
        const response = await axios.post(`http://localhost:8080/applications/${userID}/${uslugaID}`,
            {
            date: slot.date,
            time: slot.time
            },
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


export async function getFreeSlots(uslugaID) {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        console.error("Токен отсутствует или истёк. Требуется авторизация.");
        throw new Error("Токен отсутствует или истёк. Требуется авторизация.");
    }

    const allUslugas = await fetchUslugas();

    const currentUsluga = allUslugas.filter(usluga => usluga.id === uslugaID)[0];
    console.log(currentUsluga);

    const availableSlots = currentUsluga.slots.filter(slot => slot.available);
    console.log(availableSlots)
    return availableSlots;
}


