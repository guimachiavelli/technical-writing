const inputFirst = document.querySelector("#input-1");
const inputSecond = document.querySelector("#input-2");
const result = document.querySelector("#result");

const scriptURL = "worker.js";
const myWorker = new Worker(scriptURL);
myWorker.addEventListener("message", handleWorkerMessage);

inputFirst.addEventListener("input", handleInput);
inputSecond.addEventListener("input", handleInput);

function handleWorkerMessage(event) {
  const workerCalculationResult = event.data;
  result.textContent = workerCalculationResult;
}

function handleInput() {
  myWorker.postMessage([inputFirst.value, inputSecond.value]);
}
