/*
 * This scripts generates random data for the application. 
 * Run only once otherwise current data might be corrupted.
 */

(function () {
    // data for history
    const year = 2023;
    const month = 2;
    const day = 12;
    const emotions = ["smile-beam", "smile", "meh", "frown", "angry"];
    const oldestDate = new Date(year, month - 1, day);
    const oldestYear = oldestDate.getFullYear();
    const oldestMonth = oldestDate.getMonth();
    const oldestDay = oldestDate.getDate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let emotionsData = [];

    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    let currentDate = new Date(oldestDate);
    while (currentDate <= yesterday) {
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
        }
        emotionsData.push({[tag]: data});
        data = [];

        // Move to the next month and year
        const nextMonth = currentDate.getMonth() === 11 ? 0 : currentDate.getMonth() + 1;
        const nextYear = nextMonth === 0 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
        currentDate.setMonth(nextMonth);
        currentDate.setFullYear(nextYear);
    }

    for (let emotion of emotionsData) {
        localStorage.setItem(Object.keys(emotion)[0], JSON.stringify(emotion[Object.keys(emotion)[0]]));
    }

    // print emotions data to body
    const body = document.querySelector('body');
    const pre = document.createElement('pre');
    pre.innerText = JSON.stringify(emotionsData, null, 4);
    body.appendChild(pre);
})();