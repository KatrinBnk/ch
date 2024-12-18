import axios from 'axios';
import Dexie from 'dexie';


const API_URL = "http://localhost:8080/usluga/all";
const TTL =300000; // 5 мин в миллисекундах

const db = new Dexie("CategoryDatabase");
db.version(1).stores({
    categories: 'id, label, timestamp' // Поля: уникальный идентификатор, название категории, временная метка
});

async function setCategoriesToDB(categories) {
    const timestamp = Date.now();
    await db.categories.clear();
    const categoriesWithTimestamp = categories.map((category, index) => ({
        id: index + 1,
        label: category,
        timestamp
    }));
    await db.categories.bulkAdd(categoriesWithTimestamp);
}

export async function getCategoriesFromDB() {
    return await db.categories.toArray();
}

function isExpired(timestamp) {
    const now = Date.now();
    return (now - timestamp) > TTL;
}


export async function fetchCategories() {
    try {
        const storedCategories = await getCategoriesFromDB();

        if (storedCategories.length > 0) {
            const { timestamp } = storedCategories[0];
            if (!isExpired(timestamp)) {
                return storedCategories.map(cat => cat.label);
            }
        }

        const response = await axios.get(API_URL);
        const categoriesSet = new Set(response.data.map(usluga => usluga.category));
        const categories = Array.from(categoriesSet);

        await setCategoriesToDB(categories);

        return categories;
    } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        try {
            const storedCategories = await getCategoriesFromDB();
            if (storedCategories.length > 0) {
                console.warn('Возвращаются устаревшие категории из IndexedDB.');
                return storedCategories.map(cat => cat.label);
            }
        } catch (dbError) {
            console.error('Ошибка при получении категорий из IndexedDB:', dbError);
        }
        throw error;
    }
}

export async function clearCategoriesFromDB() {
    await db.categories.clear();
}
