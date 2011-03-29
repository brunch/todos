(function() {
  $(document).ready(function() {
    module('todo view', {
      setup: function() {
        window.location.hash = "home";
        app.initialize();
        Backbone.history.loadUrl();
        this.todo = app.collections.todos.create();
        return this.view = new window.app.classes.view.todo({
          model: this.todo
        });
      },
      teardown: function() {
        return localStorage.clear();
      }
    });
    test('initialize view', function() {
      expect(2);
      ok(this.view.model._callbacks.change);
      return ok(this.view.model.view);
    });
    return test('render view', function() {
      var el;
      expect(2);
      el = this.view.render().el;
      equals($(el).find('.todo-input').length, 1);
      return ok($(el).find('.todo-input').data("events").blur);
    });
  });
}).call(this);
