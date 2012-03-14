{TodoView} = require 'views/todo_view'
todoListTemplate = require './templates/todo_list'


class exports.TodoListView extends Backbone.View
  id: 'todos-view'

  addOne: (todo) =>
    view = new TodoView model: todo
    @$el.find('#todos').append view.render().el

  addAll: =>
    # TODO explain why this is working - see underscore source
    app.todoList.each @addOne

  initialize: ->
    app.todoList.bind 'add', @addOne
    app.todoList.bind 'reset', @addAll
    app.todoList.bind 'all', @renderStats

  render: ->
    @$el.html todoListTemplate()
    this

  renderStats: =>
    app.views.stats.render()
