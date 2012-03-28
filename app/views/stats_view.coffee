template = require './templates/stats'
View = require './view'

module.exports = class StatsView extends Backbone.View
  @template = template

  id: 'stats-view'  
  events:
    'click .todo-clear' : 'clearCompleted'

  initialize: ->
    mediator.on 'renderStats', @render

  render: ->
    stats =
      total: @collection.length
      done: @collection.done().length
      remaining: @collection.remaining().length
    @$el.html @template {stats}
    this

  clearCompleted: ->
    @collection.clearCompleted()
