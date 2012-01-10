class exports.BrunchApplication
  constructor: ->
    @routers = {}
    @models = {}
    @collections = {}
    @views = {}
    @utils = {}
    jQuery =>
      @initialize this

  onReady: -> null
