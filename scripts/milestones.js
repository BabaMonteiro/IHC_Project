window.onload = () => {
    const topic = localStorage.getItem("topic");
    const customMilestone = document.querySelector("#custom-milestone");
    switch (topic) {
        case "Weight loss":
            customMilestone.innerText = "Eating Healthy";
            break;
        case "Smoking addiction":
            customMilestone.innerText = "Not Smoking";
            break;
        case "Depression":
            customMilestone.innerText = "Get Sunlight";
            break;
    }
}

const trophyIcons = document.querySelectorAll('.trophy-pair i');

// Add click event listener to each trophy icon
trophyIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    // Toggle the 'clicked' class on the clicked trophy icon
    icon.classList.toggle('clicked');
  });
});