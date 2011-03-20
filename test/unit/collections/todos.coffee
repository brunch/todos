$(document).ready( ->
  module('todos collection',
    setup: ->
      app.initialize()
    teardown: ->
      localStorage.clear()
  )

  test('check for initialized localstorage', ->
    expect 1
    equals typeof(app.collections.todos.localStorage), 'object'
  )

  test('get done todos', ->
    expect 2
    app.collections.todos.create {done: true, content: 'first'}
    app.collections.todos.create {done: false, content: 'second'}
    equals app.collections.todos.done().length, 1
    equals app.collections.todos.done()[0].get('content'), 'first'
  )

  test('get remaining todos', ->
    expect 2
    app.collections.todos.create {done: true, content: 'first'}
    app.collections.todos.create {done: false, content: 'second'}
    equals app.collections.todos.remaining().length, 1
    equals app.collections.todos.remaining()[0].get('content'), 'second'
  )

  test('nextOrder should return next list entry position', ->
    expect 2
    equals app.collections.todos.nextOrder(), 1
    app.collections.todos.create {order: 1}
    equals app.collections.todos.nextOrder(), 2
  )

  test('check order', ->
    expect 2
    # find out if comperator is working by providing order manually
    app.collections.todos.create {content: 'first', order: 2}
    app.collections.todos.create {content: 'second', order: 1}
    equals app.collections.todos.models[0].get('content'), 'second'
    equals app.collections.todos.models[1].get('content'), 'first'
  )

  test('clear all', ->
    expect 2
    # create two tasks, one of them is done and check if the done
    # is removed after calling clearCompleted
    app.collections.todos.create {done: true, content: 'first'}
    app.collections.todos.create {done: false, content: 'second'}
    app.collections.todos.clearCompleted()
    equals app.collections.todos.length, 1
    equals app.collections.todos.models[0].get('content'), 'second'
  )
)
