class HomeView extends Backbone.View

  el: '#home-view'

  render: ->
    @$(@el).html app.templates.home()
    @$(@el).find('#todo-app').append app.views.newTodo.render().el
    @$(@el).find('#todo-app').append app.views.todos.render().el
    @$(@el).find('#todo-app').append app.views.stats.render().el
    @
