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
  .where(fn) - fn predecate
  .select(fn) - fn factory function that creates new item.
