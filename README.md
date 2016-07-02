# menu-button
This example illustrates the creation of custom menu button, popup menu and menu
item widgets that implement the keyboard interactions and utilize the ARIA roles,
properties and states specified by the [WAI-ARIA Authoring Practices 1.1]
(http://www.w3.org/TR/wai-aria-practices-1.1).

----------------------------------------------------------------
## HTML Markup
The HTML file for this example is `example.html`.

### button element
* In this example, a `button` element is used to create a custom menu button.
* The `button` element is reachable, by default, in the tab order of the document.
* The delegate object for the `button` element is an instance of MenuButton, which is
  instantiated and initialized in the `script` tag of `example.html`.

__ARIA role, properties and states__
* Role: `button` (default)
* Property: `aria-controls` &#8211; specifies the menu container element that the button controls
* Property: `aria-haspopup` &#8211; indicates that activating the button results in the display of a popup menu
* State: `aria-expanded` &#8211; set to true when the button's menu is visible, false otherwise

### ul element
* In this example, a `ul` element is used to create a custom popup menu.
* The `ul` element is the menu container element; its children are `li` elements that
  act as menu items.
* The delegate object for the `ul` menu container element is an instance of PopupMenu,
  which is instantiated and initialized by the MenuButton object.

__ARIA role, properties and states__
* Role: `menu`

### li element
* In this example, `li` elements are used to create custom menu items.
* The delegate object for the `li` element is an instance of MenuItem, which is
  instantiated and initialized by the PopupMenu object.

__ARIA role, properties and states__
* Role: `menuitem`

----------------------------------------------------------------
## Widget Descriptions

### MenuButton
* JavaScript file: `MenuButton.js`
* Serves as the delegate for an HTML `button` element that acts as a menu button.

__Related objects__

* PopupMenu: The MenuButton object instantiates and initializes a PopupMenu object,
  which is the delegate for the `ul` `menu` element that it controls.

__Event Listeners & Interaction Behavior__

| Type         | Event / Key                  | Behavior                           | Prevent Default |
| :----------- | :--------------------------- | :--------------------------------- | :-------------- |
| Keyboard     | `keydown` / `space` `return` | Open menu; set focus to first item | yes |
|              | `keydown` / `up arrow`       | Open menu; set focus to last item  | yes |
|              | `keydown` / `down arrow`     | Open menu; set focus to first item | yes |
| Mouse        | `mouseover`                  | Open menu                          | no  |
|              | `mouseout`                   | Close menu                         | no  |
|              | `click`                      | Open menu; set focus to first item | no  |

### PopupMenu
* JavaScript file: `PopupMenu.js`
* Serves as the delegate for an HTML `ul` element that acts as a popup menu.
* Each child `li` element of the `ul` is expected to have role `menuitem`.
* The PopupMenu object saves a reference to each `li` `menuitem` element.
* It also saves the state of the menu in its properties `hasFocus` and `hasHover`.

__Related objects__

* MenuButton: The PopupMenu is initialized with a reference to the `controllerObj`, which in this
  example is a MenuButton object, which is the delegate for the `button` element that controls the menu.
* MenuItem: The PopupMenu instantiates and initializes a MenuItem object for each `li` `menuitem` it contains,
  which, in turn, adds the necessary event listeners to the `li`.

__Event Listeners & Interaction Behavior__

| Type         | Event / Key         | Behavior      | Prevent Default |
| :----------- | :------------------ | :------------ | :-------------- |
| Mouse        | `mouseover`         | Save hover state (affects whether menu is closed by other means)  | no |
|              | `mouseout`          | Close menu (if no children have focus) | no |

### MenuItem
* JavaScript file: `MenuItem.js`
* The MenuItem object serves as the delegate for an HTML `li` element that act as menu item.
* It implements `menuitem` behavior by adding the necessary event listeners to an `li` element.
* Most of the keyboard event handling in this example is done by the MenuItem object.
* In response to those events, the MenuItem object calls the methods of its related PopuMenu object.

__Related objects__

* PopupMenu: Each MenuItem object is instantiated with a reference to its PopupMenu object, which is the
  delegate for the `ul` `menu` element that contains the `li` `menuitem` element.

__Event Listeners & Interaction Behavior__

| Type         | Event / Key                    | Behavior                           | Prevent Default |
| :----------- | :----------------------------- | :--------------------------------- | :-------------- |
| Keyboard     | `keydown` / `space` `return`   | Generate click event (see mouse click behavior) | yes |
|              | `keydown` / `esc` `tab`        | Close menu; set focus to controller element | no |
|              | `keydown` / `up arrow`         | Set focus to previous item (wraps) | yes |
|              | `keydown` / `down arrow`       | Set focus to next item (wraps)     | yes |
|              | `keydown` / `home` `page up`   | Set focus to first item            | yes |
|              | `keydown` / `end` `page down`  | Set focus to last item             | yes |
| Mouse        | `click`                        | Close menu; set focus to menu's controller element | no |
| Focus        | 'focus'                        | Save focus state in menu object    | no |
|              | 'blur'                         | Save focus state in menu object    | no |
