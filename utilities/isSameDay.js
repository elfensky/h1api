function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

// Example usage:
const date1 = new Date('2023-10-05T10:00:00');
const date2 = new Date('2023-10-05T15:30:00');

console.log(isSameDay(date1, date2)); // true

const date3 = new Date('2023-10-06T10:00:00');

console.log(isSameDay(date1, date3)); // false
