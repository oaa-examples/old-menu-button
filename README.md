# menu-button
Accessible menu button, menu and menu item widgets

## Widgets

### MenuButton
Rendered as a `button` element, reachable in the tab order of the document.

#### Event Listeners & Interaction Behavior

| Type         | Event / Key         | Behavior      |
| :----------- | :------------------ |:------------- |
| Keyboard     | `keydown` / `space` `return` | <ul><li>Open menu</li><li>Set focus to first item</li></ul> |
|              | `keydown` / `up arrow`       | <ul><li>Open menu</li><li>Set focus to last item</li></ul>  |
|              | `keydown` / `down arrow`     | <ul><li>Open menu</li><li>Set focus to first item</li></ul> |
| Mouse        | `mouseover`                  | <ul><li>Open menu</li></ul>  |
|              | `mouseout`                   | <ul><li>Close menu</li></ul> |

### PopupMenu
Rendered as a conditionally-displayed `ul` list element


### MenuItem
Rendered as an `li` list item element contained in a list


