newTodoTemplate = require './templates/new_todo'

class exports.NewTodoView extends Backbone.View
  id: 'new-todo-view'

  events:
    'keypress #new-todo': 'createOnEnter'
    'keyup #new-todo': 'showHint'

  render: ->
    @$el.html newTodoTemplate()
    this

  newAttributes: ->
    attributes =
      order: app.todoList.nextOrder()
    attributes.content = @$('#new-todo').val() if @$('#new-todo').val()
    attributes

  createOnEnter: (event) ->
    return unless event.keyCode is 13
    app.todoList.create @newAttributes()
    @$('#new-todo').val ''

  showHint: (event) ->
    tooltip = @$('.ui-tooltip-top')
    input = @$('#new-todo')
    tooltip.fadeOut()
    clearTimeout @tooltipTimeout if @tooltipTimeout
    return if input.val() is '' or  input.val() is input.attr 'placeholder'
    @tooltipTimeout = setTimeout (-> tooltip.fadeIn()), 1000
