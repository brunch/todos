statsTemplate = require './templates/stats'


class exports.StatsView extends Backbone.View
  id: 'stats-view'
  events:
    'click .todo-clear' : 'clearCompleted'

  render: ->
    data =
      total: app.todoList.length
      done: app.todoList.done().length
      remaining: app.todoList.remaining().length

    @$(@el).html statsTemplate stats: data
    this

  clearCompleted: ->
    app.todoList.clearCompleted()
