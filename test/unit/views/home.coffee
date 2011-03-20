$(document).ready( ->
  module('home view',
    setup: ->
      window.location.hash = "home"
      app.initialize()
    teardown: ->
      localStorage.clear()
  )

  test('render subviews', ->
    expect 3
    Backbone.history.loadUrl()
    el = app.views.home.render().el
    equals $(el).find('#new-todo-view').length, 1
    equals $(el).find('#todos-view').length, 1
    equals $(el).find('#stats-view').length, 1
  )
)
