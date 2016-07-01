# menu-button
Example that combines a keyboard accessible menu button, popup menu and menuitem widgets

## Widget Descriptions

### MenuButton
Corresponding HTML: `button` element, reachable in the tab order of the document

ARIA role:  `button`

ARIA properties & states:

* `aria-controls` attribute specifies the menu container element that the button controls
* `aria-expanded`: set to true when menu is visible, false otherwise

Related objects:

* PopupMenu: delegate that specifies behavior of the menu container

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
Corresponding HTML: `ul` element, conditionally visible

ARIA role:  `menu`

Dependencies:

* Menu container element is expected to have `role="menu"`
* Each child element of the container is expected to have `role="menuitem"`
* PopupMenu saves a reference to each menuitem element

Related objects:

* MenuButton: delegate for the element that controls the menu visibility
* MenuItem: delegate that specifies behavior for each menuitem that the menu contains

#### Event Listeners & Interaction Behavior

| Type         | Event / Key         | Behavior      | Prevent Default |
| :----------- | :------------------ |:------------- | :-------------- |
| Mouse        | `mouseover`         | Save hover state (affects whether menu is closed by other means)  | no |
|              | `mouseout`          | Close menu (if no children have focus) | no |

### MenuItem
Corresponding HTML: `li` element

ARIA role:  `menuitem`

Dependencies: PopupMenu: delegate for the DOM menu container element; calls its methods for
setting focus within the menu and for closing the menu

Related objects:

* PopupMenu: delegate for the container element that contains the menuitem

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
