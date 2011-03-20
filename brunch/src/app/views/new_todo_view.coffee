class NewTodoView extends Backbone.View

  id: 'new-todo-view'

  events:
    'keypress #new-todo'  : 'createOnEnter'
    'keyup #new-todo'     : 'showHint'

  render: ->
    @$(@el).html app.templates.newTodo()
    @

  newAttributes: ->
    attributes =
      order: app.collections.todos.nextOrder()
    attributes.content = @$("#new-todo").val() if @$("#new-todo").val()
    attributes

  createOnEnter: (event) ->
    return unless event.keyCode is $.ui.keyCode.ENTER
    app.collections.todos.create @newAttributes()
    @$("#new-todo").val ''

  showHint: (event) ->
    tooltip = @$(".ui-tooltip-top")
    input = @$("#new-todo")
    tooltip.fadeOut()
    clearTimeout(@tooltipTimeout) if @tooltipTimeout
    return if input.val() is '' or  input.val() is input.attr 'placeholder'
    fadeIn = ->
      tooltip.fadeIn()
    @tooltipTimeout = _.delay fadeIn, 1000
