window.app = {}
app.controllers = {}
app.models = {}
app.collections = {}
app.views = {}

Todos = require('collections/todos_collection').Todos
MainController = require('controllers/main_controller').MainController
HomeView = require('views/home_view').HomeView
NewTodoView = require('views/new_todo_view').NewTodoView
TodosView = require('views/todos_view').TodosView
StatsView = require('views/stats_view').StatsView
TodoView = require('views/todos_view').TodoView

# app bootstrapping on document ready
$(document).ready ->
  app.initialize = ->
    app.collections.todos = new Todos()

    app.controllers.main = new MainController()
    app.views.home = new HomeView()
    app.views.newTodo = new NewTodoView()
    app.views.todos = new TodosView()
    app.views.stats = new StatsView()

    Backbone.history.saveLocation("home") if Backbone.history.getFragment() is ''
  app.initialize()
  Backbone.history.start()
