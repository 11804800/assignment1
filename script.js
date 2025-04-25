const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filters button");

const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const editForm = document.getElementById("edit-form");
const closeModalBtn = document.querySelector(".close");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentEditId = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks
    .filter(task => {
      if (currentFilter === "completed") return task.completed;
      if (currentFilter === "pending") return !task.completed;
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt).reverse();

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    const leftDiv = document.createElement("div");
    leftDiv.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleTask(task.id);

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit";
    editBtn.onclick = () => openEditModal(task.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "✖";
    delBtn.className = "delete";
    delBtn.onclick = () => deleteTask(task.id);

    li.appendChild(leftDiv);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });
}

function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: Date.now()
  };

  tasks.push(newTask);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    currentEditId = id;
    editInput.value = task.text;
    editModal.style.display = "block";
  }
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newText = editInput.value.trim();
  if (newText && currentEditId !== null) {
    tasks = tasks.map(task =>
      task.id === currentEditId ? { ...task, text: newText } : task
    );
    saveTasks();
    renderTasks();
    closeEditModal();
  }
});

function closeEditModal() {
  editModal.style.display = "none";
  currentEditId = null;
}

closeModalBtn.addEventListener("click", closeEditModal);

window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

filterButtons.forEach(btn =>
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  })
);

taskForm.addEventListener("submit", addTask);

renderTasks();
