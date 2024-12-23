import axios from 'axios';

export async function loginUser(email, password) {
    try {
        const response = await axios.post('http://localhost:8080/login', {
            username: email,
            password: password,
        });

        if (response.status === 200 && response.headers.authorization) {
            const token = response.headers.authorization;
            localStorage.setItem('token', token);

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
                return { success: false, message: 'Не удалось получить данные пользователя.'};
            }
        } else {
            return {
                success: false,
                message: 'Ошибка авторизации. Проверьте почту и пароль.'
            };
        }
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        if (error.response.status === 403) {
            return {
                success: false,
                message: 'Введены неверные данные пользователя. Проверьте почту и пароль.',
                code: 403
            };
        }
        return {
            success: false,
            message: 'Ошибка подключения к серверу. Попробуйте позже.',
            code: 500
        };
    }
}


export async function registerUser(user) {
    try {
        const response = await axios.post('http://localhost:8080/user', {
            name: user.name,
            email: user.email,
            telephone_number: user.tel,
            password: user.password,
            role: user.role
        });

        if (response.status === 201) {
            const loginResult = await loginUser(user.email, user.password);

            if (loginResult.success) {
                console.log('Пользователь успешно авторизован после регистрации!');
                return { success: true, message: 'Регистрация и авторизация успешны.' };
            } else {
                console.error('Не удалось авторизовать пользователя после регистрации.');
                return { success: false, message: loginResult.message };
            }
        } else {
            return {
                success: false,
                message: 'Ошибка при регистрации пользователя. Пожалуйста, попробуйте позже.',
            };
        }
    } catch(error){
        console.error('Ошибка при регистрации:', error);

        if (error.response.status === 403){
            return {
                success: false,
                message: 'Пользователь с такими данными уже зарегистрирован. ',
            };
        }
        return {
            success: false,
            message: 'Ошибка подключения к серверу. Попробуйте позже.',
        };
    }

}