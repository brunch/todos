Collection = require './collection'
Todo = require './todo'

# This collection is backed by *localStorage* instead of a remote server.
module.exports = class Todos extends Collection
  # Reference to this collection's model.
  model: Todo

  # Save all of the todo items under the `"todos"` namespace.
  localStorage: new Backbone.LocalStorage 'todos-brunch'

  # Filter down the list of all todo items that are finished.
  done: ->
    @filter (todo) ->
      todo.get 'done'

  # Filter down the list to only todo items that are still not finished.
  remaining: ->
    @without @done()...

  # We keep the Todos in sequential order, despite being saved by unordered
  # GUID in the database. This generates the next order number for new items.
  nextOrder: ->
    return 1 unless @length
    @last().get('order') + 1

  # Todos are sorted by their original insertion order.
  comparator: (todo) ->
    todo.get 'order'

  # clearCompleted: ->
  #   _.each @done(), (todo) -> todo.clear()
