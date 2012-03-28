mediator = require 'mediator'
CollectionView = require 'views/collection_view'
template = require './templates/todos'
TodoView = require 'views/todo_view'

module.exports = class TodosView extends CollectionView
  @template = template
  
  tagName: 'div' # This is not directly a list but contains a list
  id: 'todos'

  containerSelector: '#content-container'
  listSelector: 'ul' # Append the item views to this element
  fallbackSelector: '.fallback'

  # The most important method a class inheriting from CollectionView
  # must overwrite.
  getView: (item) ->
    # Instantiate an item view
    new TodoView model: item
