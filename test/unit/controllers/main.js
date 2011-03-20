(function() {
  $(document).ready(function() {
    module('main controller', {
      setup: function() {
        window.location.hash = "home";
        return app.initialize();
      },
      teardown: function() {
        return localStorage.clear();
      }
    });
    return test('home route', function() {
      expect(2);
      app.views.home = {
        render: function() {
          return ok(true);
        }
      };
      app.collections.todos = {
        fetch: function() {
          return ok(true);
        }
      };
      return Backbone.history.loadUrl();
    });
  });
}).call(this);
