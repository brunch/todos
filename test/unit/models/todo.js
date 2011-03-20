(function() {
  $(document).ready(function() {
    var todo;
    todo = {};
    module('todo model', {
      setup: function() {
        app.initialize();
        return this.todo = app.collections.todos.create();
      },
      teardown: function() {
        localStorage.clear();
        return this.todo = {};
      }
    });
    test('todo defaults', function() {
      expect(2);
      equals(this.todo.get('done'), false);
      return equals(this.todo.get('content'), 'empty todo...');
    });
    test('todo toggle', function() {
      expect(2);
      this.todo.toggle();
      equals(this.todo.get('done'), true);
      this.todo.toggle();
      return equals(this.todo.get('done'), false);
    });
    return test('todo clear', function() {
      var view;
      expect(2);
      view = {
        remove: function() {
          return ok(true);
        }
      };
      this.todo.view = view;
      this.todo.clear();
      return equals(app.collections.todos.length, 0);
    });
  });
}).call(this);
