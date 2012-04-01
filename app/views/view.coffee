# Base class for all views.
module.exports = class View extends Backbone.View
  template: ->

  getRenderData: ->
    return

  render: =>
    console.debug "Rendering #{@constructor.name}"
    @$el.html @template @getRenderData()
    @afterRender()
    this

  afterRender: ->
    return
