export function decodeToken(token) {
    // Убираем префикс "Bearer ", если он есть
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    const base64Url = token.split(".")[1]; // Извлекаем payload (вторую часть)
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );

    return JSON.parse(jsonPayload); // Возвращаем объект payload
}


export function isTokenExpired(token) {
    try {
        const payload = decodeToken(token);

        // Получаем текущую временную метку (в секундах)
        const currentTime = Math.floor(Date.now() / 1000);

        // Сравниваем текущую метку времени с `exp` из токена
        return payload.exp < currentTime;
    } catch (err) {
        console.error("Ошибка декодирования токена:", err);
        localStorage.removeItem('token');
        return true;
    }
}
