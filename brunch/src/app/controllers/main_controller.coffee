class MainController extends Backbone.Controller
  routes :
    "home": "home"

  home: ->
    app.views.home.render()
    app.collections.todos.fetch()
