import axios from 'axios';

export async function loginUser(email, password) {
    try {
        const encodedEmail = encodeURIComponent(email);
        //const response = await axios.get(`http://localhost:8080/user/${encodedEmail}`);

        //TODO: стоит заглушка
        const response = {
            status: 200,
            data: {
                email: 'alice@example.com',
                id: 1,
                password: '12341234'
            }
        };

        //TODO: обработка других статусов
        if (response.status === 200) {
            if (response.data.password === password) {
                return { success: true, userId: response.data.id };
            } else {
                return { success: false, message: 'Неверный пароль. Попробуйте снова.' };
            }
        }
    } catch (error) {
        return { success: false, message: 'Ошибка входа. Пожалуйста, проверьте введенные данные.' };
    }
}


