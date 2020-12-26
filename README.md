# jsLib
# Linq
To use linq simply call linq method against an array:
```javascript
[1,2,3,4,5,6,7,8,9,0].linq()
  .where(function(i) { return i > 1; })
  .where(function(i) {return i < 6; })
  .toArray() //result is [2, 3, 4, 5]
[1,2,3,4,5,6,7,8,9,0].linq()
  .where(function(i) {return i >= 6; })
  .toArray() // result is [6, 7, 8, 9]
```
Supported methods:
  * .where(fn) - fn predecate
  * .select(fn) - fn factory function that creates new item.

# htmlBuilder
It's simple library for building dynamic HTML markup written on native JavaScript.
Main goal is to use only native JavaScript in library itself and in clients that use it. 
To describe HTML elements library uses native object literals. For instance to create table element simply call "table" method like this:
```javascript
var tableView = $$.table({
  'class': 'class-name-goes-here',
  head: $$.thead({
    store: true,
    'class': 'class-name-for-header',
    nameColumn: $$.th({ store: true, ... }),
    ageColumn: $$.th({ store: true, ... })
    dateColumn: $$.th({ })
  })
});
```
then you can access elements with dot notation:
```javascript
tableView.head.nameColumn.addClass('selected').
```
Note that to store elements in parent object one should use "store" property with value of true. As in example above dateColumn will not be accessibble in head object because it's object literal does not set "store" property value to true.
Library supports all native properties and events of the DOM elements and defines is's own methods:
* show
* hide
* click
* to be continued...
