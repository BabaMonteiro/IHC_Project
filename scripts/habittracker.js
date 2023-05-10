document.querySelector('#push').onclick = function(){
    var tasks = document.querySelectorAll('.task');
    var taskNameInput = document.querySelector('#newtask input');
    var newTaskName = taskNameInput.value;
    var isTaskNameRepeated = false;
    // var list = document.querySelector('.task');

  
    for (var i=0; i<tasks.length; i++){
        var taskName = tasks[i].querySelector('#taskname').innerHTML;
        if (taskName === newTaskName){
            isTaskNameRepeated = true;
            alert('This task already exists!');
            break;
        }
    }

    if (!isTaskNameRepeated && newTaskName.length !== 0){
        document.querySelector('#tasks').innerHTML += `
            <div class="task">
                <span id="taskname">
                    ${newTaskName}
                </span>
                <button class="delete">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        `;

        var current_tasks = document.querySelectorAll('.delete');
        for (var i=0; i<current_tasks.length; i++){
            current_tasks[i].onclick = function(){
                var confirmed = confirm('Are you sure you want to delete this task?');
                if (confirmed) {
                    this.parentNode.remove();
                }
            };
        }

        taskNameInput.value = '';
    }
};

const dateHeader = document.querySelector('#date');
const today = new Date();
dateHeader.innerHTML = today.toDateString();

// parse url params
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('date')) {
    const date = new Date(urlParams.get('date'));
    dateHeader.innerHTML = date.toDateString();

    // load tasks from local storage for this date
}