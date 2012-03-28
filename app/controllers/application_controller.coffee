Controller = require 'controllers/controller'
ApplicationView = require 'views/application_view'
NavigationController = require 'controllers/navigation_controller'

module.exports = class ApplicationController extends Controller
  initialize: ->
    new ApplicationView()
    new NavigationController()
