homeTemplate = require './templates/home'


class exports.HomeView extends Backbone.View
  el: '#home-view'

  render: ->
    console.log 'Rendering',
    @$el.html homeTemplate()
    $todo =  @$el.find('#todo-app')
    for viewName in ['newTodo', 'todoList', 'stats']
      $todo.append app.views[viewName].render().el
    this
