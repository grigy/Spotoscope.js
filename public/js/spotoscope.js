$(function() {

  Parse.initialize("81nQtGIwTXAzDf6g4UfUsOZOzNd9DJ4ViDCwEw9Q", 
                   "uaGrVXt1LKQ2Meck9HmvIGKxczPjFAYf78vgLkrJ");

  var Router = Backbone.Router.extend({
    routes: {
      '': 'home'
    }
  });
  var router = Router();
  router.on('route:home', function() {
    console.log('Home page');
  });
  Backbone.history.start();

});
