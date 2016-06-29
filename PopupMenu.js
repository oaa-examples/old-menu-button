/**
*   @constructor PopupMenu
*
*   @desc
*       Wrapper object for a simple popup menu (without nested submenus)
*
*   @param menuNode
*       The DOM element node that serves as the popup menu container. Each
*       child element of menuNode that represents a menuitem must have a
*       'role' attribute with value 'menuitem'.
*
*   @param controller
*       The object that is a wrapper for the DOM element that controls the
*       menu, e.g. a button element, with an 'aria-controls' attribute that
*       references this menu's menuNode.
*
*       The controller object is expected to have the following properties:
*       1. domNode: The controller object's DOM element node, need for
*          retrieving positioning information.
*       2. hasHover: boolean that indicates whether the controller object's
*          domNode has responded to a mouseover event with no subsequent
*          mouseout event having occurred.
*/
var PopupMenu = function (menuNode, controller) {
  var elementChildren;

  // Check whether menuNode is a DOM element
  if (!menuNode instanceof Element)
    throw new TypeError("PopupMenu constructor argument menuNode is not a DOM Element.");

  // Check whether menuNode has role='menu'
  if (menuNode.getAttribute('role') !== 'menu')
    throw new Error("PopupMenu constructor argument menuNode does not have attribute role=\"menu\".");

  // Check whether menuNode has child elements
  if (menuNode.childElementCount === 0)
    throw new Error("PopupMenu constructor argument menuNode has no element children.")

  // Check whether menuNode child elements all have role='menuitem'
  elementChildren = menuNode.children;
  for (var i = 0; i < elementChildren.length; i++) {
    if (elementChildren[i].getAttribute('role') !== 'menuitem')
      throw new Error("PopupMenu constructor argument menuNode has child elements that do not have attribute role=\"menuitem\".");
  }

  menuNode.tabIndex = -1;
  this.menuNode = menuNode;
  this.controller = controller;

  this.menuitems = [];
  this.firstItem = null;
  this.lastItem  = null;

  this.hasFocus  = false;   // set by menuitem: handleFocus, handleBlur
  this.hasHover  = false;   // set by menu: handleMouseover, handleMouseout

  this.utils = MenuUtils();
};

/*
*   @method PopupMenu.prototype.init
*
*   @desc
*       Add menuNode event listeners for mouseover and mouseout. Traverse
*       menuNode children to configure each menuitem and populate menuitems
*       array. Initialize firstItem and lastItem properties.
*/
PopupMenu.prototype.init = function () {
  var element, numItems, that = this;

  this.menuNode.addEventListener('mouseover', function (event) {
    that.handleMouseover(event);
  });

  this.menuNode.addEventListener('mouseout', function (event) {
    that.handleMouseout(event);
  });

  // Configure element children of menuNode; populate menuitems array.
  element = this.menuNode.firstElementChild;

  while (element) {
    if (element.getAttribute('role')  === 'menuitem') {
      this.utils.initMenuitem(element, this);
      this.menuitems.push(element);
    }
    element = element.nextElementSibling;
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  numItems = this.menuitems.length;
  if (numItems > 0) {
    this.firstItem = this.menuitems[0];
    this.lastItem  = this.menuitems[numItems - 1]
  }
};

/* EVENT HANDLERS */

PopupMenu.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

PopupMenu.prototype.handleMouseout = function (event) {
  var that = this;
  this.hasHover = false;
  setTimeout(function () { that.close(false) }, 300);
};

/* FOCUS MANAGEMENT METHODS */

PopupMenu.prototype.setFocusToController = function () {
  this.controller.domNode.focus();
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

/* MENU DISPLAY METHODS */

PopupMenu.prototype.open = function () {
  // get position and bounding rectangle of selector object's DOM node (e.g. button or menuitem)
  var pos  = this.utils.getPosition(this.controller.domNode);
  var rect = this.controller.domNode.getBoundingClientRect();

  // set CSS properties
  this.menuNode.style.display = 'block';
  this.menuNode.style.position = 'absolute';
  this.menuNode.style.top  = (pos.y + rect.height) + "px";
  this.menuNode.style.left = pos.x + "px";

  // set aria-expanded attribute
  this.menuNode.setAttribute('aria-expanded', 'true');
};

PopupMenu.prototype.close = function (force) {
  if (force || (!this.hasFocus && !this.hasHover && !this.controller.hasHover)) {
    this.menuNode.style.display = 'none';
    this.menuNode.setAttribute('aria-expanded', 'false');
  }
};
