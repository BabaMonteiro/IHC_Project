let calendar, emotionsHandler;
const today = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const yearLabel = document.querySelector(".year");
const monthLabel = document.querySelector('.month-chooser div:nth-child(2)'); 

window.onload = () => {
    yearLabel.innerText = today.getFullYear();
    monthLabel.innerText = months[today.getMonth()];

    const calendarWrapper = document.querySelector('.calendar');
    calendar = new Calendar(calendarWrapper, today.getMonth()+1, today.getFullYear(), {
        highlightToday: true,
        primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--navbar-color'),
    });
    
    calendar.create(() => calendarWrapper.querySelector("p").remove());
    emotionsHandler = new EmotionsHandler(calendar, document.querySelector('.emotions'));

    const prevMonthBtn = document.querySelector('.month-chooser div:nth-child(1)');
    const nextMonthBtn = document.querySelector('.month-chooser div:nth-child(3)');

    prevMonthBtn.addEventListener('click', () => {
        const month = calendar.month - 1 < 1 ? 12 : calendar.month - 1;
        const year = calendar.month - 1 < 1 ? calendar.year - 1 : calendar.year;
        updateCalendar(calendar, month, year);
        emotionsHandler.update(calendar);
    });

    nextMonthBtn.addEventListener('click', () => {
        const month = calendar.month + 1 > 12 ? 1 : calendar.month + 1;
        const year = calendar.month + 1 > 12 ? calendar.year + 1 : calendar.year;
        updateCalendar(calendar, month, year);
        emotionsHandler.update(calendar);
    });

    // fill calendar with emotions data
    emotionsHandler.load();
    emotionsHandler.put();
    emotionsHandler.updateLegend();
}

const updateCalendar = (calendar, month, year) => {
    yearLabel.innerText = year;
    monthLabel.innerText = months[month - 1];
    calendar.fill(month, year);
}

document.addEventListener("click", e => {
    if (e.target.closest(".days") && e.target.className != "week-row days") {
        const day = e.target.innerText;
        const month = calendar.month;
        const year = calendar.year;
        if (Number(day) <= new Date().getDate())
            window.location.href = `journal.html?date=${month}-${day}-${year}`;
    }
});