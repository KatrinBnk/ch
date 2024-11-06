import axios from 'axios';

export async function getUser(userID) {
    try {
        //const response = await axios.get(`http://localhost:8080/user/${userID}`);
        //TODO: стоит заглушка
        const response = {
            status: 200,
            data: {
                id: userID,
                name: 'Виктория Степановна',
                email: 'i@example.com',
                telephone_number: '+1234567890',
                role: 'user',
                profilePicture: [],
            }
        };

        const userData = response.data;
        delete userData.password;

        return userData;
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        throw error;
    }
}
