// TODO: стоит заглушка на данные
export async function getScheduleItemsForDay(userId, day) {
    console.log(`Запрос расписания для пользователя ${userId} на день ${day}`);
    if (day === "2024-11-04") {
        return [
            {
                uslugaName: 'Наращивание волос',
                startTime: `${day}T10:00:00`,
                endTime: `${day}T12:00:00`
            },
            {
                uslugaName: 'Маникюр',
                startTime: `${day}T14:00:00`,
                endTime: `${day}T15:30:00`
            }
        ];
    }
    return [
        {
            uslugaName: 'Маникюр',
            startTime: `${day}T10:00:00`,
            endTime: `${day}T12:00:00`
        },
        {
            uslugaName: 'Наращивание волос',
            startTime: `${day}T14:00:00`,
            endTime: `${day}T17:30:00`
        }
    ];
}
