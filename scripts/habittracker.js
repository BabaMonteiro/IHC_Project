// load tasks from localstorage
if (localStorage.getItem("topic") != null && localStorage.getItem("topic") != "ignore") {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const tasksContainer = document.querySelector(".all_tasks > ul");
    tasks.forEach((task, i) => { 
        const taskLi = document.createElement("li");
        tasksContainer.appendChild(taskLi);
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = "task" + i;
        input.name = "task" + i;
        taskLi.appendChild(input);
        const label = document.createElement("label");
        taskLi.appendChild(label);
        label.htmlFor = "task" + i;
        label.innerText = task;
    });
}

// load custom tasks from localstorage
if (localStorage.getItem("customTasks") != null) {
    const customTasks = JSON.parse(localStorage.getItem("customTasks"));
    customTasks.forEach(task => {
        document.querySelector('#tasks').innerHTML += `
            <div class="task">
                <span class="taskname">
                    ${task}
                </span>
                <button class="delete">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        `;
    });
}

document.querySelector('#push').onclick = function(){
    var tasks = document.querySelectorAll('.task');
    var taskNameInput = document.querySelector('#newtask input');
    var newTaskName = taskNameInput.value;
    var isTaskNameRepeated = false;
  
    for (var i=0; i<tasks.length; i++){
        var taskName = tasks[i].querySelector('.taskname').innerText;
        if (taskName === newTaskName){
            isTaskNameRepeated = true;
            alert('This task already exists!');
            break;
        }
    }

    if (!isTaskNameRepeated && newTaskName.length !== 0){
        document.querySelector('#tasks').innerHTML += `
            <div class="task">
                <span class="taskname">
                    ${newTaskName}
                </span>
                <button class="delete">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        `;

        taskNameInput.value = '';

        // save to localstorage
        const customTasks = JSON.parse(localStorage.getItem("customTasks")) || [];
        customTasks.push(newTaskName);
        localStorage.setItem("customTasks", JSON.stringify(customTasks));
    }
};

document.addEventListener("click", e => {
    if (e.target.closest(".delete")) {
        var confirmed = confirm('Are you sure you want to delete this task?');
        if (confirmed) {
            e.target.closest(".delete").parentNode.remove();
            const tasks = JSON.parse(localStorage.getItem("customTasks"));
            const taskName = e.target.closest(".delete").parentNode.querySelector('.taskname').innerText;
            const index = tasks.indexOf(taskName);
            console.log(tasks, taskName, index);
            if (index > -1)
                tasks.splice(index, 1);
            localStorage.setItem("customTasks", JSON.stringify(tasks));
        }
    }
});