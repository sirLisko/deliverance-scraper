#Scraping Deliverance

A Promises based scraper for [http://deliverance.co.uk](http://deliverance.co.uk). 

### Methods
#### deliverance.getMenu([menuName])
Return all the dishes of the menu.

`menuName` optional parameter, return just the dishes contained in specified menu.

```js
var deliverance = require('deliverance');

deliverance.getMenu().then(console.log).done(); 
// or
deliverance.getMenu('italian').then(console.log).done();
```


#### deliverance.getMenuList()
Return the names of all the menus availables.

```js
var deliverance = require('deliverance');

deliverance.getMenuList().then(console.log).done();
```


#### deliverance.exclude({[menus] [,dishes]});
Set which menus and/or dishes will be excluded from the following queries.

```js
var deliverance = require('deliverance');

deliverance.exclude({menus: ['italian', 'chinese'], dishes: ['pizza', 'chips']});
```
