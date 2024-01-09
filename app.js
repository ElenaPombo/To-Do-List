// Cargar tareas almacenadas al cargar la página
window.onload = function () {
    loadTasks();
};

// Agregar una nueva tarea
function addTaskOnClick() {
    addTask();
}

// Manejar el evento de presionar Enter en el campo de entrada
function handleKeyPress(event) {
    if (event.key === "Enter") {
        addTask();
    }
}

// Función para agregar una nueva tarea
function addTask() {
    const inputValue = document.getElementById("input").value.trim();
    if (inputValue !== "") {
        const taskList = document.getElementById("task-list");
        const newTaskContainer = createTaskContainer(inputValue);

        taskList.appendChild(newTaskContainer);

        // Guardar la tarea en localStorage
        saveTask(inputValue, false);

        document.getElementById("input").value = "";
    }
}

// Función para crear un contenedor de tarea con opciones de editar, eliminar y completar
function createTaskContainer(taskText, completed) {
    const newTaskContainer = document.createElement("div");
    newTaskContainer.className = "task-container";

    const newTask = document.createElement("div");
    newTask.className = "task";
    newTask.innerText = taskText;

    if (completed) {
        newTask.classList.add("completed-text");
    }

    // Agrega estas líneas para controlar el desbordamiento del texto
    newTask.style.whiteSpace = "nowrap";
    newTask.style.overflow = "hidden";
    newTask.style.textOverflow = "ellipsis";

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "task-options";

    const editButton = document.createElement("button");
    editButton.innerHTML = "&#9998;"; // Código HTML para el emoji de lápiz
    editButton.onclick = function () {
        editTask(newTask, newTaskContainer);
    };

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#128465;"; // Código HTML para el emoji de papelera
    deleteButton.onclick = function () {
        deleteTask(newTaskContainer);
    };

    const completeButton = document.createElement("button");
    completeButton.innerHTML = "&#10003;"; // Código HTML para el emoji de marca de verificación
    completeButton.onclick = function () {
        completeTask(newTask);
    };

    // Agregar escuchador de eventos de teclado para permitir la edición al presionar "Enter"
    newTask.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            newTask.contentEditable = "false";
            // Actualizar la tarea en localStorage
            updateTaskInLocalStorage();
        }
    });

    optionsContainer.appendChild(editButton);
    optionsContainer.appendChild(deleteButton);
    optionsContainer.appendChild(completeButton);

    newTaskContainer.appendChild(newTask);
    newTaskContainer.appendChild(optionsContainer);

    return newTaskContainer;
}

// Función para editar la tarea
function editTask(taskElement, taskContainer) {
    // Al hacer clic en el botón de edición, activar la edición del texto
    taskElement.contentEditable = "true";
    taskElement.focus();

    // Agregar escuchador de eventos de teclado para guardar la tarea al presionar "Enter"
    taskElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            taskElement.contentEditable = "false";

            // Actualizar la tarea en localStorage
            updateTaskInLocalStorage();
        }
    });
}

// Función para eliminar la tarea
function deleteTask(taskContainer) {
    taskContainer.remove();

    // Actualizar tareas en localStorage después de eliminar
    updateTaskInLocalStorage();
}

// Función para marcar como completada la tarea
function completeTask(taskElement) {
    taskElement.classList.toggle("completed-text");

    // Actualizar tareas en localStorage después de marcar como completada
    updateTaskInLocalStorage();
}

// Función para guardar la tarea en localStorage
function saveTask(task, completed) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: task, completed: completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Función para cargar las tareas almacenadas al cargar la página
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("task-list");

    tasks.forEach((task) => {
        const newTaskContainer = createTaskContainer(task.text, task.completed);
        taskList.appendChild(newTaskContainer);
    });
}

// Función para actualizar las tareas en localStorage
function updateTaskInLocalStorage() {
    const taskList = document.getElementById("task-list");
    const tasks = Array.from(taskList.children).map((container) => {
        const taskElement = container.querySelector(".task");
        return { text: taskElement.innerText, completed: taskElement.classList.contains("completed-text") };
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Función para eliminar la tarea con confirmación
function deleteTask(taskContainer) {
    const confirmed = confirm("¿Estás seguro de que quieres eliminar esta tarea?");
    if (confirmed) {
        taskContainer.remove();

        // Actualizar tareas en localStorage después de eliminar
        updateTaskInLocalStorage();
    }
}

// ... (tu código JS actual)

// Función para mostrar la ventana emergente
function showDeleteConfirmation(callback) {
    const modal = document.getElementById("custom-modal");
    const confirmButton = document.getElementById("confirm-delete");
    const cancelButton = document.getElementById("cancel-delete");

    confirmButton.onclick = function () {
        modal.style.display = "none";
        if (typeof callback === "function") {
            callback(true);
        }
    };

    cancelButton.onclick = function () {
        modal.style.display = "none";
        if (typeof callback === "function") {
            callback(false);
        }
    };

    modal.style.display = "block";
}

// Función para eliminar la tarea con confirmación personalizada
function deleteTask(taskContainer) {
    showDeleteConfirmation(function (confirmed) {
        if (confirmed) {
            taskContainer.remove();

            // Actualizar tareas en localStorage después de eliminar
            updateTaskInLocalStorage();
        }
    });
}
