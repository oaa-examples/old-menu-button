/*
*   @constructor PopupMenu
*
*   @desc
*       Object that encapsulates data and behavior (via event handlers)
*       of a custom HTML popup menu component.
*
*   @param menuNode
*       The DOM element node that serves as the popup menu container. Each
*       child element of menuNode that represents a menuitem must have a
*       'role' attribute with value 'menuitem'.
*
*   @param owner
*       The object that is a wrapper for the DOM element that 'owns' the menu,
*       i.e. has an 'aria-owns' or 'aria-controls' attribute that references
*       this menu's menuNode. Examples of owner objects include:
*       1. MenuButton ('button' element with 'aria-controls' attribute)
*       2. PopupMenuItem ('span' element with role='menuitem' and 'aria-owns'
*          attribute).
*       The owner object is expected to have the following properties:
*       1. domNode: The owner object's DOM element node, needed for obtaining
*          positioning information.
*       2. hasHover: boolean that indicates whether domNode has responded to
*          mouseover event with no subsequent mouseout event having occurred.
*/
var PopupMenu = function (menuNode, owner) {
  // Check whether menuNode is a DOM element
  if (!menuNode instanceof Element)
    throw new TypeError("PopupMenu constructor argument 'menuNode' is not a DOM Element.");

  // Check whether menuNode has role='menu'
  if (menuNode.getAttribute('role') !== 'menu')
    throw new Error("PopupMenu constructor argument 'menuNode' does not have role of 'menu'")

  // Check whether menuNode has child elements
  if (menuNode.childElementCount === 0)
    throw new Error("PopupMenu constructor argument 'menuNode' has no Element children.")

  menuNode.tabIndex = -1;
  this.menuNode = menuNode;
  this.owner = owner;

  this.menuitems = [];
  this.firstItem = null;
  this.lastItem  = null;

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'RETURN'   : 13,
    'ESC'      : 27,
    'SPACE'    : 32,
    'PAGEUP'   : 33,
    'PAGEDOWN' : 34,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

/*
*   @method PopupMenu.prototype.init
*
*   @desc
*       Add menuNode event listeners for mouseover and mouseout.
*       Set firstItem and lastItem to corresponding menuitems.
*       For each menuitem: set tabindex and add event listeners
*       for keydown, click, focus and blur events.
*/
PopupMenu.prototype.init = function () {
  var menuitem, numItems, that = this;

  this.menuNode.addEventListener('mouseover', function (event) {
    that.handleMouseover(event);
  });

  this.menuNode.addEventListener('mouseout', function (event) {
    that.handleMouseout(event);
  });

  menuitem = this.menuNode.firstElementChild;

  while (menuitem) {
    if (menuitem.getAttribute('role')  === 'menuitem') {
      this.menuitems.push(menuitem);
      menuitem.tabIndex = -1;

      menuitem.addEventListener('keydown', function (event) {
        that.handleKeydown(event);
      });

      menuitem.addEventListener('click', function (event) {
        that.handleClick(event);
      });

      menuitem.addEventListener('focus', function (event) {
        that.handleFocus(event);
      });

      menuitem.addEventListener('blur', function (event) {
        that.handleBlur(event);
      });
    }
    menuitem = menuitem.nextElementSibling;
  }

  numItems = this.menuitems.length;
  if (numItems > 0) {
    this.firstItem = this.menuitems[0];
    this.lastItem  = this.menuitems[numItems - 1]
  }
};

/* EVENT HANDLERS FOR MENU ITEMS */

PopupMenu.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      // Create simulated mouse event to mimic the behavior of ATs
      // and let the event handler handleClick do the housekeeping.
      try {
        clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
      }
      catch(err) {
        if (document.createEvent) {
          // DOM Level 3 for IE 9+
          clickEvent = document.createEvent('MouseEvents');
          clickEvent.initEvent('click', true, true);
        }
      }
      tgt.dispatchEvent(clickEvent);
      flag = true;
      break;

    case this.keyCode.ESC:
      this.setFocusToOwnerElement();
      this.close(true);
      flag = true;
      break;

    case this.keyCode.UP:
      this.setFocusToPreviousItem(tgt);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.setFocusToNextItem(tgt);
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.TAB:
      this.setFocusToOwnerElement();
      this.close(true);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

PopupMenu.prototype.handleClick = function (event) {
  this.setFocusToOwnerElement();
  this.close(true);
};

PopupMenu.prototype.handleFocus = function (event) {
  this.hasFocus = true;
};

PopupMenu.prototype.handleBlur = function (event) {
  var that = this;
  this.hasFocus = false;
  setTimeout(function () { that.close(false) }, 300);
};

/* EVENT HANDLERS FOR MENU CONTAINER */

PopupMenu.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

PopupMenu.prototype.handleMouseout = function (event) {
  var that = this;
  this.hasHover = false;
  setTimeout(function () { that.close(false) }, 300);
};

/* ADDITIONAL METHODS */

PopupMenu.prototype.setFocusToOwnerElement = function () {
  this.owner.domNode.focus();
};

PopupMenu.prototype.setFocusToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstItem) {
    this.lastItem.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index - 1].focus();
  }
};

PopupMenu.prototype.setFocusToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastItem) {
    this.firstItem.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index + 1].focus();
  }
};

PopupMenu.prototype.setFocusToFirstItem = function () {
  this.firstItem.focus();
};

PopupMenu.prototype.setFocusToLastItem = function () {
  this.lastItem.focus();
};

PopupMenu.prototype.open = function () {
  // get position and bounding rectangle of selector object's DOM node (e.g. button or menuitem)
  var pos  = this.getPosition(this.owner.domNode);
  var rect = this.owner.domNode.getBoundingClientRect();

  // set CSS properties
  this.menuNode.style.display = 'block';
  this.menuNode.style.position = 'absolute';
  this.menuNode.style.top  = (pos.y + rect.height) + "px";
  this.menuNode.style.left = pos.x + "px";

  // set aria-expanded attribute
  this.menuNode.setAttribute('aria-expanded', 'true');
};

PopupMenu.prototype.close = function (force) {
  if (force || (!this.hasFocus && !this.hasHover && !this.owner.hasHover)) {
    this.menuNode.style.display = 'none';
    this.menuNode.setAttribute('aria-expanded', 'false');
  }
};

PopupMenu.prototype.getPosition = function (element) {
  var x = 0, y = 0;

  while (element) {
    x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    y += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
  }

  return { x: x, y: y };
};
