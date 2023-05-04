class EmotionsHandler {
    constructor(calendar, legend, emotions=[]) {
        this.calendar = calendar;
        this.legend = legend;
        this.emotions = emotions;
    }

    load() {
        const emotionsData = localStorage.getItem(`${calendar.year}-${calendar.month}`);
        this.emotions = emotionsData ? JSON.parse(emotionsData) : [];
    }

    put() {
        if (this.calendar == null)
            throw new Error("Calendar is not initialized");

        const calendarWrapper = this.calendar.container;
        const days = Array.from(calendarWrapper.querySelectorAll(".days div div"))
            .filter(div => div.innerText != "");

        for (let i = 0; i < days.length; i++) {
            const day = days[i];

            // remove old emotion
            const oldEmotion = day.parentElement.querySelector(".fa-solid");
            if (oldEmotion) oldEmotion.remove();

            const dayNumber = parseInt(day.innerText);
            const emotion = this.emotions.find(e => e.day == dayNumber);
            if (emotion) {
                const emotionDiv = document.createElement('div');
                emotionDiv.classList.add('fa-solid');
                emotionDiv.classList.add("fa-face-"+emotion.emotion);
                day.classList.add("has-emotion");
                day.parentElement.appendChild(emotionDiv);
            }
        }
    }

    update(calendar) {
        this.calendar = calendar;
        this.load();
        this.clear();
        this.put();
        this.updateLegend();
    }

    clear() {
        const calendarWrapper = this.calendar.container;
        const days = Array.from(calendarWrapper.querySelectorAll(".has-emotion"));
        for (let day of days) {
            const oldEmotion = day.parentElement.querySelector(".fa-solid");
            if (oldEmotion) oldEmotion.remove();
            day.classList.remove("has-emotion");
        }
    }

    updateLegend() {
        if (this.legend == null)
            throw new Error("Legend is not initialized");

        const valuesDivs = this.legend.querySelectorAll(".emotion-count");
        const values = {};
        this.emotions.forEach(({ emotion }) => values[emotion] = (values[emotion] || 0) + 1);
        console.log(values);
        for (let div of valuesDivs) {
            const emotion = div.parentElement.querySelector("i").classList[1].replace("fa-face-", "");
            div.innerText = values[emotion] || 0;
        }
    }

    add(day, emotion) {
        const emotionData = { day, emotion };
        this.emotions.push(emotionData);
        localStorage.setItem(`${calendar.year}-${calendar.month}`, JSON.stringify(this.emotions));
        
        let datesGenerated = localStorage.getItem("dates-with-data");
        datesGenerated = datesGenerated ? JSON.parse(datesGenerated) : [];
        if (!datesGenerated.includes(`${calendar.year}-${calendar.month}`))
            datesGenerated.push(`${calendar.year}-${calendar.month}`);
        localStorage.setItem("dates-with-data", JSON.stringify(datesGenerated));

        this.put();
        this.updateLegend();
    }
}