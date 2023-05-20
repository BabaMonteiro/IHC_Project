let calendar, emotionsHandler;
const today = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const yearLabel = document.querySelector(".year > div:nth-child(2)");
const monthLabel = document.querySelector('.month-chooser div:nth-child(2)'); 

const urlParams = new URLSearchParams(window.location.search);
let date = today;
if (urlParams.has('date')) {
    const urlDate = urlParams.get('date').split('-');
    const newDate = new Date(urlDate[0] + "-01-" + urlDate[1]);
    if (newDate != "Invalid Date" && newDate <= today)
        date = newDate;
}

const updateUrlValue = (key, value) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.replaceState(null, '', newUrl);
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

    const updateAll = (month, year) => {
        updateCalendar(calendar, month, year);
        emotionsHandler.update(calendar);
        updateEmotionsProgress(emotionsHandler);
    
        // update url value to match the new month
        updateUrlValue('date', `${month}-${year}`);

        const selectedEmotion = Array.from(document.querySelectorAll(".emotion > i")).find(emotion => emotion.getAttribute("state"));
        if (selectedEmotion)
            defocusEmotions(selectedEmotion.className.split(" ")[1]);
    }

    const prevMonthBtn = document.querySelector('.month-chooser div:nth-child(1)');
    const nextMonthBtn = document.querySelector('.month-chooser div:nth-child(3)');
    const prevYearBtn = document.querySelector('.year div:nth-child(1)');
    const nextYearBtn = document.querySelector('.year div:nth-child(3)');
    
    prevMonthBtn.addEventListener('click', () => {
        const month = calendar.month - 1 < 1 ? 12 : calendar.month - 1;
        const year = calendar.month - 1 < 1 ? calendar.year - 1 : calendar.year;
        updateAll(month, year);
    });

    nextMonthBtn.addEventListener('click', () => {
        const month = calendar.month + 1 > 12 ? 1 : calendar.month + 1;
        const year = calendar.month + 1 > 12 ? calendar.year + 1 : calendar.year;
        updateAll(month, year);
    });

    prevYearBtn.addEventListener('click', () => {
        const month = calendar.month;
        const year = calendar.year - 1;
        updateAll(month, year);
    });

    nextYearBtn.addEventListener('click', () => {
        const month = calendar.month;
        const year = calendar.year + 1;
        updateAll(month, year);
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

const defocusEmotions = emotionClass => {
    const emotions = Array.from(document.querySelectorAll(".fa-solid"));
    const emotionsProgressBars = Array.from(document.querySelectorAll('.emotions-progress > div'));

    // defocus all emotions except the selected one
    Array.from(emotions).forEach(emotion => {
        if (!emotion.classList.contains(emotionClass) && !emotion.closest(".navbar") && !emotion.closest(".navbar-top"))
            emotion.style.opacity = "0.3";
    });

    // defocus all progress bars except the selected one
    Array.from(emotionsProgressBars).forEach(bar => {
        if (bar.getAttribute("class-value") != emotionClass)
            bar.style.opacity = "0.3";
    });
}

document.addEventListener("click", e => {
    if (e.target.closest(".days") && e.target.className != "week-row days") {
        const day = e.target.innerText == "" ? e.target.parentElement.innerText : e.target.innerText;
        const month = calendar.month;
        const year = calendar.year;
        if (new Date(`${month}-${day}-${year}`) <= today)
            window.location.href = `journal.html?date=${month}-${day}-${year}`;
    }

    if (e.target.closest(".emotion")) {
        const emotionI = e.target.closest(".emotion").querySelector("i");
        const emotionClass = emotionI.className.split(" ")[1];

        const emotions = Array.from(document.querySelectorAll(".fa-solid"));
        const emotionsProgressBars = Array.from(document.querySelectorAll('.emotions-progress > div'));

        // reset opacity
        Array.from(emotions).forEach(emotion => emotion.style.removeProperty("opacity"));
        Array.from(emotionsProgressBars).forEach(bar => bar.style.removeProperty("opacity"));

        if (emotionI.getAttribute("state") != "selected") {
            // remove selected state from all emotions
            Array.from(emotions).forEach(emotion => emotion.removeAttribute("state"));

            defocusEmotions(emotionClass);

            emotionI.setAttribute("state", "selected");
        } else emotionI.removeAttribute("state");
    }
});