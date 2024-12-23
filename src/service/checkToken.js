export function decodeToken(token) {
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );

    return JSON.parse(jsonPayload);
}


export function isTokenExpired(token) {

    const userID = localStorage.getItem('userID');
    if (userID === 0) {
        return true;
    }

    try {
        const payload = decodeToken(token);

        const currentTime = Math.floor(Date.now() / 1000);

        return payload.exp < currentTime;
    } catch (err) {
        if (localStorage.getItem('userID') === 0) {
            return true;
        }
        console.error("Ошибка декодирования токена:", err);
        localStorage.removeItem('token');
        return true;
    }
}

export function userIsAuthenticated() {
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    if (userID === '0') {
        return true;
    }
    if (!token || isTokenExpired(token) || !userID) {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        localStorage.removeItem('isAuthorized');
        return false;
    } else return !!userID;
}
