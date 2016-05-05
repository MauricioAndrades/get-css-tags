# Node Parser: getTags
The getTags module (part of the upcoming Node Parser Package) recursively parses the DOM and calculates the full CSS selection tags for every HTML DOM
element.

Example Output:

```js
tags = [
	"html > head > meta:nth-child(1)"
	"html > head > meta:nth-child(2)"
	"html > head > script:nth-child(3)"
	"html > head > script:nth-child(4)"
	"html > head > title"
	"html > head > meta:nth-child(6)"
	"html > head > meta:nth-child(7)"
]
```

Compared to JQuery output:
```js
$obj = [
	html.redesign
	head
	meta
	meta
	script
	script
	title
	meta
	meta
]
```


`getCSS.getTags(selector, array, options)`

# Example Usage:

```js
// EXAMPLE USAGE

var tags = [];
var selector = document.querySelector('body');
var opts = {
	simple: false
};

getCSS.getTags(selector, tags, opts)

```


