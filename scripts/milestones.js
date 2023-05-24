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