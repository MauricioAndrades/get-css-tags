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
    window.domJSON = factory(root);
  }
})(this, (function(selector, arr, options) {

  getCSS = {};

  var getContentDocument = function(contentDocument) {
    if (contentDocument.body) {
      return contentDocument.body;
    } else {
      var bodyElement = contentDocument.querySelector('body');
      if (bodyElement) {
        return bodyElement;
      }
    }
    return contentDocument.documentElement;
  };

  getCSS.getText = function(element) {
    var text = '';
    if (element) {
      var childNode = null;
      var childNodes = element.childNodes;
      var childNodeType = null;
      // Loop through the child nodes
      for (var i = 0, l = childNodes.length; i < l; i++) {
        childNode = childNodes[i];
        childNodeType = childNode.nodeType;
        // If the child node type is an element
        if (childNodeType === Node.ELEMENT_NODE) {
          text += getText(childNode);
        } else if (childNodeType === Node.TEXT_NODE) {
          text += childNode.nodeValue + ' ';
        }
      }
    }
    return text;
  };

  getCSS.getTags = function(parent, arr) {

    if (parent.hasChildNodes()) {
      for (var cNode = parent.firstChild; cNode; cNode = cNode.nextSibling) {
        getCSS.getTags(cNode, arr);
      }

    }
    var nodePath = nodeFilter.call(parent);
    if (nodePath) arr.push(nodePath);
  };

  var nodeFilter = function(node) {
    node = this;
    currentNodeType = node.nodeType;
    var found = false;
    if (!currentNodeType) return false;
    else {
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
      if (options) {
        var nodeCssPath = simpleSelector(this);
        return nodeCssPath;
      } else {
        var nodeCssPath = cssPath(this);
        return nodeCssPath;
      }

    }
    return found;
  };

  var simpleSelector = function(node) {
    var lowerCaseName = node.localName || node.nodeName.toLowerCase();
    if (node.nodeType !== Node.ELEMENT_NODE)
      return lowerCaseName;
    if (lowerCaseName === 'input' && node.getAttribute('type') && !node.getAttribute('id') && !node.getAttribute('class'))
      return lowerCaseName + '[type=\"' + node.getAttribute('type') + '\"]';
    if (node.getAttribute('id'))
      return lowerCaseName + '#' + node.getAttribute('id');
    if (node.getAttribute('class'))
      return (lowerCaseName === 'div' ? '' : lowerCaseName) + '.' + node.getAttribute('class').trim().replace(/\s+/g, '.');
    return lowerCaseName;
  };

  var isCSSIdentChar = function(c) {
    if (/[a-zA-Z0-9_-]/.test(c))
      return true;
    return c.charCodeAt(0) >= 0xA0;
  };

  var escapeIdentifierIfNeeded = function(ident) {
    if (isCSSIdentifier(ident))
      return ident;
    var shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident);
    var lastIndex = ident.length - 1;
    return ident.replace(/./g, function(c, i) {
      return ((shouldEscapeFirst && i === 0) || !isCSSIdentChar(c)) ? escapeAsciiChar(c, i === lastIndex) : c;
    });
  };

  var isCSSIdentifier = function(value) {
    return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);
  };

  var cssPath = function(node, optimized) {
    if (node.nodeType !== Node.ELEMENT_NODE) return node;
    var steps = [];
    var contextNode = node;
    while (contextNode) {
      var step = _cssPathStep(contextNode, !!optimized, contextNode === node);
      if (!step) break;
      steps.push(step);
      if (step.optimized) break;
      contextNode = contextNode.parentNode;
    }
    steps.reverse();
    return steps.join(' > ');
  };

  var idSelector = function(id) {
    return '#' + escapeIdentifierIfNeeded(id);
  };

  var _cssPathStep = function(node, optimized, isTargetNode) {
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    var id = node.getAttribute('id');
    if (optimized) {
      if (id) return new DOMNodePathStep(idSelector(id), true);
      var nodeNameLower = node.nodeName.toLowerCase();
      if (nodeNameLower === 'body' || nodeNameLower === 'head' || nodeNameLower === 'html') return new DOMNodePathStep(node.nodeName.toLowerCase(), true);
    }
    var nodeName = node.nodeName.toLowerCase();
    if (id) return new DOMNodePathStep(nodeName.toLowerCase() + idSelector(id), true);
    var parent = node.parentNode;
    if (!parent || parent.nodeType === Node.DOCUMENT_NODE) return new DOMNodePathStep(nodeName.toLowerCase(), true);

    var prefixedElementClassNames = function(node) {
      var classAttribute = node.getAttribute('class');
      if (!classAttribute) return [];
      return classAttribute.split(/\s+/g).filter(Boolean).map(function(name) {
        return '$' + name;
      });
    };

    var escapeIdentifierIfNeeded = function(ident) {
      if (isCSSIdentifier(ident)) return ident;
      var shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident);
      var lastIndex = ident.length - 1;
      return ident.replace(/./g, function(c, i) {
        return shouldEscapeFirst && i === 0 || !isCSSIdentChar(c) ? escapeAsciiChar(c, i === lastIndex) : c;
      });
    };

    var escapeAsciiChar = function(c, isLast) {
      return '\\' + toHexByte(c) + (isLast ? '' : ' ');
    };

    var toHexByte = function(c) {
      var hexByte = c.charCodeAt(0).toString(16);
      if (hexByte.length === 1) hexByte = '0' + hexByte;
      return hexByte;
    };

    var isCSSIdentChar = function(c) {
      if (/[a-zA-Z0-9_-]/.test(c)) return true;
      return c.charCodeAt(0) >= 160;
    };

    var isCSSIdentifier = function(value) {
      return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);
    };

    var prefixedOwnClassNamesArray = prefixedElementClassNames(node);
    var needsClassNames = false;
    var needsNthChild = false;
    var ownIndex = -1;
    var siblings = parent.children;
    for (var i = 0;
      (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
      var sibling = siblings[i];
      if (sibling === node) {
        ownIndex = i;
        continue;
      }
      if (needsNthChild) continue;
      if (sibling.nodeName.toLowerCase() !== nodeName.toLowerCase()) continue;
      needsClassNames = true;
      var ownClassNames = prefixedOwnClassNamesArray;
      var ownClassNameCount = 0;
      for (var name in ownClassNames) ++ownClassNameCount;
      if (ownClassNameCount === 0) {
        needsNthChild = true;
        continue;
      }
      var siblingClassNamesArray = prefixedElementClassNames(sibling);
      for (var j = 0; j < siblingClassNamesArray.length; ++j) {
        var siblingClass = siblingClassNamesArray[j];
        if (ownClassNames.indexOf(siblingClass)) continue;
        delete ownClassNames[siblingClass];
        if (!--ownClassNameCount) {
          needsNthChild = true;
          break;
        }
      }
    }

    var result = nodeName.toLowerCase();
    if (isTargetNode && nodeName.toLowerCase() === 'input' && node.getAttribute('type') && !node.getAttribute('id') && !node.getAttribute('class')) result += '[type="' + node.getAttribute('type') + '"]';
    if (needsNthChild) {
      result += ':nth-child(' + (ownIndex + 1) + ')';
    } else if (needsClassNames) {
      for (var prefixedName in prefixedOwnClassNamesArray) result += '.' + escapeIdentifierIfNeeded(prefixedOwnClassNamesArray[prefixedName].substr(1));
    }
    return new DOMNodePathStep(result, false);
  };

  var DOMNodePathStep = function(value, optimized) {
    this.value = value;
    this.optimized = optimized || false;
  };

  DOMNodePathStep.prototype = {
    toString: function() {
      return this.value;
    }
  };

  return getCSS;
}));

// example usage:
var tags = [];
var opts = {
  simple: true
};
var buildOptions = function(arr, callback) {
  var selector = document.querySelector('body');

  callback(selector, arr, opts);
};

buildOptions(tags, getCSS.getTags, opts);
