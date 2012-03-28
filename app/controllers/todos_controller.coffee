Controller = require 'controllers/controller'
Todos = require 'models/todos'
TodosView = require 'views/todos_view'

module.exports = class TodosController extends Controller
  historyURL: (params) ->
    ''

  index: (params) ->
    @collection = new Todos()
    @view = new TodosView {@collection}
