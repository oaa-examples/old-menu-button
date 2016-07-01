# menu-button
Example that combines a keyboard accessible menu button, popup menu and menuitem widgets

## Widget Descriptions

### MenuButton
* In this example, a `button` element is used, with default ARIA role `button`.
* The `button` element is reachable in the tab order of the document.

#### ARIA properties & states
The `button` element has the following ARIA attributes:

* `aria-controls`: specifies the menu container element that the button controls
* `aria-expanded`: set to true when its menu is visible, false otherwise

#### Related objects

* PopupMenu: menu delegate that specifies the behavior of the menu container

#### Event Listeners & Interaction Behavior

| Type         | Event / Key                  | Behavior                           | Prevent Default |
| :----------- | :--------------------------- |:---------------------------------- | :-------------- |
| Keyboard     | `keydown` / `space` `return` | Open menu; set focus to first item | yes |
|              | `keydown` / `up arrow`       | Open menu; set focus to last item  | yes |
|              | `keydown` / `down arrow`     | Open menu; set focus to first item | yes |
| Mouse        | `mouseover`                  | Open menu                          | no  |
|              | `mouseout`                   | Close menu                         | no  |
|              | `click`                      | Open menu; set focus to first item | no  |

### PopupMenu

* In this example, a `ul` element is used, with ARIA role `menu`.
* Each child `li` element of the `ul` is expected to have role `menuitem`.
* The PopupMenu object saves a reference to each menuitem element.

#### Related objects

* MenuButton: delegate for the element that controls the menu visibility
* MenuItem: delegate that specifies the behavior for each menuitem that the PopupMenu contains

#### Event Listeners & Interaction Behavior

| Type         | Event / Key         | Behavior      | Prevent Default |
| :----------- | :------------------ |:------------- | :-------------- |
| Mouse        | `mouseover`         | Save hover state (affects whether menu is closed by other means)  | no |
|              | `mouseout`          | Close menu (if no children have focus) | no |

### MenuItem
* In this example, an `li` element is used, with ARIA role `menuitem`.
* The MenuItem object has a reference to its corresponding PopupMenu.
* Most of the keyboard event handling is done by the MenuItem object.
* In response to those events, it calls the methods of its related PopuMenu object.

#### Related objects

* PopupMenu: delegate for the container element that contains the menuitem elements

#### Event Listeners & Interaction Behavior

| Type         | Event / Key                    | Behavior                           | Prevent Default |
| :----------- | :----------------------------- |:---------------------------------- | :-------------- |
| Keyboard     | `keydown` / `space` `return`   | Generate click event (see mouse click behavior) | yes |
|              | `keydown` / `esc` `tab`        | Close menu; set focus to controller element | no |
|              | `keydown` / `up arrow`         | Set focus to previous item (wraps) | yes |
|              | `keydown` / `down arrow`       | Set focus to next item (wraps)     | yes |
|              | `keydown` / `home` `page up`   | Set focus to first item            | yes |
|              | `keydown` / `end` `page down`  | Set focus to last item             | yes |
| Mouse        | `click`                        | Close menu; set focus to menu's controller element | no |
| Focus        | 'focus'                        | Save focus state in menu object    | no |
|              | 'blur'                         | Save focus state in menu object    | no |
