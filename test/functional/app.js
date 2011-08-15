(function() {
  $(document).ready(function() {
    module('functional app testing', {
      setup: function() {
        window.location.hash = "home";
        app.initialize();
        return Backbone.history.loadUrl();
      },
      teardown: function() {
        return localStorage.clear();
      }
    });
    test('Add new todo', function() {
      var todo, todoDOMEntry;
      expect(4);
      $('#new-todo').val('bring out the garbage');
      testHelpers.keydown($.ui.keyCode.ENTER, '#new-todo');
      todo = app.collections.todos.at(0);
      equals(todo.get('content'), 'bring out the garbage');
      equals(todo.get('done'), false);
      todoDOMEntry = $('#todos > li');
      equals(todoDOMEntry.find('.todo-content').html(), 'bring out the garbage');
      return equals(todoDOMEntry.find('.check').is(':checked'), false);
    });
    test("Add empty todo", function() {
      var todo, todoDOMEntry;
      expect(4);
      $('#new-todo').val('');
      testHelpers.keydown($.ui.keyCode.ENTER, '#new-todo');
      todo = app.collections.todos.at(0);
      equals(todo.get('content'), 'empty todo...');
      equals(todo.get('done'), false);
      todoDOMEntry = $('#todos > li');
      equals(todoDOMEntry.find('.todo-content').html(), 'empty todo...');
      return equals(todoDOMEntry.find('.check').is(':checked'), false);
    });
    test("Update todo's content", function() {
      var todoDOMEntry;
      expect(3);
      testHelpers.createTodo();
      todoDOMEntry = $('#todos > li');
      todoDOMEntry.find('.todo-content').trigger('dblclick');
      equals(todoDOMEntry.hasClass('editing'), true);
      todoDOMEntry.find('.todo-input').val('cleanup dirt from torn garbage bag');
      testHelpers.keydown($.ui.keyCode.ENTER, '.todo-input');
      equals(app.collections.todos.at(0).get('content'), 'cleanup dirt from torn garbage bag');
      return equals(todoDOMEntry.find('.todo-content').html(), 'cleanup dirt from torn garbage bag');
    });
    test("Update todo's status", function() {
      var todoDOMEntry;
      expect(2);
      testHelpers.createTodo();
      todoDOMEntry = $('#todos > li');
      todoDOMEntry.find('.check').trigger('click');
      equals(app.collections.todos.at(0).get('done'), true);
      todoDOMEntry.find('.check').trigger('click');
      return equals(app.collections.todos.at(0).get('done'), false);
    });
    test("Delete todo", function() {
      expect(2);
      testHelpers.createTodo();
      $('#todos > li').find('.todo-destroy').trigger('click');
      equals(app.collections.todos.length, 0);
      return equals($('#todos').html(), '');
    });
    test("Check all stats (total, done and remaining)", function() {
      expect(5);
      testHelpers.createTodo();
      testHelpers.createTodo('answer support request');
      $('#todos > li:first').find('.check').trigger('click');
      equals(app.collections.todos.length, 2);
      equals(app.collections.todos.done().length, 1);
      equals(app.collections.todos.remaining().length, 1);
      equals($('.todo-count > .number').html(), '1');
      return equals($('.todo-clear').find('.number-done').html(), '1');
    });
    return test("Clear todos", function() {
      expect(2);
      testHelpers.createTodo();
      $('#todos > li').find('.check').trigger('click');
      $('.todo-clear > a').trigger('click');
      equals(app.collections.todos.length, 0);
      return equals($('#todos').html(), '');
    });
  });
}).call(this);
