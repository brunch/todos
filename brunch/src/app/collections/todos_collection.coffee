Todo = require('models/todo_model').Todo

class exports.Todos extends Backbone.Collection

  model: Todo

  initialize: ->
    @localStorage = new Store "todos"

  done: ->
    return @filter( (todo) ->
      todo.get 'done'
    )

  remaining: ->
    @without.apply @, @done()

  nextOrder: ->
    return 1 unless @length
    @last().get('order') + 1

  comparator: (todo) ->
    todo.get 'order'

  clearCompleted: ->
    _.each(@done(), (todo) ->
      todo.clear()
    )
