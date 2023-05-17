let changes = false;

const dateHeader = document.querySelector('#date');
const today = new Date();

const fillData = (date) => {
  const data = localStorage.getItem(`journal-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  if (data) {
    const parsedData = JSON.parse(data);
    document.querySelector("textarea").value = parsedData.journalContent;
    Array.from(document.querySelectorAll(".emotion")).forEach(emotion => {
      if (emotion.querySelector("i").classList[1] === "fa-face-" + parsedData.emotion)
        emotion.classList.add("selected");
    });
  }
  dateHeader.innerHTML = date.toDateString();
  dateHeader.parentElement.href = `history.html?date=${date.getMonth() + 1}-${date.getFullYear()}`;
}

// parse url params
const urlParams = new URLSearchParams(window.location.search);
let date = today;
if (urlParams.has('date')) {
  const newDate = new Date(urlParams.get('date'));
  if (newDate != "Invalid Date" && newDate <= today)
    date = newDate;
}

fillData(date);

document.addEventListener("click", e => {
  // click on an emotion
  if (e.target.closest(".emotion")) {
    document.querySelectorAll(".emotion").forEach(emotion => emotion.classList.remove("selected"));
    e.target.closest(".emotion").classList.add("selected");
    changes = true;
  }
});

const send = document.querySelector("#send");
send.addEventListener("click", () => {
  const journalContent = document.querySelector("textarea").value;
  const selectedEmotion = document.querySelector(".selected");
  var feedbackMessage = document.getElementById('feedback-message');

  const emotion = selectedEmotion ?
    selectedEmotion.querySelector("i").classList[1].replace("fa-face-", "") :
    null;
  const date = new Date(dateHeader.innerHTML);
  localStorage.setItem(
    `journal-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    JSON.stringify({
      emotion: emotion,
      journalContent: journalContent
    })
  );

  const save = new EmotionsSaver(localStorage, date.getFullYear(), date.getMonth() + 1);
  save.add(date.getDate(), emotion);

  changes = false;
  
  feedbackMessage.textContent = 'Saved entry. Redirecting...';
  
  setTimeout(function () {
    window.location.href = './history.html';
  }, 2000);
});

const input = document.querySelector("textarea");
input.addEventListener("input", () => changes = true);

window.addEventListener("beforeunload", e => {
  console.log(e);
  if (changes) {
    e.preventDefault();
    e.returnValue = confirm("You have unsaved changes. Are you sure you want to leave?");
  }
});
