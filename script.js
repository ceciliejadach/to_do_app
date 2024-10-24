//variabler for elementer
const toDoList = document.getElementById("to_do_list_container");
const inputTask = document.getElementById("task");

const addButton = document.querySelector("button");
const h1Done = document.getElementById("done");
const doneList = document.getElementById("done_list_container");
const removeAllTasksBtn = document.getElementById("remove_all");

const taskArrayFromLocalstorage = localStorage.getItem("taskArray");

//ugens dag bliver vist
const weekday = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

const d = new Date();
let day = weekday[d.getDay()];
document.getElementById("day").innerHTML = day;

//Lav array (det skal være tomt fra starten)
let taskArray = [];
let doneTaskArray = [];

//Gem taskArray i localstorage
if (taskArrayFromLocalstorage === null) {
  taskArray = [];
} else {
  taskArray = JSON.parse(taskArrayFromLocalstorage);
}

//controller
init();

function init() {
  updateTaskView();
  //updateDoneTaskView();
}

//Ved klik af tilføj knappen tilføjes task til array
addButton.addEventListener("click", addTask);

//Tilføj task til to-do liste ved at trykke enter på keyboard
inputTask.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

//Tilføj task til array
function addTask() {
  let task = inputTask.value; //gemmer opgaven der er blevet skrevet i inputfeltet, så jeg kan pushe opgaven (task) til sidst i array'et

  if (inputTask.value === "") {
    alert("Hov du skal da lige have skrevet en opgave ind!"); //hvis man ikke har skrevet noget i inputfelt, kommer der en alert
  } else if (taskArray.includes(task)) {
    alert("Den opgave er allerede tilføjet"); //man kan ikke skrive den samme task to gange
  } else {
    taskArray.push(task); //tilføjer task til arrayét
  }

  updateTaskView(); //kalder funktionen updateTaskView, så man kan se opgaverne
  inputTask.value = ""; //inputfeltet ryddes
}

//opdater visning af array
function updateTaskView() {
  toDoList.innerHTML = "";

  taskArray.forEach((task, id) => {
    let li = document.createElement("li");
    li.innerHTML = `<span class="taskname" data-id="${id}"> ${task}</span> <span class="delete" data-id="${id}">&#128465</span>`; //tasks får specifikt ID
    toDoList.appendChild(li); //tilføj li element
  });

  //Ved klik på taskname marker den som done
  document.querySelectorAll(".taskname").forEach((task) => {
    task.addEventListener("click", markAsDone);
  });

  //Slet task ved klik på skraldespanden med klassen delete
  document.querySelectorAll(".delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", deleteTask);
  });

  updateLocalStorage(); //Opdater localStorage efter ændringer
}

// Markér en opgave som færdig og flyt den til done-listen
function markAsDone(event) {
  let completedTask = event.target.innerText;
  let taskId = event.target.dataset.id;
  // let completedTask = taskArray[taskId];
  let li = document.createElement("li");

  // doneTaskArray.push(completedTask);
  li.innerHTML = completedTask;
  li.classList.add("strike"); //tilføj klassen strike til task, når den er markeret som done
  console.log("task er done");

  li.addEventListener("click", markAsNotDone); // Tilføj eventlistener til task for at kunne flytte den tilbage til to-do-listen
  doneList.appendChild(li); //Opret et nyt <li> element i done-listen
  taskArray.splice(taskId, 1); //Fjern opgaven fra taskArray

  updateTaskView(); // Opdater to-do listen
  updateLocalStorage(); // Opdater localStorage
}

//Flyt task tilbage til to-do-listen
function markAsNotDone(event) {
  let taskToMoveBack = event.target.innerText;

  taskArray.push(taskToMoveBack);

  event.target.remove();
  console.log("Task bliver flyttet tilbage til to-do listen");

  updateTaskView();
  updateLocalStorage();
}

//Funktion til at slette en opgave
function deleteTask(event) {
  let taskId = event.target.dataset.id; // Hent id fra data-id
  taskArray.splice(taskId, 1); // Fjern opgaven fra taskArray

  updateTaskView(); //Opdater visningen af to-do-listen
  updateLocalStorage(); //Opdater localStorage efter ændringer
}

//Knap til at fjerne alt indhold i done listen
removeAllTasksBtn.addEventListener("click", function () {
  doneList.innerHTML = "";
});

function updateLocalStorage() {
  localStorage.setItem("taskArray", JSON.stringify(taskArray));
}
