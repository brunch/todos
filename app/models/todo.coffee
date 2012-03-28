Model = require './model'

# Our basic **Todo** model has `title`, `order`, and `done` attributes.
module.exports = class Todo extends Model
  # Default attributes for the todo item.
  defaults:
    title: 'Empty todo...'
    order: 1
    done: no

  # Ensure that each todo created has `title`.
  initialize: ->
    @set title: @defaults.title unless @get('title')

  # Toggle the `done` state of this todo item.
  toggle: ->
    @save done: not @get 'done'

  # Remove this Todo from *localStorage*.
  clear: ->
    @destroy()
