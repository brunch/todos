(function(/*! Brunch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    };
    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
}).call(this);(this.require.define({
  "views/todo_list_view": function(exports, require, module) {
    (function() {
  var TodoView, todoListTemplate,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TodoView = require('views/todo_view').TodoView;

  todoListTemplate = require('./templates/todo_list');

  exports.TodoListView = (function(_super) {

    __extends(TodoListView, _super);

    function TodoListView() {
      this.renderStats = __bind(this.renderStats, this);
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      TodoListView.__super__.constructor.apply(this, arguments);
    }

    TodoListView.prototype.id = 'todos-view';

    TodoListView.prototype.addOne = function(todo) {
      var view;
      view = new TodoView({
        model: todo
      });
      return this.$el.find('#todos').append(view.render().el);
    };

    TodoListView.prototype.addAll = function() {
      return app.todoList.each(this.addOne);
    };

    TodoListView.prototype.initialize = function() {
      app.todoList.bind('add', this.addOne);
      app.todoList.bind('reset', this.addAll);
      return app.todoList.bind('all', this.renderStats);
    };

    TodoListView.prototype.render = function() {
      this.$el.html(todoListTemplate());
      return this;
    };

    TodoListView.prototype.renderStats = function() {
      return app.views.stats.render();
    };

    return TodoListView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "helpers": function(exports, require, module) {
    (function() {

  exports.BrunchApplication = (function() {

    function BrunchApplication() {
      var _this = this;
      this.routers = {};
      this.models = {};
      this.collections = {};
      this.views = {};
      this.utils = {};
      jQuery(function() {
        return _this.initialize(_this);
      });
    }

    BrunchApplication.prototype.onReady = function() {
      return null;
    };

    return BrunchApplication;

  })();

}).call(this);

  }
}));
(this.require.define({
  "collections/todo_list": function(exports, require, module) {
    (function() {
  var Todo,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Todo = require('models/todo').Todo;

  exports.TodoList = (function(_super) {

    __extends(TodoList, _super);

    function TodoList() {
      TodoList.__super__.constructor.apply(this, arguments);
    }

    TodoList.prototype.model = Todo;

    TodoList.prototype.initialize = function() {
      return this.localStorage = new Store('todos');
    };

    TodoList.prototype.done = function() {
      return this.filter(function(todo) {
        return todo.get('done');
      });
    };

    TodoList.prototype.remaining = function() {
      return this.without.apply(this, this.done());
    };

    TodoList.prototype.nextOrder = function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    };

    TodoList.prototype.comparator = function(todo) {
      return todo.get('order');
    };

    TodoList.prototype.clearCompleted = function() {
      return _.each(this.done(), function(todo) {
        return todo.clear();
      });
    };

    return TodoList;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/todo": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.Todo = (function(_super) {

    __extends(Todo, _super);

    function Todo() {
      Todo.__super__.constructor.apply(this, arguments);
    }

    Todo.prototype.defaults = {
      content: 'Empty todo...',
      done: false
    };

    Todo.prototype.toggle = function() {
      return this.save({
        done: !this.get('done')
      });
    };

    Todo.prototype.clear = function() {
      this.destroy();
      return this.view.remove();
    };

    return Todo;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "routers/main_router": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'home'
    };

    MainRouter.prototype.home = function() {
      app.views.home.render();
      return app.todoList.fetch();
    };

    return MainRouter;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var homeTemplate,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  homeTemplate = require('./templates/home');

  exports.HomeView = (function(_super) {

    __extends(HomeView, _super);

    function HomeView() {
      HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.el = '#home-view';

    HomeView.prototype.render = function() {
      var $todo, viewName, _i, _len, _ref;
      console.log('Rendering', this.$el.html(homeTemplate()));
      $todo = this.$el.find('#todo-app');
      _ref = ['newTodo', 'todoList', 'stats'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        viewName = _ref[_i];
        $todo.append(app.views[viewName].render().el);
      }
      return this;
    };

    return HomeView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/new_todo_view": function(exports, require, module) {
    (function() {
  var newTodoTemplate,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  newTodoTemplate = require('./templates/new_todo');

  exports.NewTodoView = (function(_super) {

    __extends(NewTodoView, _super);

    function NewTodoView() {
      NewTodoView.__super__.constructor.apply(this, arguments);
    }

    NewTodoView.prototype.id = 'new-todo-view';

    NewTodoView.prototype.events = {
      'keypress #new-todo': 'createOnEnter',
      'keyup #new-todo': 'showHint'
    };

    NewTodoView.prototype.render = function() {
      this.$el.html(newTodoTemplate());
      return this;
    };

    NewTodoView.prototype.newAttributes = function() {
      var attributes;
      attributes = {
        order: app.todoList.nextOrder()
      };
      if (this.$('#new-todo').val()) {
        attributes.content = this.$('#new-todo').val();
      }
      return attributes;
    };

    NewTodoView.prototype.createOnEnter = function(event) {
      if (event.keyCode !== 13) return;
      app.todoList.create(this.newAttributes());
      return this.$('#new-todo').val('');
    };

    NewTodoView.prototype.showHint = function(event) {
      var input, tooltip;
      tooltip = this.$('.ui-tooltip-top');
      input = this.$('#new-todo');
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (input.val() === '' || input.val() === input.attr('placeholder')) return;
      return this.tooltipTimeout = setTimeout((function() {
        return tooltip.fadeIn();
      }), 1000);
    };

    return NewTodoView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/stats_view": function(exports, require, module) {
    (function() {
  var statsTemplate,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  statsTemplate = require('./templates/stats');

  exports.StatsView = (function(_super) {

    __extends(StatsView, _super);

    function StatsView() {
      StatsView.__super__.constructor.apply(this, arguments);
    }

    StatsView.prototype.id = 'stats-view';

    StatsView.prototype.events = {
      'click .todo-clear': 'clearCompleted'
    };

    StatsView.prototype.render = function() {
      var data;
      data = {
        total: app.todoList.length,
        done: app.todoList.done().length,
        remaining: app.todoList.remaining().length
      };
      this.$el.html(statsTemplate({
        stats: data
      }));
      return this;
    };

    StatsView.prototype.clearCompleted = function() {
      return app.todoList.clearCompleted();
    };

    return StatsView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var BrunchApplication, HomeView, MainRouter, NewTodoView, StatsView, TodoList, TodoListView, TodoView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  TodoList = require('collections/todo_list').TodoList;

  MainRouter = require('routers/main_router').MainRouter;

  HomeView = require('views/home_view').HomeView;

  NewTodoView = require('views/new_todo_view').NewTodoView;

  StatsView = require('views/stats_view').StatsView;

  TodoView = require('views/todo_view').TodoView;

  TodoListView = require('views/todo_list_view').TodoListView;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      this.todoList = new TodoList;
      this.routers.main = new MainRouter;
      this.views.home = new HomeView;
      this.views.newTodo = new NewTodoView;
      this.views.todoList = new TodoListView;
      this.views.stats = new StatsView;
      return Backbone.history.start();
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;

}).call(this);

  }
}));
(this.require.define({
  "views/todo_view": function(exports, require, module) {
    (function() {
  var todoTemplate,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  todoTemplate = require('./templates/todo');

  exports.TodoView = (function(_super) {

    __extends(TodoView, _super);

    function TodoView() {
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.prototype.tagName = 'li';

    TodoView.prototype.events = {
      'click .check': 'toggleDone',
      'dblclick .todo-content': 'edit',
      'click .todo-destroy': 'clear',
      'keypress .todo-input': 'updateOnEnter'
    };

    TodoView.prototype.initialize = function() {
      this.model.bind('change', this.render);
      return this.model.view = this;
    };

    TodoView.prototype.render = function() {
      this.$el.html(todoTemplate({
        todo: this.model.toJSON()
      }));
      this.$('.todo-input').bind('blur', this.update);
      return this;
    };

    TodoView.prototype.toggleDone = function() {
      return this.model.toggle();
    };

    TodoView.prototype.edit = function() {
      this.$el.addClass('editing');
      return $('.todo-input').focus();
    };

    TodoView.prototype.update = function() {
      this.model.save({
        content: this.$('.todo-input').val()
      });
      return this.$el.removeClass('editing');
    };

    TodoView.prototype.updateOnEnter = function(event) {
      if (event.keyCode === $.ui.keyCode.ENTER) return this.update();
    };

    TodoView.prototype.remove = function() {
      return this.$el.remove();
    };

    TodoView.prototype.clear = function() {
      return this.model.clear();
    };

    return TodoView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/user": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.User = (function(_super) {

    __extends(User, _super);

    function User() {
      User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/home": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div id="todo-app">\n  <h1>Todos</h1>\n</div>\n<ul id="instructions">\n  <li>Double-click to edit a todo.</li>\n  <!-- <li><a href="../docs/todos.html">View the annotated source.</a></li> -->\n</ul>\n<div id="credits">\n  <span>Originally created by</span>\n  <a href="http://jgn.me/">J&eacute;r&ocirc;me Gravel-Niquet</a>\n  <span>Rewritten by</span>\n  <a href="https://github.com/brunch">Brunch Team</a>\n</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/new_todo": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<input id="new-todo" placeholder="What needs to be done?" type="text">\n<div class="ui-tooltip-top">Press Enter to save this task</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/todo": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div class="todo ');
    
      if (this.todo.done) __out.push('done');
    
      __out.push('">\n  <div class="display">\n    <input class="check" type="checkbox" ');
    
      if (this.todo.done) __out.push('checked="checked"');
    
      __out.push('>\n  <div class="todo-content">');
    
      __out.push(__sanitize(this.todo.content));
    
      __out.push('</div>\n    <span class="todo-destroy"></span>\n  </div>\n  <div class="edit">\n    <input class="todo-input" type="text" value="');
    
      __out.push(__sanitize(this.todo.content));
    
      __out.push('">\n  </div>\n</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/stats": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      if (this.stats.total) {
        __out.push('\n  <span class="todo-count">\n    <span class="number">');
        __out.push(__sanitize(this.stats.remaining));
        __out.push('</span>\n    <span class="word">\n      ');
        if (this.stats.remaining === 1) {
          __out.push('item');
        } else {
          __out.push('items');
        }
        __out.push('\n    </span>\n    left.\n  </span>\n');
      }
    
      __out.push('\n\n');
    
      if (this.stats.done) {
        __out.push('\n  <a class="todo-clear">\n    Clear <span class="number-done">');
        __out.push(__sanitize(this.stats.done));
        __out.push('</span> completed\n    <span class="word-done">\n      ');
        if (this.stats.done === 1) {
          __out.push('item');
        } else {
          __out.push('items');
        }
        __out.push('\n    </span>\n  </span>\n');
      }
    
      __out.push('\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/todo_list": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<ul id="todos"></ul>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
