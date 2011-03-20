# Todo

This is a rewrite of Todos (Backbone's example application). We rewrote it to provide a simple and complete brunch example. This example also contains a test suite using [QUnit](http://docs.jquery.com/Qunit). Special thanks to [Jérôme Gravel-Niquet](http://jgn.me/) for his groundwork.

## App Structure

In this example the todo list renders each list item. This has two disadvantages. Once it lacks performance if you include each item instead of generating the whole list and insert it at once. See [http://www.quirksmode.org/dom/innerhtml.html](http://www.quirksmode.org/dom/innerhtml.html) for more Information. On the other hand you add a lot of event listeners. If you would add the whole list and bind the events to it, the events from the list items bubble up to the list element and you could catch them there.

Why didn't we to that in this example? Ff you don't have a large set of items the performance difference is not that big, but the code is much easier to read because it's better encapsulated.

## Development

Use `brunch build` or `brunch watch` to compile changes in src folder.
Usually we don't track the js/css files in our repositories, but decided to keep them here, cause we hope it would be easier to start using it.

## How to run tests

To regenerate js test files run

    cake compileTests

and view `test/index.html` in your browser.

## Improvements

* Add unit tests for views
* Add inline comments
