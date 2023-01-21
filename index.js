const form = document.getElementById("todo-form");
const todosContainer = document.getElementById("todos");

// Todo Component
const addToDo = ({ id, completed, title }) => {
  // Creates todo container
  const todo = document.createElement("div");
  todo.id = `todo-${id}`;
  todo.className = "todo";

  // Checkbox
  const input = document.createElement("input");
  input.value = title;
  input.type = "checkbox";
  input.id = id;
  input.defaultValue = title;
  input.className = "checkbox";

  // Description
  const todoDescription = document.createElement("textarea");
  todoDescription.id = `description-${id}`;
  todoDescription.value = title;
  todoDescription.readOnly = true;
  todoDescription.className = "description";

  // Auto Height
  todoDescription.addEventListener("input", function (e) {
    todoDescription.style.height = "auto";
    todoDescription.style.height = todoDescription.scrollHeight + "px";
  });

  // Edit Button
  const edit = document.createElement("button");
  edit.id = `edit-${id}`;
  edit.className = "editButton";
  edit.innerHTML = "Editar";

  // Save Button
  const save = document.createElement("button");
  save.id = `save-${id}`;
  save.className = "saveButton";
  save.innerHTML = "Guardar";

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.id = `delete-${id}`;
  deleteBtn.className = "deleteButton";
  deleteBtn.innerHTML = "Borrar";

  // Add Edit click event listener
  edit.addEventListener("click", (event) => {
    const descriptionId = event.target.id.split("-")[1];

    // Hide/Show buttons
    event.target.className = "hide";
    const deleteButton = document.getElementById(`delete-${descriptionId}`);
    deleteButton.className = "hide";
    const saveButton = document.getElementById(`save-${descriptionId}`);
    saveButton.className = "show";

    // Editable Description
    const text = document.getElementById(`description-${descriptionId}`);
    text.readOnly = false;
    text.focus();
  });

  // Add Save click event listener
  save.addEventListener("click", (event) => {
    const descriptionId = event.target.id.split("-")[1];

    // Hide/Show buttons
    event.target.className = "hide";
    const saveButton = document.getElementById(`edit-${descriptionId}`);
    saveButton.className = "show";
    const deleteButton = document.getElementById(`delete-${descriptionId}`);
    deleteButton.className = "show";

    const text = document.getElementById(`description-${descriptionId}`);
    text.readOnly = true;
    updateTodo(descriptionId, text.value);
  });

  // Add Delete click event listener
  deleteBtn.addEventListener("click", (event) => {
    const descriptionId = event.target.id.split("-")[1];
    deleteTodo(descriptionId);
  });

  // Add checked if todo is completed
  if (completed) {
    todoDescription.classList.add("completed");
    input.checked = true;
    edit.classList.add("hide");
    deleteBtn.classList.add("hide");
  }
  // Append to containers
  todo.appendChild(input);
  todo.appendChild(todoDescription);
  todo.appendChild(edit);
  todo.appendChild(save);
  todo.appendChild(deleteBtn);
  todosContainer.prepend(todo);
};

// CRUD

// Create
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(event.target);

  if (!form.get("descripcion")) {
    return;
  }
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title: form.get("descripcion"),
      completed: false,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.info(
        "CREATE: Post a https://jsonplaceholder.typicode.com/posts con data",
        data
      );
      addToDo(data);
    });
  const descriptionInput = document.getElementById("descripcion");
  descriptionInput.value = "";
});

// Read
fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
  .then((response) => response.json())
  .then((data) => {
    console.info(
      "READ: Fetch a https://jsonplaceholder.typicode.com/todos?_limit=10",
      data
    );
    data.forEach((todo) => {
      addToDo(todo);
    });
  });

// Update
const updateTodo = (id, title) => {
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      id,
      title,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.info(
        `UPDATE: PUT a https://jsonplaceholder.typicode.com/todos/${id}`,
        data
      );
      console.warn(
        "IMPORTANTE: el recurso no se actualizará realmente en el servidor, sino que se simulará como si lo hiciera."
      );
    });
};

// Delete
const deleteTodo = (id) => {
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.info(
        `DELETE: Delete a https://jsonplaceholder.typicode.com/todos/${id}`,
        data
      );
      console.warn(
        "IMPORTANTE: El recurso realmente no se actualizará en el servidor, sino que se hará como si lo hiciera."
      );
      const todo = document.getElementById(`todo-${id}`);
      todosContainer.removeChild(todo);
    });
};
