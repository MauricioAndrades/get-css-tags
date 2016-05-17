# Node Parser: getTags
The getTags module (part of the upcoming Node Parser Package) recursively
parses the DOM and calculates the full CSS selection tags for every element
Node.

Example Output:

```js
tags = [
	"html > head > meta:nth-child(1)",
	"html > head > meta:nth-child(2)",
	"html > head > script:nth-child(3)",
	"html > head > script:nth-child(4)",
	"html > head > title",
	"html > head > meta:nth-child(6)",
	"html > head > meta:nth-child(7)",
	"div#thing_t3_4jnhrn > div.midcol.unvoted > div.score.dislikes",
	"div#thing_t3_4jnhrn > div.midcol.unvoted > div.score.unvoted"
]

Compared to JQuery output:

```js
$JQ = [
	html
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

# Example Usage:
`getCSS.getTags(selector, array, options)`

`selector` starting node.

`array` The array we're gonna push the tags into.

`options.simple[bool]:` Options object. `true|false`
`
```js
// EXAMPLE USAGE
// `getCSS.getTags(selector, array, options)`

var tags = [];
var selector = document.querySelector('body');
var opts = {
	simple: false
};

getCSS.getTags(selector, tags, opts)

```


