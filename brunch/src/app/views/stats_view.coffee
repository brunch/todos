statsTemplate = require('templates/stats')

class exports.StatsView extends Backbone.View

  id: 'stats-view'

  events:
    'click .todo-clear a' : 'clearCompleted'

  render: ->
    data =
      total: app.collections.todos.length
      done: app.collections.todos.done().length
      remaining: app.collections.todos.remaining().length

    @$(@el).html(statsTemplate(stats: data))
    @

  clearCompleted: ->
    app.collections.todos.clearCompleted()
