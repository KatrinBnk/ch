import axios from 'axios';

export async function loginUser(email, password) {
    try {
        // Авторизация пользователя
        const response = await axios.post('http://localhost:8080/login', {
            username: email,
            password: password,
        });

        console.log(response);

        if (response.status === 200 && response.headers.authorization) {
            const token = response.headers.authorization;
            localStorage.setItem('token', token);

            // Запрос данных пользователя по email
            const userResponse = await axios.get(`http://localhost:8080/user/email/${email}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (userResponse.status === 200 && userResponse.data) {
                const userId = userResponse.data.id;
                localStorage.setItem('userID', userId);
                console.log('Пользователь успешно авторизован и данные сохранены!');
                return { success: true, token, userId };
            } else {
                console.error('Не удалось получить данные пользователя.');
                return { success: false, message: 'Не удалось получить данные пользователя.' };
            }
        } else {
            return {
                success: false,
                message: 'Ошибка авторизации. Проверьте логин и пароль.',
            };
        }
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        return {
            success: false,
            message: 'Ошибка подключения к серверу. Попробуйте позже.',
        };
    }
}
