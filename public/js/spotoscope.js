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
    }
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
    saveSpot: function(ev) {
      var spot = new Spot;
      spot.set('name',        this.$('.name').val());
      spot.set('description', this.$('.description').val());
      spot.set('id', this.$('.id').val());
      spot.save(null, {
        success: function(spot) {
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

  var spotList = new SpotList;
  var editSpot = new EditSpot;

  var Router = Parse.Router.extend({
    routes: {
      '': 'home',
      'new': 'new',
      'edit/:id': 'edit'
    },
    home: function() {
      spotList.render();
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
