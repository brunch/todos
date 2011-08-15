TodoView = require('views/todo_view').TodoView
todosTemplate = require('templates/todos')

class exports.TodosView extends Backbone.View

  id: 'todos-view'

  initialize: ->
    app.collections.todos.bind 'add', @addOne
    app.collections.todos.bind 'reset', @addAll
    app.collections.todos.bind 'all', @renderStats

  render: ->
    $(@el).html todosTemplate()
    @

  addOne: (todo) =>
    view = new TodoView model: todo
    $(@el).find("#todos").append view.render().el

  addAll: =>
    # TODO explain why this is working - see underscore source
    app.collections.todos.each @addOne

  renderStats: =>
    app.views.stats.render()
