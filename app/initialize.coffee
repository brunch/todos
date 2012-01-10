{BrunchApplication} = require 'helpers'
{TodoList} = require 'collections/todo_list'
{MainRouter} = require 'routers/main_router'
{HomeView} = require 'views/home_view'
{NewTodoView} = require 'views/new_todo_view'
{StatsView} = require 'views/stats_view'
{TodoView} = require 'views/todo_view'
{TodoListView} = require 'views/todo_list_view'

class exports.Application extends BrunchApplication
  # This callback would be executed on document ready event.
  initialize: ->
    @todoList = new TodoList
    @routers.main = new MainRouter
    @views.home = new HomeView
    @views.newTodo = new NewTodoView
    @views.todoList = new TodoListView
    @views.stats = new StatsView
    Backbone.history.start()

window.app = new exports.Application
