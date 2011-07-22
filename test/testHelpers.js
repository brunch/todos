(function() {
  window.testHelpers = {
    keydown: function(keyCode, selector) {
      var e;
      e = $.Event("keypress");
      e.keyCode = keyCode;
      return $(selector).trigger('focus').trigger(e);
    },
    createTodo: function(content) {
            if (content != null) {
        content;
      } else {
        content = 'bring out the garbage';
      };
      $('#new-todo').val(content);
      return testHelpers.keydown($.ui.keyCode.ENTER, '#new-todo');
    }
  };
}).call(this);
