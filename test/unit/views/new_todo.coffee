$(document).ready( ->
  module('newTodo view',
    setup: ->
      window.location.hash = "home"
      app.initialize()
      Backbone.history.loadUrl()
    teardown: ->
      localStorage.clear()
  )

  test('render view', ->
    expect 1
    el = app.views.newTodo.render().el
    equals $(el).find('#new-todo').length, 1
  )

  test('get attributes for new todo', ->
    expect 2
    $('#new-todo').val('bring out the garbage')
    attributes = app.views.newTodo.newAttributes()
    equals attributes.order, 1
    equals attributes.content, 'bring out the garbage'
  )

  test('create new todo', ->
    expect 2
    $('#new-todo').val('bring out the garbage')
    event =
      keyCode: $.ui.keyCode.ENTER
    app.views.newTodo.createOnEnter(event)
    equals $("#new-todo").val(), ''
    equals app.collections.todos.length, 1
  )

  asyncTest("show hint after 1 second", ->
    expect 1
    $('#new-todo').val('bring out the garbage')
    app.views.newTodo.showHint()
    setTimeout( ->
      equals $(".ui-tooltip-top").css('display'), 'block'
      start()
    , 1500)
  )
)
