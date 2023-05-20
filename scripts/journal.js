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

  // add links to arrows
  const prev = dateHeader.parentElement.previousElementSibling;
  const next = dateHeader.parentElement.nextElementSibling;
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);
  prev.href = `journal.html?date=${prevDate.getFullYear()}-${prevDate.getMonth() + 1}-${prevDate.getDate()}`;
  next.href = `journal.html?date=${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`;

  if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear())
    next.style.visibility = "hidden";
  else
    next.style.removeProperty("visibility");
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
  var main = document.getElementById('main');
  const emotion = selectedEmotion ?
    selectedEmotion.querySelector("i").classList[1].replace("fa-face-", "") :
    null;

  if (!emotion)
    return alert("Please select an emotion.");
    
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
  
  feedbackMessage.style.removeProperty('display');
  main.style = 'filter: brightness(0.6);'
  setTimeout(function () {
    window.location.href = './history.html';
  }, 500);
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
