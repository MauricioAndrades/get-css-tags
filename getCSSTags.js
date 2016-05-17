(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(root);
    });
  } else if (typeof exports !== 'undefined') {
    var getCSS = factory(root);
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = getCSS;
    }
    exports = getCSS;
  } else {
    window.getCSS = factory(root);
  }
})(this, (function(parent, arr, options) {

  getCSS = {};

  getCSS.getTags = function(parent, arr) {
    if (parent.hasChildNodes()) {
      for (var cNode = parent.firstChild; cNode; cNode = cNode.nextSibling) {
        getCSS.getTags(cNode, arr);
      }
    }
    var nodePath = nodeFilter.call(parent);
    if (nodePath) {
      arr.push(nodePath);
    }
  };

  function nodeFilter(node) {
    node = this;
    var currentNodeType = node.nodeType;
    var found = false;
    if (!currentNodeType) {
      return false;
    } else {
      switch (currentNodeType) {
        case 1:
          found = true;
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
          found = false;
          break;
        default:
          return found;
      }
    }
    if (found === true) {
      var nodeCssPath;
      if (opts.simple === true) {
        nodeCssPath = simpleSelector(node);
        return nodeCssPath;
      } else {
        nodeCssPath = cssPath(node);
        return nodeCssPath;
      }
    }
    return found;
  }

  function simpleSelector(node) {
    var lowerCaseName = "";
    try {
      lowerCaseName = node.localName || node.nodeName.toLowerCase();
    } catch (e) {
      arr.push(e);
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return lowerCaseName;
    }
    if (lowerCaseName === 'input' && node.getAttribute('type') && !node.getAttribute('id') && !node.getAttribute('class')) {
      return lowerCaseName + '[type=\"' + node.getAttribute('type') + '\"]';
    }
    if (node.getAttribute('id')) {
      return lowerCaseName + '#' + node.getAttribute('id');
    }
    if (node.getAttribute('class')) {
      return (lowerCaseName === 'div' ? '' : lowerCaseName) + '.' + node.getAttribute('class').trim().replace(/\s+/g, '.');
    }
    return lowerCaseName;
  }

  function cssPath(node, optimized) {
    if (node.nodeType !== Node.ELEMENT_NODE)
      return node;
    var steps = [];
    var cNode = node;
    while (cNode) {
      var step = cssPathStep(cNode, !!optimized, cNode === node);
      if (!step)
        break;
      steps.push(step);
      if (step.optimized) {
        break;
      }
      cNode = cNode.parentNode;
    }
    steps.reverse();
    return steps.join(' > ');
  }

  function cssPathStep(node, optimized, isTargetNode) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    var nodeID = node.getAttribute('id');

    if (optimized) {
      if (nodeID) {
        return new domNodePathStep(idSelector(nodeID), true);
      }
      var nodeNameLower = node.nodeName.toLowerCase();
      if (nodeNameLower === 'body' || nodeNameLower === 'head' || nodeNameLower === 'html') {
        return new domNodePathStep(node.nodeName.toLowerCase(), true);
      }
    }

    var nodeName = node.nodeName.toLowerCase();

    if (nodeID) {
      return new domNodePathStep(nodeName.toLowerCase() + idSelector(nodeID), true);
    }

    var parentNode = node.parentNode;

    if (!parentNode || parentNode.nodeType === Node.DOCUMENT_NODE) {
      return new domNodePathStep(nodeName.toLowerCase(), true);
    }

    function prefixedElClassName(node) {
      var classAttr = node.getAttribute('class');
      if (!classAttr) {
        return [];
      }
      return classAttr.split(/\s+/g).filter(Boolean).map(function(name) {
        return '$' + name;
      });
    }

    function idSelector(id) {
      return '#' + escIdentifier(id);
    }

    function escIdentifier(ident) {
      if (isIdentifier(ident)) {
        return ident;
      }
      var escapeTest = /^(?:[0-9]|-[0-9-]?)/.test(ident);
      var lastIndex = ident.length - 1;
      try {
        return ident.replace(/./g, function(c, i) {
          return escapeTest && i === 0 || !isIdentChar(c) ? escAscii(c, i === lastIndex) : c;
        });
      } catch (e) {
        arr.push(e);
      }
    }


    function escAscii(c, isLast) {
      return '\\' + toHexByte(c) + (isLast ? '' : ' ');
    }


    function toHexByte(c) {
      var hexByte = c.charCodeAt(0).toString(16);
      if (hexByte.length === 1) {
        hexByte = '0' + hexByte;
      }
      return hexByte;
    }

    /**
     *  @param   {string}   c  character
     *  @return  {Boolean}
     */
    function isIdentChar(c) {
      if (/[a-zA-Z0-9_-]/.test(c)) {
        return true;
      }
      return c.charCodeAt(0) >= 160;
    }


    function isIdentifier(value) {
      return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);
    }

    var prefixedOClassNameArr = prefixedElClassName(node);
    var needsClass = false;
    var needsNthChild = false;
    var ownIndex = -1;
    var sibs = parentNode.children;

    for (var i = 0;
      (ownIndex === -1 || !needsNthChild) && i < sibs.length; ++i) {
      var sib = sibs[i];

      if (sib === node) {
        ownIndex = i;
        continue;
      }

      if (needsNthChild) {
        continue;
      }

      if (sib.nodeName.toLowerCase() !== nodeName.toLowerCase()) {
        continue;
      }

      needsClass = true;
      var oClassName = prefixedOClassNameArr;
      var oClassNameCount = 0;

      for (var name in oClassName) {
        ++oClassNameCount;
      }

      if (oClassNameCount === 0) {
        needsNthChild = true;
        continue;
      }

      var sibClassNamesArr = prefixedElClassName(sib);
      for (var j = 0; j < sibClassNamesArr.length; ++j) {
        var sibClass = sibClassNamesArr[j];
        if (oClassName.indexOf(sibClass)) {
          continue;
        }
        delete oClassName[sibClass];
        if (!--oClassNameCount) {
          needsNthChild = true;
          break;
        }
      }
    }

    var result = nodeName.toLowerCase();

    if (isTargetNode && nodeName.toLowerCase() === 'input' && node.getAttribute('type') && !node.getAttribute('id') && !node.getAttribute('class')) {
      result += '[type="' + node.getAttribute('type') + '"]';
    }

    if (needsNthChild) {
      result += ':nth-child(' + (ownIndex + 1) + ')';
    } else if (needsClass) {
      for (var prefixedName in prefixedOClassNameArr) {
        result += '.' + escIdentifier(prefixedOClassNameArr[prefixedName].substr(1));
      }
    }
    return new domNodePathStep(result, false);
  }

  function domNodePathStep(value, optimized) {
    this.value = value;
    this.optimized = optimized || false;
  }

  domNodePathStep.prototype = {
    toString: function() {
      return this.value;
    }
  };

  return getCSS;

}));

// EXAMPLE USAGE

var tags = [];
var selector = document.querySelector('body');
var opts = {
  simple: false
};

getCSS.getTags(selector, tags, opts);

//now tags = ["a#gb78 > div.gb_8", "a#gb78 > div.gb_9"]...
