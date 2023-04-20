const today = new Date();
let calendar;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

window.onload = () => {
    const monthLabel = document.querySelector('.month-chooser div:nth-child(2)'); 
    monthLabel.innerText = months[today.getMonth()];

    const calendarWrapper = document.querySelector('.calendar');
    calendar = new Calendar(calendarWrapper, today.getMonth()+1, today.getFullYear());
    calendar.create();
}