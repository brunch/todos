template = require './templates/new_todo'

module.exports = class NewTodoView extends Backbone.View
  @template = template

  id: 'new-todo-view'
  events:
    'keypress #new-todo': 'createOnEnter'
    'keyup #new-todo': 'showHint'

  render: ->
    @$el.html @template()
    this

  newAttributes: ->
    attributes =
      order: @collection.nextOrder()
    value = @$('#new-todo').val()
    attributes.content = value if value
    attributes

  createOnEnter: (event) ->
    return unless event.keyCode is 13
    @collection.create @newAttributes()
    @$('#new-todo').val ''

  showHint: (event) ->
    tooltip = @$('.ui-tooltip-top')
    input = @$('#new-todo')
    tooltip.fadeOut()
    clearTimeout @tooltipTimeout if @tooltipTimeout
    return if input.val() is '' or  input.val() is input.attr('placeholder')
    @tooltipTimeout = setTimeout (-> tooltip.fadeIn()), 1000
