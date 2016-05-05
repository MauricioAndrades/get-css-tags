# Node Parser: getTags
The getTags module (part of the upcoming Node Parser Package) recursively parses the DOM and calculates the full css selection tags for every HTML DOM
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

# Example Usage:

```js
var tags = [];
var buildOptions = function(arr, callback) {
  var selector = document.querySelector('body');
  var opts = {
    simple: false
  }
};

buildOptions(tags, function() {
  getCSS.getTags(tags)
});
```


