<!--
 Copyright (c) 2020 Thomas J. Otterson
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# @barandis/utils

This is simply a library of small dependency-free utility functions. It's meant as a place for me to keep things for my own personal use, but if there's anything you find here that you'd like to use, please feel free (in accordance with the MIT License, of course).

I'm not planning on providing any documentation short of what's on this page, but there are extensive doc comments, and the unit tests probably provide the best documentation of all.

Here's a list of the utilities available.

Name | Module | Description
-----|------|------------
`compose` | `functions` | Combines two or more functions into a single function
`curry` | `functions` | Partially applies a function
`enumerate`| `iterators` | Iterates over a collection, returning tuples of the value and its index
`final` | `objects` | Creates a class whose instances cannot be modified
`flip` | `functions` | Reverses the order of parameter lists in a curried function
`frozen` | `objects` | Creates an extensible class whose instances cannot be modified
`Nothing` | `objects` | A chainable object representing nothing
`NullClass` | `objects` | A class that does not extend from `Object`
`ordinal` | `numbers` | Appends a number with `'st'`, `'nd'`, `'rd'`, or `'th'` as appropriate
`pipe` | `functions` | Composes functions in reverse order from `compose`
`pluck` | `collections` | Extracts values from object collections by key
`range` | `ierators` | Produces an iterator starting at a number and ending at another
`scan` | `collections` | Like `reduce` but returns all of the intermediate reductions
`tracked` | `objects` | Adds object tracking to a factory function
`wordinal` | `numbers` | Turns a number into a word-based ordinal number
