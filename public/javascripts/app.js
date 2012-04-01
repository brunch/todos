(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var getModule = function(path) {
      var dirIndex;
      if (__hasProp.call(modules, path)) return modules[path];
      dirIndex = expand(path, './index');
      if (__hasProp.call(modules, dirIndex)) return modules[dirIndex];
    };

    var expand = function(root, name) {
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
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var dirIndex = expand(path, './index');
      var module, loader;

      if (__hasProp.call(cache, name)) {
        return cache[name];
      } else if (loader = getModule(path)) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          loader(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          cache[name] = module.exports;
          return cache[name];
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);(this.require.define({
  "application": function(exports, require, module) {
    (function() {
  var Application;

  Application = {
    initialize: function() {
      var HomeView, NewTodoView, Router, StatsView, TodoView, Todos, TodosView;
      Todos = require('models/todos');
      Router = require('lib/router');
      HomeView = require('views/home_view');
      NewTodoView = require('views/new_todo_view');
      StatsView = require('views/stats_view');
      TodoView = require('views/todo_view');
      TodosView = require('views/todos_view');
      this.todos = new Todos();
      this.homeView = new HomeView();
      this.statsView = new StatsView();
      this.newTodoView = new NewTodoView();
      this.todosView = new TodosView();
      this.router = new Router();
      return typeof Object.freeze === "function" ? Object.freeze(Application) : void 0;
    }
  };

  module.exports = Application;

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var application;

  application = require('application');

  $(function() {
    application.initialize();
    return Backbone.history.start();
  });

}).call(this);

  }
}));
(this.require.define({
  "lib/router": function(exports, require, module) {
    (function() {
  var Router, application,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  application = require('application');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'home'
    };

    Router.prototype.home = function() {
      application.homeView.render();
      return application.todos.fetch();
    };

    return Router;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "models/collection": function(exports, require, module) {
    (function() {
  var Collection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/model": function(exports, require, module) {
    (function() {
  var Model,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "models/todo": function(exports, require, module) {
    (function() {
  var Model, Todo,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Model = require('./model');

  module.exports = Todo = (function(_super) {

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

  })(Model);

}).call(this);

  }
}));
(this.require.define({
  "models/todos": function(exports, require, module) {
    (function() {
  var Collection, Todo, Todos,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Collection = require('./collection');

  Todo = require('models/todo');

  module.exports = Todos = (function(_super) {

    __extends(Todos, _super);

    function Todos() {
      Todos.__super__.constructor.apply(this, arguments);
    }

    Todos.prototype.model = Todo;

    Todos.prototype.initialize = function() {
      return this.localStorage = new Store('todos');
    };

    Todos.prototype.done = function() {
      return this.filter(function(todo) {
        return todo.get('done');
      });
    };

    Todos.prototype.remaining = function() {
      return this.without.apply(this, this.done());
    };

    Todos.prototype.nextOrder = function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    };

    Todos.prototype.comparator = function(todo) {
      return todo.get('order');
    };

    Todos.prototype.clearCompleted = function() {
      return _.each(this.done(), function(todo) {
        return todo.clear();
      });
    };

    return Todos;

  })(Collection);

}).call(this);

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
    (function() {
  var HomeView, View, application, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  application = require('application');

  template = require('./templates/home');

  module.exports = HomeView = (function(_super) {

    __extends(HomeView, _super);

    function HomeView() {
      HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.template = template;

    HomeView.prototype.el = '#home-view';

    HomeView.prototype.afterRender = function() {
      var $todo, viewName, _i, _len, _ref, _results;
      $todo = this.$el.find('#todo-app');
      _ref = ['newTodo', 'todos', 'stats'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        viewName = _ref[_i];
        _results.push($todo.append(application["" + viewName + "View"].render().el));
      }
      return _results;
    };

    return HomeView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/new_todo_view": function(exports, require, module) {
    (function() {
  var NewTodoView, View, application, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  application = require('application');

  template = require('./templates/new_todo');

  module.exports = NewTodoView = (function(_super) {

    __extends(NewTodoView, _super);

    function NewTodoView() {
      NewTodoView.__super__.constructor.apply(this, arguments);
    }

    NewTodoView.prototype.template = template;

    NewTodoView.prototype.id = 'new-todo-view';

    NewTodoView.prototype.events = {
      'keypress #new-todo': 'createOnEnter',
      'keyup #new-todo': 'showHint'
    };

    NewTodoView.prototype.newAttributes = function() {
      var attributes;
      attributes = {
        order: application.todos.nextOrder()
      };
      if (this.$('#new-todo').val()) {
        attributes.content = this.$('#new-todo').val();
      }
      return attributes;
    };

    NewTodoView.prototype.createOnEnter = function(event) {
      if (event.keyCode !== 13) return;
      application.todos.create(this.newAttributes());
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

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/stats_view": function(exports, require, module) {
    (function() {
  var StatsView, View, application, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  application = require('application');

  template = require('./templates/stats');

  module.exports = StatsView = (function(_super) {

    __extends(StatsView, _super);

    function StatsView() {
      StatsView.__super__.constructor.apply(this, arguments);
    }

    StatsView.prototype.template = template;

    StatsView.prototype.id = 'stats-view';

    StatsView.prototype.events = {
      'click .todo-clear': 'clearCompleted'
    };

    StatsView.prototype.getRenderData = function() {
      return {
        stats: {
          total: application.todos.length,
          done: application.todos.done().length,
          remaining: application.todos.remaining().length
        }
      };
    };

    StatsView.prototype.clearCompleted = function() {
      return application.todos.clearCompleted();
    };

    return StatsView;

  })(View);

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
  "views/templates/todos": function(exports, require, module) {
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
(this.require.define({
  "views/todo_view": function(exports, require, module) {
    (function() {
  var TodoView, View, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  template = require('./templates/todo');

  module.exports = TodoView = (function(_super) {

    __extends(TodoView, _super);

    function TodoView() {
      this.update = __bind(this.update, this);
      TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.prototype.template = template;

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

    TodoView.prototype.getRenderData = function() {
      return {
        todo: this.model.toJSON()
      };
    };

    TodoView.prototype.afterRender = function() {
      return this.$('.todo-input').bind('blur', this.update);
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
      if (event.keyCode === 13) return this.update();
    };

    TodoView.prototype.remove = function() {
      return this.$el.remove();
    };

    TodoView.prototype.clear = function() {
      return this.model.clear();
    };

    return TodoView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/todos_view": function(exports, require, module) {
    (function() {
  var TodoView, TodosView, View, application, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  TodoView = require('./todo_view');

  application = require('application');

  template = require('./templates/todos');

  module.exports = TodosView = (function(_super) {

    __extends(TodosView, _super);

    function TodosView() {
      this.renderStats = __bind(this.renderStats, this);
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      TodosView.__super__.constructor.apply(this, arguments);
    }

    TodosView.prototype.template = template;

    TodosView.prototype.id = 'todos-view';

    TodosView.prototype.addOne = function(todo) {
      var view;
      view = new TodoView({
        model: todo
      });
      return this.$el.find('#todos').append(view.render().el);
    };

    TodosView.prototype.addAll = function() {
      return application.todos.each(this.addOne);
    };

    TodosView.prototype.initialize = function() {
      application.todos.bind('add', this.addOne);
      application.todos.bind('reset', this.addAll);
      return application.todos.bind('all', this.renderStats);
    };

    TodosView.prototype.renderStats = function() {
      return application.statsView.render();
    };

    return TodosView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/user": function(exports, require, module) {
    (function() {
  var User, View,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('./view');

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/view": function(exports, require, module) {
    (function() {
  var View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      this.render = __bind(this.render, this);
      View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.template = function() {};

    View.prototype.getRenderData = function() {};

    View.prototype.render = function() {
      console.debug("Rendering " + this.constructor.name);
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };

    View.prototype.afterRender = function() {};

    return View;

  })(Backbone.View);

}).call(this);

  }
}));
