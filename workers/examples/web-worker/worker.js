addEventListener("message", handleMessage);

function handleMessage(event) {
  const termFirst = parseInt(event.data[0]);
  const termSecond = parseInt(event.data[1]);
  const sum = termFirst + termSecond;

  postMessage(sum);
}
