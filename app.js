document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById("task-input");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        let tasks = getTasksLocally();
        let  maxIndex = tasks.length ==0 ? 1 : tasks.reduce((max, obj) => obj.id > max.id ? obj : max, tasks[0]).id+1;
        const taskContainer = document.getElementById("task-container");
        const newTask = createTaskElement(taskText, "Pending",maxIndex);
        taskContainer.appendChild(newTask);

        saveTaskLocally(taskText, "Pending",tasks,maxIndex);
        taskInput.value = "";
    }
}

function createTaskElement(taskText, status,id) {
    const newTask = document.createElement("div");
    newTask.className = "task";
    newTask.innerHTML = `
        <span class="task-text ${status === 'Completed' ? 'completed' : ''}">${taskText}</span>
        <span class="task-status">${status}</span>
        <select class="status-select">
            <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Completed" ${status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
        <div>
            <button onclick="editTask(this,${id})">Edit</button>
            <button onclick="deleteTask(this,${id})">Delete</button>
        </div>
        
    `;
    return newTask;
}

function editTask(button,id) {
    const task = button.parentElement.parentElement;
    const taskTextElement = task.querySelector(".task-text");
    const statusElement = task.querySelector(".task-status");
    const statusSelect = task.querySelector(".status-select");
    const taskText = taskTextElement.innerText;
    const status = statusElement.innerText;

    // Create an input field for editing task text
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = taskText;

    // Replace the task text element with the input field
    taskTextElement.replaceWith(inputField);

    // Display status dropdown only when editing
    statusSelect.style.display = "inline";

    // Set selected value in the dropdown
    statusSelect.value = status;

    // Show the dropdown to the user
    statusSelect.style.display = "inline";

    // Focus on the input field for better user experience
    inputField.focus();

    // Change the "Edit" button to "Save" during editing
    button.innerText = "Save";
    // Change the "onclick" attribute to call the saveTaskEdit function
    button.setAttribute("onclick", "saveTaskEdit(this,"+id+")");
    sessionStorage.prevStatus=status;
    sessionStorage.prevTodo=taskText;
}


function deleteTask(button,id) {
    const taskContainer = document.getElementById("task-container");
    const task = button.parentElement.parentElement;
    const taskText = task.querySelector(".task-text").innerText;
    const status = task.querySelector(".task-status").innerText;

    taskContainer.removeChild(task);
    removeTaskLocally(taskText, status,id);
}

function saveTaskLocally(taskText, status,tasks,id) {
        tasks.push({ id: id, text: taskText, status: status });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function updateTaskTextAndStatusLocally(id, newTaskText, newStatus) {
    let tasks = getTasksLocally();
    const index = tasks.findIndex(task => task.id==id);

    if (index !== -1) {
        tasks[index].text = newTaskText;
        tasks[index].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}



function removeTaskLocally(taskText, status,id) {
    let tasks = getTasksLocally();
    tasks = tasks.filter(task => task.id!=id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const taskContainer = document.getElementById("task-container");
    const tasks = getTasksLocally();

    tasks.forEach(task => {
        const newTask = createTaskElement(task.text, task.status,task.id);
        taskContainer.appendChild(newTask);
    });
}

function getTasksLocally() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}
function saveTaskEdit(button,id) {
    const task = button.parentElement.parentElement;
    const taskTextElement = task.querySelector("input[type='text']");
    const statusElement = task.querySelector(".task-status");
    const statusSelect = task.querySelector(".status-select");

    const newTaskText = taskTextElement.value;
    const newStatus = statusSelect.value;

    // Replace the input field with the task text element
    taskTextElement.replaceWith(document.createElement("span"));

    // Hide the status dropdown after editing
    statusSelect.style.display = "none";

    // Change the "Save" button back to "Edit"
    button.innerText = "Edit";
    // Change the "onclick" attribute back to editTask function
    button.setAttribute("onclick", `"editTask(this,${id})"`);

    // Update the task text and status
    //task.querySelector(".task-text").innerText = newTaskText;
    task.querySelector(".task-status").innerText = newStatus;

    // Save the changes locally
    updateTaskTextAndStatusLocally(id, newTaskText, newStatus);
    window.location.reload();
}
