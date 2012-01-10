class exports.Todo extends Backbone.Model

  defaults:
    content: 'Empty todo...'
    done: no

  toggle: ->
    @save done: not @get 'done'

  clear: ->
    @destroy()
    @view.remove()
