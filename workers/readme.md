## Web Workers and Service Workers

### Intro

As the web ecosystem evolves and adapts to our ever-changing experimentation with the medium, APIs of all sorts proliferate. Since there are only so many words available, we are bound to have some overlap between concepts that, whilst completely different, can appear and sound rather similar when first met.

One example of this are Web Workers which are both very similar and very different from Service Workers.

In this article, I will first present the definitions of threads and workers, then go over Web Workers, Service Workers and, finally, review their differences. To conclude the article, I will also present some of the use-cases for each one them.

The goal of this document its not to provide an in-depth tutorial on the usage of Workers in web applications.


### Threads

In general, most web browsers can span processes. This usually translates to each window or tab being handled separately from the other, meaning that they are isolated and independent. You can see this when a site you are using crashes whilst the browser itself continues running smoothly.

That said, each process tends to be single-threaded. This means that everything that happens in that page must happen one step at a time. When that fails to happen, the page might become sluggish or, in the worst cases freeze or even crash. This is particularly visible in web applications and other Javascript-heavy pages: depending on what you are asking your browser to do and how fast your computer is, the single thread on which a site runs might choke on the sheer amount of data that it must move or calculations it must do.

There are two exceptions to this.

The first, which is familiar to anyone who has crafted complex animations, is that certain CSS properties bypass the main thread entirely. Instead of being sent to your computer's processor, which is where your site's main thread runs, whatever happens when you change those properties is processed by your computer's graphic card. This is often crucial in ensuring that animations look nice and smooth even when there's a lot happening in your screen.

The second exception are Workers.


### Workers

While some of the work in displaying a web page can be sent to a different thread dedicated to efficiently rendering visuals, that is of little help if what a programmer needs to do is not concerned with the visual aspects of a page.

Web Workers were created specifically for that task. Upon creating a Worker, a programmer can assign it a task or set of tasks the worker must execute in a separate thread and report once it is done. This allows the page to remain working normally and without any noticeable slowdown whilst the task is being processed, leading to a smoother experience for the user.

The Web Worker API allows the creation of three types of workers: dedicated workers, shared workers and service workers.


### Dedicated Workers

When we speak of Web Workers, we are usually referring to either Dedicated or Shared workers. Both are intended for any general purpose task that we do not want running on our main application thread.

Dedicated Workers are created by a single source and can only be accessed by that source. For example, an application might use the Canvas API to manipulate the saturation of an image. Since this process can take a long time with high-resolution images, the developer of this application creates a Dedicated Worker and configures it to make all necessary calculations. This allows the rest of the application to remain usable and responsive to user input. No other sources are allowed to communicate with this worker.

Shared Workers serve similar goals and thus are used in fairly similar ways. The difference is that any scripts from the same website can access that worker. This might make sense, for instance, in the event we expect our user to open our app in different windows or tabs, but only work in one at a time.

Workers require two javascript files at the very least:

1. the main application script;
2. the worker script.

For illustration purposes, we will create a very simple application that displays the sum of two integers.

`index.html`

	```<body>
	  <input id="input-1" placeholder="Type a number" name="field-1" />
	  <input id="input-2" placeholder="Type another number" name="field-2" />

	  <div>
	    Result: <strong id="result"></strong>
	  </div>

	  <script src="main.js"></script>
	</body>```


There is very little of interest in our html file: two input fields, a container for our results and a link to the main logic of our application contained in `main.js`

`main.js`

	```const scriptURL = "worker.js";
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
	}```


This is our main application logic. First, we create our worker by calling its the `Worker` constructor and passing the URL to our worker script --- `worker.js` in our case. After creating our worker, we do two very important things.

First, we add an event listener that is called every time our worker notifies us it has finished its task. In our case, all we need to do is extract the data sent by the worker and update our results container.

Second, we monitor the two input fields for changes. Every time the user adds or removes a number from the fields, we send the new data to our worker via `worker.postMessage`.

As you might have noticed, looking at this file tells us nothing about what the worker actually does.

worker.js

	```self.addEventListener("message", handleMessage);

	function handleMessage(event) {
	  const termFirst = parseInt(event.data[0]);
	  const termSecond = parseInt(event.data[1]);
	  const sum = termFirst + termSecond;

	  postMessage(sum);
	}```


There are two things of note in our worker's logic.

