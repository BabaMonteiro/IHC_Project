let calendar, emotionsHandler;
const today = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const yearLabel = document.querySelector(".year");
const monthLabel = document.querySelector('.month-chooser div:nth-child(2)'); 

const urlParams = new URLSearchParams(window.location.search);
let date = today;
if (urlParams.has('date')) {
    const urlDate = urlParams.get('date').split('-');
    const newDate = new Date(urlDate[0] + "-01-" + urlDate[1]);
    if (newDate != "Invalid Date" && newDate <= today)
        date = newDate;
}

window.onload = () => {
    yearLabel.innerText = date.getFullYear();
    monthLabel.innerText = months[date.getMonth()];

    const calendarWrapper = document.querySelector('.calendar');
    calendar = new Calendar(calendarWrapper, date.getMonth()+1, date.getFullYear(), {
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
        updateEmotionsProgress(emotionsHandler);
    });

    nextMonthBtn.addEventListener('click', () => {
        const month = calendar.month + 1 > 12 ? 1 : calendar.month + 1;
        const year = calendar.month + 1 > 12 ? calendar.year + 1 : calendar.year;
        updateCalendar(calendar, month, year);
        emotionsHandler.update(calendar);
        updateEmotionsProgress(emotionsHandler);
    });

    // fill calendar with emotions data
    emotionsHandler.load();
    emotionsHandler.put();
    emotionsHandler.updateLegend();

    // update emotions progress bar
    updateEmotionsProgress(emotionsHandler);
}

const updateEmotionsProgress = (emotionsHandler) => {
    const emotionsValues = [
        emotionsHandler.getType("angry").length,
        emotionsHandler.getType("frown").length,
        emotionsHandler.getType("meh").length,
        emotionsHandler.getType("smile").length,
        emotionsHandler.getType("smile-beam").length];
    console.log(emotionsValues);
    const total = emotionsValues.reduce((a, b) => a + b, 0);
    const emotionsProgress = document.querySelector('.emotions-progress');
    const emotionsProgressBars = Array.from(emotionsProgress.querySelectorAll('.emotions-progress > div'));
    emotionsValues.forEach((value, index) => {
        const bar = emotionsProgressBars[index];
        bar.style.width = total == 0 ? "0%" : `${value / total * 100}%`;
    });

}

const updateCalendar = (calendar, month, year) => {
    yearLabel.innerText = year;
    monthLabel.innerText = months[month - 1];
    calendar.fill(month, year);
}

document.addEventListener("click", e => {
    if (e.target.closest(".days") && e.target.className != "week-row days") {
        const day = e.target.innerText == "" ? e.target.parentElement.innerText : e.target.innerText;
        const month = calendar.month;
        const year = calendar.year;
        if (new Date(`${month}-${day}-${year}`) <= today)
            window.location.href = `journal.html?date=${month}-${day}-${year}`;
    }
});