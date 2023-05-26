class EmotionsHandler {
    constructor(calendar, legend, emotions=[]) {
        this.calendar = calendar;
        this.legend = legend;
        this.emotions = emotions;

        if (this.calendar == null)
            throw new Error("Calendar is not initialized");

        this.saver = new EmotionsSaver(localStorage, calendar.year, calendar.month);
    }

    load() {
        this.emotions = this.saver.get(this.calendar.year, this.calendar.month);
    }

    put() {
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
        for (let div of valuesDivs) {
            const emotion = div.parentElement.querySelector("i").classList[1].replace("fa-face-", "");
            div.innerText = values[emotion] || 0;
        }
    }

    add(day, emotion) {
        this.emotions.push({day, emotion});
        this.saver.add(day, emotion);

        this.put();
        this.updateLegend();
    }

    get(day) {
        return this.emotions.find(e => e.day == day);
    }

    getType(type) {
        return this.emotions.filter(e => e.emotion == type);
    }
}

class EmotionsSaver {
    constructor(storage, year, month) {
        if (storage == null)
            throw new Error("Storage is not initialized");

        this.storage = storage;
        this.year = year;
        this.month = month;
        this.tag = `emotions-${this.year}-${this.month}`;
        
        this.emotions = storage.getItem(this.tag);
        this.emotions = this.emotions ? JSON.parse(this.emotions) : [];
        this.datesWithData = storage.getItem("dates-with-data");
        this.datesWithData = this.datesWithData ? JSON.parse(this.datesWithData) : [];
    }


    add(day, emotion) {
        if (this.emotions.find(e => e.day == day))
            this.emotions = this.emotions.filter(e => e.day != day);
        this.emotions.push({day, emotion})
        this.storage.setItem(`emotions-${this.year}-${this.month}`, JSON.stringify(this.emotions));
        this.updateDatesTracking();
    }

    addAll(emotions) {
        this.storage.setItem(`emotions-${this.year}-${this.month}`, JSON.stringify(emotions));

        this.updateDatesTracking();
    }

    get(year, month) {
        const emotions = this.storage.getItem(`emotions-${year}-${month}`);
        return emotions ? JSON.parse(emotions) : [];
    }

    updateDatesTracking() {
        if (!this.datesWithData.includes(`emotions-${this.year}-${this.month}`))
            this.datesWithData.push(`emotions-${this.year}-${this.month}`);
        this.storage.setItem("dates-with-data", JSON.stringify(this.datesWithData));
    }
}