First, we attach an event listener to the worker's own `message` event. This event is triggered anytime our main application calls the `worker.postMessage` function.

Second, we have the actual listener. In our case, all we need to do is extract the data the application has sent to the worker, make sure it is understood as a number and then add both terms. Once the worker is ready, it invokes the same `worker.postMessage` function which notifies the main application the operation has been completed.

Though outside the scope of this article, it is important to note that the context of a worker is slightly different than that of the main application. As such, access to certain browser APIs  is restricted, the most notable of which being the DOM.

The usage of Shared Workers is also outside the scope of this article. In general, however, its usage is similar to that of a Dedicated Worker. Differences are largely concerned with managing the communication between the worker and all applications that reference it.

Our usage of the Web Worker API here is extremely simple and would be completely unnecessary in real-life applications, but the workflow remains largely the same whether we need our worker to make simple mathematical operations, crunch hundreds of megabytes of data or manipulate an image's individual pixels.


### Service Workers

While Shared and Dedicated Workers have no specific use case and are intended for any heavy processing task, Service Workers have a narrower scope. Instead of ensuring certain tasks do not interfere with an application's performance, Service Workers often function like a proxy server. That is, they intercept and modify requests your application make or the responses it receives to an external server.

This provides an indication of a Service Worker's most common use case: creating web applications that can work offline. Other uses for this API include:

* Fetch resources that the user will need in the future, such as a video or a .json file;
* Synchronise the data between your application and other services;
* Modify requests for third-party resources.

In the following example, we will create a small application that requests a three-character string from the server. When a user first visits our application, the Service Worker caches a list of strings so that the site can continue working as before.

`index.html`

	```<body>
	  <button id="button">Load a random string</button>

	  <div>Result: <strong id="result"></strong></div>

	  <script src="main.js"></script>
	</body>```


As before, our html is kept very simple: one button, one container for our results and a reference to our main application logic.

`Main.js`

	```const button = document.querySelector("#button");
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
	}```


Much as Dedicated Workers, Service Workers must be kept in a dedicated javascript file. We create a new Service Worker differently, however: instead of using the `Worker` constructor, we use `navigator.serviceWorker.register`.

The other relevant line in our main application logic is `handleButtonClick`. In this function, we fetch `strings.txt`, which is the file with our random strings. If the fetch is successful, we then output one of these strings.

`worker.js`

	```self.addEventListener("install", handleInstall);
	self.addEventListener("fetch", handleFetch);

	function handleInstall(event) {
	  event.waitUntil(
	    caches.open("v1").then(function (cache) {
	      return cache.addAll(["./", "./index.html", "./main.js", "./strings.txt"]);
	    })
	  );
	}

	function handleFetch(event) {
	  event.respondWith(caches.match(event.request));
	}```


Our Service Worker is a bit more complex than a regular Web Worker, but still fairly simple. We begin the file by instructing the worker to monitor two events: `install` and `fetch`. These events are specific to Service Workers and are not available to other Web Workers.

`install` is triggered the moment we successfully register a Service Worker. In our case, this invokes the `handleInstall` function. This function instructs the worker to cache the assets available in the listed paths. What `handleInstall` does not do is instruct our worker when and how to use the cache --- to do this we need to listen to the `fetch` event.

`fetch` is fired whenever our application requests a resource, such as our `strings.txt` file. In order to do so, we instruct the Service Worker to always respond to requests with the files we cached in the `install` event. This is of course a very naïve approach to the problem and would create problems if we were to request resources not present in our cache.


### Recap

So this is pretty much all there is to it. We briefly discussed what threads are, how applications do most of their work on a main thread and how removing heavy processing tasks from the main thread help keeping an interface responsive. We then established that workers are one way of moving certain tasks into separate threads, saw how the Web Worker API allows us to do that and what types of workers there are. After a brief overview of general purpose Dedicated and Shared Workers, we moved on to Service Workers. Finally, we saw that Service Workers have much narrower applications which mostly rely on intercepting and modifying resource requests.


### Conclusion

This article gave only a brief overview of definitions and uses of Web Workers and avoided delving deeper into any subject. This was a conscious decision because the concepts that workers involve are not yet particularly familiar to us.

To learn more, you may want to visit MDN's tutorial on Using Web Workers and Using Service Workers or look at the API reference.
