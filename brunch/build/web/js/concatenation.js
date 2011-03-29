(function() {
  var HomeView, MainController, NewTodoView, StatsView, Todo, TodoView, Todos, TodosView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.app = {};
  app.controllers = {};
  app.models = {};
  app.collections = {};
  app.views = {};
  app.classes = {};
  app.classes.view = {};
  $(document).ready(function() {
    app.initialize = function() {
      app.classes.view.todo = TodoView;
      app.collections.todos = new Todos();
      app.controllers.main = new MainController();
      app.views.home = new HomeView();
      app.views.newTodo = new NewTodoView();
      app.views.todos = new TodosView();
      app.views.stats = new StatsView();
      if (Backbone.history.getFragment() === '') {
        return Backbone.history.saveLocation("home");
      }
    };
    app.initialize();
    return Backbone.history.start();
  });
  Todo = (function() {
    function Todo() {
      Todo.__super__.constructor.apply(this, arguments);
    }
    __extends(Todo, Backbone.Model);
    Todo.prototype.defaults = {
      content: 'empty todo...',
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
  })();
  Todos = (function() {
    function Todos() {
      Todos.__super__.constructor.apply(this, arguments);
    }
    __extends(Todos, Backbone.Collection);
    Todos.prototype.model = Todo;
    Todos.prototype.initialize = function() {
      return this.localStorage = new Store("todos");
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
      if (!this.length) {
        return 1;
      }
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
  })();
  MainController = (function() {
    function MainController() {
      MainController.__super__.constructor.apply(this, arguments);
    }
    __extends(MainController, Backbone.Controller);
    MainController.prototype.routes = {
      "home": "home"
    };
    MainController.prototype.home = function() {
      app.views.home.render();
      return app.collections.todos.fetch();
    };
    return MainController;
  })();
  HomeView = (function() {
    function HomeView() {
      HomeView.__super__.constructor.apply(this, arguments);
    }
    __extends(HomeView, Backbone.View);
    HomeView.prototype.el = '#home-view';
    HomeView.prototype.render = function() {
      this.$(this.el).html(app.templates.home());
      this.$(this.el).find('#todo-app').append(app.views.newTodo.render().el);
      this.$(this.el).find('#todo-app').append(app.views.todos.render().el);
      this.$(this.el).find('#todo-app').append(app.views.stats.render().el);
      return this;
    };
    return HomeView;
  })();
  NewTodoView = (function() {
    function NewTodoView() {
      NewTodoView.__super__.constructor.apply(this, arguments);
    }
    __extends(NewTodoView, Backbone.View);
    NewTodoView.prototype.id = 'new-todo-view';
    NewTodoView.prototype.events = {
      'keypress #new-todo': 'createOnEnter',
      'keyup #new-todo': 'showHint'
    };
    NewTodoView.prototype.render = function() {
      this.$(this.el).html(app.templates.newTodo());
      return this;
    };
    NewTodoView.prototype.newAttributes = function() {
      var attributes;
      attributes = {
        order: app.collections.todos.nextOrder()
      };
      if (this.$("#new-todo").val()) {
        attributes.content = this.$("#new-todo").val();
      }
      return attributes;
    };
    NewTodoView.prototype.createOnEnter = function(event) {
      if (event.keyCode !== $.ui.keyCode.ENTER) {
        return;
      }
      app.collections.todos.create(this.newAttributes());
      return this.$("#new-todo").val('');
    };
    NewTodoView.prototype.showHint = function(event) {
      var fadeIn, input, tooltip;
      tooltip = this.$(".ui-tooltip-top");
      input = this.$("#new-todo");
      tooltip.fadeOut();
      if (this.tooltipTimeout) {
        clearTimeout(this.tooltipTimeout);
      }
      if (input.val() === '' || input.val() === input.attr('placeholder')) {
        return;
      }
      fadeIn = function() {
        return tooltip.fadeIn();
      };
      return this.tooltipTimeout = _.delay(fadeIn, 1000);
    };
    return NewTodoView;
  })();
  StatsView = (function() {
    function StatsView() {
      StatsView.__super__.constructor.apply(this, arguments);
    }
    __extends(StatsView, Backbone.View);
    StatsView.prototype.id = 'stats-view';
    StatsView.prototype.events = {
      'click .todo-clear a': 'clearCompleted'
    };
    StatsView.prototype.render = function() {
      var data;
      data = {
        total: app.collections.todos.length,
        done: app.collections.todos.done().length,
        remaining: app.collections.todos.remaining().length
      };
      this.$(this.el).html(app.templates.stats({
        stats: data
      }));
      return this;
    };
    StatsView.prototype.clearCompleted = function() {
      return app.collections.todos.clearCompleted();
    };
    return StatsView;
  })();
  TodoView = (function() {
    function TodoView() {
      this.update = __bind(this.update, this);;
      this.render = __bind(this.render, this);;      TodoView.__super__.constructor.apply(this, arguments);
    }
    __extends(TodoView, Backbone.View);
    TodoView.prototype.tagName = "li";
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
      this.$(this.el).html(app.templates.todo({
        todo: this.model.toJSON()
      }));
      this.$('.todo-input').bind('blur', this.update);
      return this;
    };
    TodoView.prototype.toggleDone = function() {
      return this.model.toggle();
    };
    TodoView.prototype.edit = function() {
      this.$(this.el).addClass("editing");
      return $('.todo-input').focus();
    };
    TodoView.prototype.update = function() {
      this.model.save({
        content: this.$('.todo-input').val()
      });
      return this.$(this.el).removeClass("editing");
    };
    TodoView.prototype.updateOnEnter = function(e) {
      if (e.keyCode === $.ui.keyCode.ENTER) {
        return this.update();
      }
    };
    TodoView.prototype.remove = function() {
      return $(this.el).remove();
    };
    TodoView.prototype.clear = function() {
      return this.model.clear();
    };
    return TodoView;
  })();
  TodosView = (function() {
    function TodosView() {
      this.renderStats = __bind(this.renderStats, this);;
      this.addAll = __bind(this.addAll, this);;
      this.addOne = __bind(this.addOne, this);;      TodosView.__super__.constructor.apply(this, arguments);
    }
    __extends(TodosView, Backbone.View);
    TodosView.prototype.id = 'todos-view';
    TodosView.prototype.initialize = function() {
      app.collections.todos.bind('add', this.addOne);
      app.collections.todos.bind('refresh', this.addAll);
      return app.collections.todos.bind('all', this.renderStats);
    };
    TodosView.prototype.render = function() {
      $(this.el).html(app.templates.todos());
      return this;
    };
    TodosView.prototype.addOne = function(todo) {
      var view;
      view = new TodoView({
        model: todo
      });
      return $(this.el).find("#todos").append(view.render().el);
    };
    TodosView.prototype.addAll = function() {
      return app.collections.todos.each(this.addOne);
    };
    TodosView.prototype.renderStats = function() {
      return app.views.stats.render();
    };
    return TodosView;
  })();
}).call(this);
