(function() {
  $(document).ready(function() {
    module('stats view', {
      setup: function() {
        window.location.hash = "home";
        app.initialize();
        return Backbone.history.loadUrl();
      },
      teardown: function() {
        return localStorage.clear();
      }
    });
    test('render view', function() {
      var el;
      expect(1);
      app.collections.todos.create();
      el = app.views.stats.render().el;
      return equals($(el).find('.todo-count').length, 1);
    });
    return test('clear completed ', function() {
      expect(1);
      app.collections.todos.clearCompleted = function() {
        return ok(true);
      };
      return app.views.stats.clearCompleted();
    });
  });
}).call(this);
