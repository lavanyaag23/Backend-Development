const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

// Get saved tasks
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Display tasks
function displayTodos() {

    todoList.innerHTML = "";

    todos.forEach((todo, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${todo}</span>
            <button onclick="deleteTodo(${index})">
                Delete
            </button>
        `;

        todoList.appendChild(li);
    });

    // Update task count
    taskCount.textContent =
        todos.length === 1
            ? "1 task"
            : `${todos.length} tasks`;

    // Show empty message
    if (todos.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}

// Add task
function addTodo() {

    const todo = todoInput.value.trim();

    if (todo === "") {
        alert("Please enter a task!");
        return;
    }

    todos.push(todo);

    // Save tasks
    localStorage.setItem("todos", JSON.stringify(todos));

    todoInput.value = "";

    displayTodos();
}

// Button click
addBtn.addEventListener("click", addTodo);

// Enter key
todoInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTodo();
    }

});

// Delete task
function deleteTodo(index) {

    todos.splice(index, 1);

    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );

    displayTodos();
}

// Display saved tasks when page loads
displayTodos();