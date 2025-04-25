document.addEventListener("DOMContentLoaded", function() {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const editTaskModal = document.getElementById("editTaskModal");
  const editTaskInput = document.getElementById("editTaskInput");
  const saveEditTaskBtn = document.getElementById("saveEditTaskBtn");
  const closeModal = document.querySelector(".close");
  const sortNewestBtn = document.getElementById("sortNewestBtn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let editTaskId = null;
  
  function renderTasks(filter = 'all', shouldSort = false) {
      let filteredTasks = tasks.filter(task => {
          if (filter === 'completed') return task.completed;
          if (filter === 'pending') return !task.completed;
          return true;
      });

      // Sort by newest if the button has been clicked
      if (shouldSort) {
          filteredTasks.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, most recent first
      }

      taskList.innerHTML = '';
      filteredTasks.forEach((task, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
              <span class="check-btn">
                  <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''}>
                  <label for="task-${index}">${task.text}</label>
              </span>
              <div style="display:flex;gap:10px">
                  <button class="edit-btn" data-id="${index}">✎</button>
                  <button class="delete-btn" data-id="${index}">&times;</button>
              </div>
          `;
          taskList.appendChild(li);

          li.querySelector(`input[type="checkbox"]`).addEventListener('change', function() {
              task.completed = this.checked;
              updateLocalStorage();
              renderTasks(filter);
          });

          li.querySelector(".edit-btn").addEventListener('click', function() {
              editTaskId = this.dataset.id;
              editTaskInput.value = task.text;
              editTaskModal.style.display = "block";
          });

          li.querySelector(".delete-btn").addEventListener('click', function() {
              tasks.splice(this.dataset.id, 1);
              updateLocalStorage();
              renderTasks(filter);
          });
      });
  }

  function updateLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  addTaskBtn.addEventListener('click', function() {
      const taskText = taskInput.value.trim();
      if (taskText) {
          // Save the current timestamp when a task is created
          tasks.push({ text: taskText, completed: false, timestamp: Date.now() });
          taskInput.value = '';
          updateLocalStorage();
          renderTasks();
      }
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
          const filter = this.dataset.filter;
          renderTasks(filter);
      });
  });

  saveEditTaskBtn.addEventListener('click', function() {
      if (editTaskId !== null) {
          tasks[editTaskId].text = editTaskInput.value.trim();
          updateLocalStorage();
          renderTasks();
          editTaskModal.style.display = "none";
          editTaskId = null;
      }
  });

  closeModal.addEventListener('click', function() {
      editTaskModal.style.display = "none";
      editTaskId = null;
  });

  window.onclick = function(event) {
      if (event.target === editTaskModal) {
          editTaskModal.style.display = "none";
          editTaskId = null;
      }
  };


  sortNewestBtn.addEventListener('click', function() {
      renderTasks('all', true); 
  });

  renderTasks(); 
});