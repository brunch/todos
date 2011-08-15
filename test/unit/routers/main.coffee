$(document).ready( ->
  module('main router',
    setup: ->
      window.location.hash = "home"
      app.initialize()
    teardown: ->
      localStorage.clear()
  )

  test('home route', ->
    expect 2

    # stub methods of home view and todos
    app.views.home =
      render: ->
        ok true
    app.collections.todos =
      fetch: ->
        ok true

    Backbone.history.loadUrl()
  )
)
