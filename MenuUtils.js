/**
*   @function MenuUtils
*
*   @desc
*       Function that returns an object with menu-related utility methods:
*       1. initMenuitem: configure menuitem elements of PopupMenu object
*       2. getPosition: for positioning the menuNode of PopupMenu object
*/
var MenuUtils = function () {

  var keyCode = Object.freeze({
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

  // Event handlers for menuitem elements in a PopupMenu. See PopupMenu.js
  // for the definition of the object passed in as the menu parameter.
  var handleKeydown = function (event, menu) {
    var tgt = event.currentTarget,
        flag = false, clickEvent;

    switch (event.keyCode) {
      case keyCode.SPACE:
      case keyCode.RETURN:
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

      case keyCode.ESC:
        menu.setFocusToController();
        menu.close(true);
        flag = true;
        break;

      case keyCode.UP:
        menu.setFocusToPreviousItem(tgt);
        flag = true;
        break;

      case keyCode.DOWN:
        menu.setFocusToNextItem(tgt);
        flag = true;
        break;

      case keyCode.HOME:
      case keyCode.PAGEUP:
        menu.setFocusToFirstItem();
        flag = true;
        break;

      case keyCode.END:
      case keyCode.PAGEDOWN:
        menu.setFocusToLastItem();
        flag = true;
        break;

      case keyCode.TAB:
        menu.setFocusToController();
        menu.close(true);
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  var handleClick = function (event, menu) {
    menu.setFocusToController();
    menu.close(true);
  };

  var handleFocus = function (event, menu) {
    menu.hasFocus = true;
  };

  var handleBlur = function (event, menu) {
    menu.hasFocus = false;
    setTimeout(function () { menu.close(false) }, 300);
  };

  // return object with utility methods
  return {
    initMenuitem: function (element, menu) {
      element.tabIndex = -1;

      element.addEventListener('keydown', function (event) {
        handleKeydown(event, menu);
      });

      element.addEventListener('click', function (event) {
        handleClick(event, menu);
      });

      element.addEventListener('focus', function (event) {
        handleFocus(event, menu);
      });

      element.addEventListener('blur', function (event) {
        handleBlur(event, menu);
      });
    },

    getPosition: function (element) {
      var x = 0, y = 0;

      while (element) {
        x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        y += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
      }

      return { x: x, y: y };
    }

  }; // end return
};
