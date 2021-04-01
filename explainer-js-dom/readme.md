# Navigating documentation: distinction between JS and the DOM
I still remember the early days of learning Javascript after a couple of years avoiding it like the plague. Things until then were relatively clear: HTML was marking up content and telling the browser what it was; CSS was about saying what those elements should look like; and JS, well, JS was actual programming. Creating complex animations, responding to user interaction, designing the actual logic of an application.

And, as much as it might be almost embarrassing to mention it now, nothing was more confusing than consulting MDN's JS reference and not finding something like a definition of `document.getElementById` or information about how to make fancy things with `canvas`. It was easy enough to find what I wanted with a bit more effort, but I found it infuriating: `canvas` and `getElementById` are part of JS, so why isn't it in the JS reference?

Nowadays, with a tad more experience under my belt (though, sadly, never enough), I keep finding myself talking to newcomers to the field who seem to either have the same doubts I used to have and don't understand why some things are over here and others over there. When I mention that Javascript is a programming language which, when used in the context of a browser, has access to several APIs of which `canvas` and `DOM` are only two out of many, I get blank stares.

This article is an attempt at clarifying those distinctions and, hopefully, give you a bit more clarity into some basic programming concepts which might seem unimportant or too arcane to understand when you're just starting out.

## Javascript is a programming language
If this subheading might seem borderline offensive in its obviousness --- "I know JS is a programming language" --- it is crucial in understanding what comes later on. First of all, it is good to establish what is a programming language. Let's focus on the "language" bit.

Much in the same way human languages establish a set of rules for the exchange of information between two (usually human) entities, programming languages are sets of rules to establish communication between humans and machines. What should stick out here is that languages are not words or actual information, but a set of instructions on how to organise said words into something that can actually be understood.

English, for instance, is not the sum of all words in its dictionary, but the set of rules that establish the usage of these words. If I simply write "dog is cat cute really and", it is unlikely people will understand me even though I used valid and common English words; that is because a language tends to be more about the structure within which we organise information and less about that information itself.

Computer languages do not deviate much from this. As you are probably aware, writing

```javascript
    let x = 1;
```

Means something completely different than

```javascript
    let = 1 x;
```

Or, more precisely, the first would be understood by any modern browser or JS interpreter whilst the second makes very little sense, even if its individual elements are still valid "words" in Javascript.

What this means is that programming languages, in and of themselves, don't actually do anything. They are a set of rules which dictate how we must organise commands so the computer can read, understand and execute them.

Javascript, as a programming language, is no exception. Even though it is most commonly used in a browser, Javascript alone can't do anything to a web page.

## Browsers and APIs
If, you may ask, Javascript is powerless to do anything to a web page, how come it can make pages do all sorts of things? That's where APIs come into play.

Once again, we're not really interested in the deep intricacies of things here, so simple definitions are more than enough. API stands for "Application Programming Interface" and is, in a nutshell, a way that one program allows other programs to interact with it.

To use a metaphor: Spotify is a program and its API is your computer's headphone jack. By connecting to that API, that is, by jacking in, you gain access to the part of Spotify that plays music. You don't have access to Spotify, you don't know how it actually works, but you also don't need to if all you want is to listen to music.

You don't have access to Twitter's code, you don't know how Twitter actually works, but you can still connect your own web application to it and download all tweets made by a specific user using its API, for instance.

The browser does something very much like that when it comes to web pages. As a web programmer, you do not (and should not) have access to the browser itself, much in the same way you do not have access to Twitter itself. Instead, the browser has several jacks that you can plug in to when you want to, say, create a new `div`.

The DOM is one of these many jacks.

## The DOM (and other browser APIs)
DOM stands for Document Object Model. What that means, in simple terms, is that the browser reads an HTML document and then creates an outline of this document. This outline is all about the structure of the page: what elements there are, which element contains which, their order and so on.

Once that is done, the browser makes this outline available for you to interact with it.

Of course, these interactions must follow a set of rules. The browser obviously does not speak English (nor any other human language) and is actually bound to a single programming language --- you probably know that this language is Javascript.

It is through the DOM that you can do things like this

```javascript
let el = document.querySelector('.aClassName);
console.log(el);
```

What happens here is that, using Javascript, you ask `document`, which is the main access point to the page's outline, to search through all of its nodes for the first instance of an element with a class attribute that equals `.aClassName`.

Afterwards, you access `console` (another browser API), and ask it to print the result of what you asked the DOM to look for --- which will hopefully be a reference to the element you were looking for.

## Why all this?
You might be asking yourself now: "ok, but what do I care? I've been doing all sorts of cool things without really understanding any of this." Although that is, arguably, a valid position, I believe that the learning the difference between these concepts is fundamental as one begins to mature as a programmer. More than that, I only started to feel I actually understood how programming worked once these distinctions became completely clear to me.

As you begin to tackle increasingly complex projects, programming becomes less about writing code and more about managing systems and processes. The first, fundamental step to do that is to understand these systems and processes, their parts, what differentiates them and the ways they interact with each other. Even before you reach that point, knowing these things can save you quite some time when it comes to finding the information you need to move forward with whatever it is you want to do right now.
