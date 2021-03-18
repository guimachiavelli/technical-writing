const button = document.querySelector("#button");
const result = document.querySelector("#result");

const serviceWorkerURL = "./worker.js";

navigator.serviceWorker.register(serviceWorkerURL);

button.addEventListener("click", handleButtonClick);

function handleButtonClick() {
  fetch("./strings.txt").then(handleFetchSuccess).then(handleFetchData);
}

function handleFetchSuccess(response) {
  return response.text();
}

function handleFetchData(data) {
  const strings = data.split("\n");

  result.textContent = randomArrayItem(strings);
}

function randomArrayItem(arr) {
  const randomInt = Math.floor(Math.random() * arr.length);
  return arr[randomInt];
}
