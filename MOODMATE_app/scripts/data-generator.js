/*
 * This scripts generates random data for the application. 
 * Run only once otherwise current data might be corrupted.
 */

(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const emotions = ["smile-beam", "smile", "meh", "frown", "angry"];
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const year = urlParams.get('year') || threeMonthsAgo.getFullYear();
    const month = urlParams.get('month') || threeMonthsAgo.getMonth() + 1;
    const day = urlParams.get('day') || threeMonthsAgo.getDate();

    const oldestDate = new Date(year, month - 1, day);
    const oldestYear = oldestDate.getFullYear();
    const oldestMonth = oldestDate.getMonth();
    const oldestDay = oldestDate.getDate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let emotionsData = [];
    let datesGenerated = [];

    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    let currentDate = new Date(oldestDate);
    while (currentDate <= yesterday || currentDate.getMonth() == yesterday.getMonth()) {
        console.log(currentDate, yesterday);
        let tag = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1);

        // loop through each day in the month
        let daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        let data = [];
        const firstDay = oldestMonth == currentDate.getMonth() && oldestYear == currentDate.getFullYear() ? oldestDay : 1;
        const lastDay = currentDate.getMonth() == yesterday.getMonth() && currentDate.getFullYear() == yesterday.getFullYear() ? yesterday.getDate() : daysInMonth;
        for (let day = firstDay; day <= lastDay; day++) {
            const randomEmotion = emotions[random(0, emotions.length - 1)];
            data.push({
                day: day,
                emotion: randomEmotion
            });

            // save journal emotion entry to local storage
            localStorage.setItem(
                `journal-${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`,
                JSON.stringify({
                    emotion: randomEmotion,
                    journalContent: "This journal entry was generated automatically."
                })
            );
        }
        emotionsData.push({[tag]: data});
        data = [];

        // Move to the next month and year
        const nextMonth = currentDate.getMonth() === 11 ? 0 : currentDate.getMonth() + 1;
        const nextYear = nextMonth === 0 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
        currentDate.setMonth(nextMonth);
        currentDate.setFullYear(nextYear);
    }

    let saver;
    for (let emotion of emotionsData) {
        const date = Object.keys(emotion)[0];
        datesGenerated.push(date);
        saver = new EmotionsSaver(localStorage, date.split('-')[0], date.split('-')[1]);
        saver.addAll(emotion[date]);
    }

    // print emotions data to body
    const body = document.querySelector('body');
    const pre = document.createElement('pre');
    pre.innerText = JSON.stringify(emotionsData, null, 4);
    body.appendChild(pre);
})();