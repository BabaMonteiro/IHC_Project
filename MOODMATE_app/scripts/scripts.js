// check if the user chose a topic
if (localStorage.getItem("topic") == null)
    window.location.href = "entry.html";
else {
    if (localStorage.getItem("tasks") != null && localStorage.getItem("topic") == "ignore")
        localStorage.removeItem("tasks");

    fetch("../default-tasks.json")
        .then(response => response.json())
        .then(data => {
            const topics = data.map(entry => entry["topic"]);
            const topic = localStorage.getItem("topic");
            if (topics.includes(topic))
                localStorage.setItem("tasks", JSON.stringify(data.filter(entry => entry["topic"] == topic)[0]["tasks"]));
        });
}