const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

// Get tasks from sessionStorage
let todos = JSON.parse(
    sessionStorage.getItem("todos")
) || [];

// Display tasks
function displayTodos() {

    todoList.innerHTML = "";

    todos.forEach((todo, index) => {

        const li = document.createElement("li");

        li.textContent = todo + " ";

        const deleteBtn =
            document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            deleteTodo(index);
        });

        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}


// Add task
addBtn.addEventListener("click", () => {

    const todo = todoInput.value.trim();

    if (todo === "") {
        alert("Please enter a task!");
        return;
    }

    todos.push(todo);

    // Store tasks in sessionStorage
    sessionStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );

    todoInput.value = "";

    displayTodos();
});


// Delete task
function deleteTodo(index) {

    todos.splice(index, 1);

    sessionStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );

    displayTodos();
}


// Display saved tasks when page loads
displayTodos();