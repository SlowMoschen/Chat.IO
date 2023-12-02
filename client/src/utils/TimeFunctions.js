export const getCurrentTime = () => {
    const date = new Date()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${hour < 10 ? 0 : ''}${hour}:${minute < 10 ? 0 : ''}${minute}`
}