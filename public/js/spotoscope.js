$(function() {

  Parse.initialize("81nQtGIwTXAzDf6g4UfUsOZOzNd9DJ4ViDCwEw9Q", 
                   "uaGrVXt1LKQ2Meck9HmvIGKxczPjFAYf78vgLkrJ");

  var Spot = Parse.Object.extend("Spots", {
    defaults: {
      name: '',
      description: ''
    }
  });

  var Spots = Parse.Collection.extend({
    model: Spot
  });

  var SpotList = Parse.View.extend({
    el: '.content',
    render: function() {
      var that = this;
      var spots = new Spots;
      spots.query = new Parse.Query(Spot);
      spots.fetch({
        success: function (spots) {
          var template = _.template($('#spot-list-template').html(), 
            {spots: spots.models});
          that.$el.html(template);
        }
      })
    },
    events: {
      'click .logout': 'logOut'
    },
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },
  });

  var EditSpot = Parse.View.extend({
    el: '.content',
    initialize: function() {
      this.spots = new Spots;
    },
    render: function(options) {
      if (options.id) {
        var that = this;
        that.spot = new Spot({id: options.id});
        that.spot.fetch({
          success: function(spot) {
            var template = _.template($('#edit-spot-template').html(), {spot: spot});
            that.$el.html(template);
          }
        })
      } else {
        var template = _.template($('#edit-spot-template').html(), {spot: null});
        this.$el.html(template);
      }
    },
    events: {
      'submit .edit-spot-form': 'saveSpot',
      'click .delete': 'deleteSpot',
      'click .cancel': 'cancel'
    },
    uploadImage: function(spot) {
      var serverUrl = 'https://api.parse.com/1/files/' + window.file.name;
      $.ajax({
        type: "POST",
        beforeSend: function(request) {
          request.setRequestHeader("X-Parse-Application-Id", '81nQtGIwTXAzDf6g4UfUsOZOzNd9DJ4ViDCwEw9Q');
          request.setRequestHeader("X-Parse-REST-API-Key", 'mMxyGIWKUcomhkccJ7w7V33W0JuuJxX9sFbuxOam');
          request.setRequestHeader("Content-Type", file.type);
        },
        url: serverUrl,
        data: window.file,
        processData: false,
        contentType: false,
        success: function(data) {
          //alert("File available at: " + data.url);
          spot.set('imageUrl', data.url);
          spot.save();
        },
        error: function(data) {
          var obj = jQuery.parseJSON(data);
          alert(obj.error);
        }
      });      
    },    
    saveSpot: function(ev) {
      var that = this;
      var spot = new Spot;
      spot.set('name',        this.$('.name').val());
      spot.set('description', this.$('.description').val());
      spot.set('id', this.$('.id').val());
      spot.save(null, {
        success: function(spot) {
          that.uploadImage(spot);
          router.navigate('', {trigger: true});
        },
        error: function(spot) {
          console.log('error creating new spot');
        }
      });
      return false;
    },
    deleteSpot: function(ev) {
      this.spot.destroy({
        success: function() {
          router.navigate('', {trigger: true});
        }
      })
      return false;
    },
    cancel: function(ev) {
      router.navigate('', {trigger: true});
    }
  });

  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    el: ".content",

    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();

      Parse.User.logIn(username, password, {
        success: function(user) {
          spotList.render()
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("<button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>Invalid username or password. Please try again.").show();
          this.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();

      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
          spotList.render()
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".signup-form .error").html(error.message).show();
          this.$(".signup-form button").removeAttr("disabled");
        }
      });

      this.$(".signup-form button").attr("disabled", "disabled");

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });


  var spotList = new SpotList;
  var editSpot = new EditSpot;

  var Router = Parse.Router.extend({
    routes: {
      '': 'home',
      'new': 'new',
      'edit/:id': 'edit'
    },
    home: function() {
      if (Parse.User.current()) {
        spotList.render();
      } else {
        new LogInView();
      }
    },
    new: function() {
      editSpot.render({});
    },
    edit: function(id) {
      editSpot.render({id: id});
    }
  });

  var router = new Router;

  Parse.history.start();

});
