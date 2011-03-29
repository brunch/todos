$(document).ready( ->
  module('stats view',
    setup: ->
      window.location.hash = "home"
      app.initialize()
      Backbone.history.loadUrl()
    teardown: ->
      localStorage.clear()
  )

  test('render view', ->
    expect 1
    app.collections.todos.create()
    el = app.views.stats.render().el
    equals $(el).find('.todo-count').length, 1
  )

  test('clear completed ', ->
    expect 1
    app.collections.todos.clearCompleted = ->
      ok true
    app.views.stats.clearCompleted()
  )
)
