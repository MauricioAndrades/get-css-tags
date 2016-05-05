# Node Parser: getTags
The getTags module (part of the upcoming Node Parser Package) recursively parses the DOM and calculates the full CSS selection tags for every HTML DOM
element.

The output looks like this:

```js
tags = [
"div#sr-header-area > div > div.drop-choices.srdrop > a:nth-child(41)"
"iframe#mv-single"
"div#mv-tiles"
"span#mv-noti-msg"
"span#mv-undo"
"span#mv-restore"
"div#mv-noti > div"
]
```

The getCSS module exposes 2 methods:
`getCSS.getTags(array, )`

# Example Usage:

```js
var tags = [];
var opts = {
  simple: true
};
var letsGetEm = function(arr, callback) {
  var selector = document.querySelector('body');
  callback(selector, arr, opts);
};

letsGetEm(tags, getCSS.getTags, opts);

```


