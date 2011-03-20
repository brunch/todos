$(document).ready( ->
  todo = {}

  module('todo model',
    setup: ->
      app.initialize()
      @todo = app.collections.todos.create()
    teardown: ->
      localStorage.clear()
      @todo = {}
  )

  test('todo defaults', ->
    expect 2
    equals @todo.get('done'), false
    equals @todo.get('content'), 'empty todo...'
  )

  test('todo toggle', ->
    expect 2
    @todo.toggle()
    equals @todo.get('done'), true
    @todo.toggle()
    equals @todo.get('done'), false
  )

  test('todo clear', ->
    expect 2
    # stub view
    view =
      remove: () ->
        ok true
    @todo.view = view

    @todo.clear()
    equals app.collections.todos.length, 0
  )
)
