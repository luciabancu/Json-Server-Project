let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let modalState = true;
let modalLabel = document.getElementById("exampleModalLabel");
let updateID = 0;
let insertTask = document.getElementById("insertTask");

form.addEventListener("submit", (e) => {
  if (modalState === true) {
    formValidation();
    insertNewTask();
  } else {
    updateNote(updateID);
  }
});

let formValidation = () => {
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank";
  } else {
    console.log("success");
    msg.innerHTML = "";
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();
    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let insertNewTask = () => {
  const temp = {
    title: textInput.value,
    description: textarea.value,
  };

  localStorage.setItem("temp", JSON.stringify(temp));

  addTaskToServer(temp);
};

fetch("http://localhost:3000/data")
  .then((response) => response.json())
  .then((data) => {
    //data = data.slice(1);
    data.map((x) => {
      return (tasks.innerHTML += `
            <div id="newtaskdiv-${x.id}" data-id=${x.id}>
                  <span class="fw-bold" id="card-title-${x.id}">${x.title}</span>
                  <p id="card-content-${x.id}">${x.description}</p>
                  <span class="options">
                    <i onclick="updateModal(${x.id}) "data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
                    <i onClick ="deleteTaskToServer(${x.id});" class="fas fa-trash-alt"></i>
                  </span>
                </div>`);
    });
  });

function addTaskToServer(payload) {
  return fetch("http://localhost:3000/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

let deleteTask = (e) => {
  e.parentElement.parentElement.remove();

  data.splice(e.parentElement.parentElement.id, 1);

  localStorage.setItem("data", JSON.stringify(data));
  console.log(e);
};

// Define a global variable to store the selected task element
let selectedTask = null;

// Define a function to attach the form submit event listener
function attachFormListener() {
  form.addEventListener("submit", onSubmit);
}

function updateModal(id) {
  const cardTitle = document.querySelector(`#card-title-${id}`);
  const cardContent = document.querySelector(`#card-content-${id}`);
  textInput.value = cardTitle.innerHTML;
  textarea.value = cardContent.innerHTML;
  modalLabel.innerHTML = "Update Task";
  add.innerHTML = "Update";
  modalState = false;
  const newtaskdiv = document.querySelector(`#newtaskdiv-${id}`);
  updateID = newtaskdiv.dataset.id;
}

insertTask.addEventListener("click", () => {
  modalState = true;
  modalLabel.innerHTML = "Add Task";
  add.innerHTML = "Add";
  textInput.value = "";
  textarea.value = "";
});

const updateNote = async (id) => {
  const updateDocument = {
    title: textInput.value,
    description: textarea.value,
  };
  await fetch(`http://localhost:3000/data/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateDocument),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function deleteTaskToServer(id) {
  return fetch("http://localhost:3000/data/" + id, {
    method: "DELETE",
  }).then((res) => res.json());
}
