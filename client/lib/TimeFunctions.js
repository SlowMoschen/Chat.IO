export const getCurrentTime = () => {
    const date = new Date()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${hour}:${minute}`
}