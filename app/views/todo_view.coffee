template = require './templates/todo'
View = require './view'

module.exports = class TodoView extends View
  # Cache the template function for a single item.
  @template = template

  # ... is a list tag.
  tagName: 'li'
  className: 'todo'

  # # The DOM events specific to an item.
  # events:
  #   'click .toggle':   'toggleDone'
  #   'dblclick .view':  'edit'
  #   'click a.destroy': 'clear'
  #   'keypress .edit':  'updateOnEnter'
  #   'blur .edit':      'close'
  # 
  # # The TodoView listens for changes to its model, re-rendering. Since there's
  # # a one-to-one correspondence between a **Todo** and a **TodoView** in this
  # # app, we set a direct reference on the model for convenience.
  # initialize: ->
  #   @model.on 'change', @render
  #   @model.on 'destroy', @remove
  # 
  # # Re-render the titles of the todo item.
  # render: =>
  #   @$el.html @template todo: @model.toJSON()
  #   @$el.toggleClass 'done', @model.get('done')
  #   @input = @$('.edit')
  #   this
  # 
  # # Toggle the `"done"` state of the model.
  # toggleDone: ->
  #   @model.toggle()
  # 
  # # Switch this view into `"editing"` mode, displaying the input field.
  # edit: ->
  #   @$el.addClass 'editing'
  #   @input.focus()
  # 
  # # Close the `"editing"` mode, saving changes to the todo.
  # close: ->
  #   value = @input.val()
  #   @clear() unless value
  #   @model.save title: value
  #   @$el.removeClass 'editing'
  # 
  # # If you hit `enter`, we're through editing the item.
  # updateOnEnter: (event) ->
  #   @close() if event.keyCode is 13
  # 
  # # Remove the item, destroy the model.
  # clear: ->
  #   @model.clear()
