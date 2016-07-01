# menu-button
Accessible menu button, menu and menu item widgets

## Widgets

### MenuButton
Rendered as a `button` element, reachable in the tab order of the document.

#### Event Listeners/Handlers:

<!--
| Type           | Event/Key        | Action        |
| -------------- | ---------------- | ------------- |
| Keyboard       | Space/Return     |    * Open menu   |
-->

##### Keyboard

* `keydown` : `space` `return`
    * Open menu
    * Set focus to first item

* `keydown` : `up arrow`
    * Open menu
    * Set focus to last item

* `keydown` : `down arrow`
    * Open menu
    * Set focus to first item

##### Mouse

* `mouseover`
    * Open menu

* `mouseout`
    * Close menu

### PopupMenu
Rendered as a conditionally-displayed `ul` list element


### MenuItem
Rendered as an `li` list item element contained in a list


