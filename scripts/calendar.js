class Calendar {
    constructor(container, month, year) {
        this.container = container;
        this.update(month, year);
        this.weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        this.maxRowsInMonth = 6;
        this.daysInWeek = 7;
    }

    create() {
        for (let i = 0; i < this.maxRowsInMonth + 1; i++) {
            const daysRow = document.createElement('div');
            daysRow.classList.add('week-row');
            daysRow.classList.add(i == 0 ? 'week' : 'days');
            for (let j = 0; j < this.daysInWeek; j++) {
                const dayCell = document.createElement('div');
                const cellContent = document.createElement('div');
                cellContent.innerText = i == 0 ? this.weekDays[j].charAt(0) : '';
                dayCell.appendChild(cellContent);
                daysRow.appendChild(dayCell);
            }
            this.container.appendChild(daysRow);
        }

        this.fill();
    }

    update(month, year) {
        this.month = month;
        this.year = year;
        this.daysInMonth = new Date(this.year, this.month, 0).getDate();
        this.firstDayPos = new Date(this.year, this.month - 1, 1).getDay();
        this.lastDayPos = new Date(this.year, this.month, 0).getDay();
        this.numberOfRows = Math.ceil((this.firstDayPos + this.daysInMonth) / 7);
    }

    fill(month, year) {
        this.clear();

        if (month && year)
            this.update(month, year);

        const rows = this.container.querySelectorAll('.days');
        const cellsContent = this.mapDays();
        for (let i = 0; i < cellsContent.length; i++) {
            let row = cellsContent[i];
            let elementsRow = rows[i].children;
            for (let j = 0; j < row.length; j++) {
                const cellContent = elementsRow[j].querySelector('div');
                cellContent.innerText = row[j];
            }
        }
    }

    mapDays() {
        const days = [];
        let week = [];
        let currentDay = 1;
        console.log(this.daysInWeek, this.firstDayPos);
        // first week
        for (let i = 0; i < this.daysInWeek; i++) {
            currentDay = i < this.firstDayPos ? '' : i - this.firstDayPos + 1;
            week.push(currentDay);
        }
        currentDay++;
        days.push(week);

        // other weeks
        for (let i = 0; i < this.numberOfRows - 1; i++) {
            week = [];
            for (let j = 0; j < this.daysInWeek; j++) {
                week.push(currentDay > this.daysInMonth ? '' : currentDay);
                currentDay++;
            }
            days.push(week);
        }

        return days;
    }

    clear() {
        const rows = this.container.querySelectorAll('.days');
        for (let row of rows) {
            for (let cell of row.children) {
                cell.querySelector("div").innerText = '';
            }
        }
    }
}


window.Calendar = Calendar;