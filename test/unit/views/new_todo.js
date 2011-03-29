(function() {
  $(document).ready(function() {
    module('newTodo view', {
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
      el = app.views.newTodo.render().el;
      return equals($(el).find('#new-todo').length, 1);
    });
    test('get attributes for new todo', function() {
      var attributes;
      expect(2);
      $('#new-todo').val('bring out the garbage');
      attributes = app.views.newTodo.newAttributes();
      equals(attributes.order, 1);
      return equals(attributes.content, 'bring out the garbage');
    });
    test('create new todo', function() {
      var event;
      expect(2);
      $('#new-todo').val('bring out the garbage');
      event = {
        keyCode: $.ui.keyCode.ENTER
      };
      app.views.newTodo.createOnEnter(event);
      equals($("#new-todo").val(), '');
      return equals(app.collections.todos.length, 1);
    });
    return asyncTest("show hint after 1 second", function() {
      expect(1);
      $('#new-todo').val('bring out the garbage');
      app.views.newTodo.showHint();
      return setTimeout(function() {
        equals($(".ui-tooltip-top").css('display'), 'block');
        return start();
      }, 1500);
    });
  });
}).call(this);
