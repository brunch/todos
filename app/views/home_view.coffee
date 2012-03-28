mediator = require 'mediator'
NewTodoView = require './new_todo_view'
TodoListView = require './todo_list_view'
StatsView = require './stats_view'
View = require './view'

module.exports = class HomeView extends View
  @template = template

  el: '#home-view'

  # render: ->
  #   @$el.html @template()
  #   $todo = @$el.find('#todo-app')
  # 
  #   collection = mediator.todoList
  #   newTodoView = new NewTodoView {collection}
  #   todoListView = new TodoListView {collection}
  #   statsView = new StatsView {collection}
  # 
  #   for view in [newTodoView, todoListView, statsView]
  #     $todo.append view.render().el
  #   this
