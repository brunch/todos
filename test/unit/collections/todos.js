(function() {
  $(document).ready(function() {
    module('todos collection', {
      setup: function() {
        return app.initialize();
      },
      teardown: function() {
        return localStorage.clear();
      }
    });
    test('check for initialized localstorage', function() {
      expect(1);
      return equals(typeof app.collections.todos.localStorage, 'object');
    });
    test('get done todos', function() {
      expect(2);
      app.collections.todos.create({
        done: true,
        content: 'first'
      });
      app.collections.todos.create({
        done: false,
        content: 'second'
      });
      equals(app.collections.todos.done().length, 1);
      return equals(app.collections.todos.done()[0].get('content'), 'first');
    });
    test('get remaining todos', function() {
      expect(2);
      app.collections.todos.create({
        done: true,
        content: 'first'
      });
      app.collections.todos.create({
        done: false,
        content: 'second'
      });
      equals(app.collections.todos.remaining().length, 1);
      return equals(app.collections.todos.remaining()[0].get('content'), 'second');
    });
    test('nextOrder should return next list entry position', function() {
      expect(2);
      equals(app.collections.todos.nextOrder(), 1);
      app.collections.todos.create({
        order: 1
      });
      return equals(app.collections.todos.nextOrder(), 2);
    });
    test('check order', function() {
      expect(2);
      app.collections.todos.create({
        content: 'first',
        order: 2
      });
      app.collections.todos.create({
        content: 'second',
        order: 1
      });
      equals(app.collections.todos.models[0].get('content'), 'second');
      return equals(app.collections.todos.models[1].get('content'), 'first');
    });
    return test('clear all', function() {
      expect(2);
      app.collections.todos.create({
        done: true,
        content: 'first'
      });
      app.collections.todos.create({
        done: false,
        content: 'second'
      });
      app.collections.todos.clearCompleted();
      equals(app.collections.todos.length, 1);
      return equals(app.collections.todos.models[0].get('content'), 'second');
    });
  });
}).call(this);
