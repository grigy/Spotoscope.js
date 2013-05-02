$(function() {

  Parse.initialize("81nQtGIwTXAzDf6g4UfUsOZOzNd9DJ4ViDCwEw9Q", 
                   "uaGrVXt1LKQ2Meck9HmvIGKxczPjFAYf78vgLkrJ");

  var Spot = Parse.Object.extend("Spots", {
    defaults: {
      name: ""
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
           var template = _.template($('#spot-list-template').html(), {spots: spots.models});
          that.$el.html(template);
        }
      })
    }
  });

  var EditSpot = Parse.View.extend({
    el: '.content',
    render: function() {
      this.$el.html('Show edit spot');
    }
  });

  var spotList = new SpotList;
  var editSpot = new EditSpot;

  var Router = Parse.Router.extend({
    routes: {
      '': 'home',
      'new': 'edit'
    },
    home: function() {
      spotList.render();
    },
    edit: function() {
      editSpot.render();
    }
  });
  new Router;

  Parse.history.start();

});
