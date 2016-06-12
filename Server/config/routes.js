var controller = require('./userControllers.js');

module.exports = function (app, express) {

  app.post('/signup', controller.signup);
  app.post('/signin', controller.signin);
  app.post('/upload', controller.uploadPhoto);
  app.post('/getPhotos', controller.getPhotos);
  app.post('/vote', controller.vote);
  app.post('/deletePhoto', controller.deletePhoto);
  app.post('/updateProfile', controller.updateProfile);
  app.get('/getAllPhotos', controller.getAllPhotos);
};
