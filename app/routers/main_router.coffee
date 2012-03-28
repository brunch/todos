mediator = require 'mediator'

module.exports = class MainRouter extends Backbone.Router
  routes:
    '': 'home'

  home: ->
    null
