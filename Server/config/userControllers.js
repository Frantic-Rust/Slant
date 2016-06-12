var fetch = require('node-fetch');
const mongoDB_API_KEY = 'yjH4qEJR-Olag89IaUTXd06IpuVDZWx1';
const baseLink_users = 'https://api.mlab.com/api/1/databases/frantic-rust/collections/users?apiKey=';
const baseLink_users_query = 'https://api.mlab.com/api/1/databases/frantic-rust/collections/users/';
const baseLink_pictures = 'https://api.mlab.com/api/1/databases/frantic-rust/collections/pictures?apiKey=';
const baseLink_pictures_query = 'https://api.mlab.com/api/1/databases/frantic-rust/collections/pictures/';

var filterResults = (pictures_Array, username, pageName, userID, lastPhoto) => {
    // iterate over pictures to sort based on which page called this function
    // ex: SwipeView will return all pictures whose author is not the user
    // UserPage will return all pictures whose author is the user
    var results = [];
    var type;
    if (pictures_Array.length === 0) {
      return [];
    }

    if (pageName === 'UserPage') {
      type = 1;
    } else if (pageName === 'SwipeView') {
      type = 0;
    }
    // flag turns true when it finds a photo a user has not seen before
    // defaults to true if lastPhoto is set to null
    var flag = lastPhoto ? false : true;
    // will only return unseen photos, this only works if images are displayed in order, not random
    pictures_Array.forEach(picture => {
      if (flag) {
        if (type) {
          if (picture.username === username) {
            results.push(picture);
          }
        } else {
          if (picture.username !== username) {
            results.push(picture);
          }
        }        
      }
      if (picture._id.$oid === lastPhoto) {
        flag = true;
      }
    });
    return results;
};

var getUser = (username, password, res) => {
  fetch(baseLink_users + mongoDB_API_KEY)
    .then((response) => response.json())
      .then((responseData) => {
        var flag = false;
        var id, lastPhoto, name, usernameFetched, passwordFetched, location, age, profileImageLink;
        for (var i = 0; i < responseData.length; i++) {
          if (responseData[i].username === username && responseData[i].password === password) {
            id = responseData[i]._id.$oid;
            name = responseData[i].name;
            usernameFetched = responseData[i].username;
            passwordFetched = responseData[i].password;
            location = responseData[i].location;
            age = responseData[i].age;
            profileImageLink = responseData[i].profileImageLink;
            lastPhoto = responseData[i].lastSwiped;
            flag = true;
            break;
          }
        }
        const returnObj = {
          id: id,
          name: name,
          username: usernameFetched,
          password: passwordFetched,
          location: location,
          age: age,
          profileImageLink: profileImageLink,
          lastPhoto: lastPhoto
        };
        console.log('returnobj', returnObj);
        if (flag) {
          res.status(200).send(returnObj);
        } else {
          res.sendStatus(400);
        }
      });
};


module.exports = {
  // code: 200 = good login, 400 = bad login 
  signin: (req, res) => {
    console.log('Logging in: ', req.body);
    const username = req.body.username;
    const password = req.body.password;
    getUser(username, password, res);
  },

  signup: (req, res) => {
    
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const location = req.body.location;
    const age = req.body.age;
    const profileImageLink = req.body.profileImageLink;
    
    const obj = {
      name: name,
      username: username,
      password: password,
      location: location,
      age: age,
      profileImageLink: profileImageLink
    };
    
    fetch(baseLink_users + mongoDB_API_KEY,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      })
      .then( err => {
        getUser(obj.username, obj.password, res);
      })
      .catch((err) => {
        res.sendStatus(400);
      });
  },

  uploadPhoto: (req, res) => {

    const obj = {
      username: req.body.username,
      comment: req.body.comment,
      imagelink: req.body.imageLink,
      likes: req.body.likes || 0,
      dislikes: req.body.dislikes || 0,
      locationData: req.body.locationData
    };

    console.log(obj);

    fetch(baseLink_pictures + mongoDB_API_KEY,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      })
        .then( err => {
          if (err.status === 200) {
            res.sendStatus(201);
          } else {
            res.sendStatus(400);
          }
        });
  },

  getPhotos: (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const pageName = req.body.pagename;
    const id = req.body.id || null;
    const lastPhoto = req.body.lastPhoto || null;
    fetch(baseLink_pictures + mongoDB_API_KEY)
      .then((response) => response.json())
        .then((responseJSON) => {
          fetch(baseLink_users_query + id + '?apiKey=' + mongoDB_API_KEY)
            .then((response) => response.json())
              .then((responseDataLastSwiped) => responseDataLastSwiped.lastSwiped)//responseDatalastSwiped.lastSwiped || null)
                .then((lastPhoto) => {
                  // top condition is to check if user signed in under test; if so, lastPhoto is not recorded
                  if (!req.body.lastPhoto) {
                    res.status(201).send(filterResults(responseJSON, username, pageName, id, false));
                  } else {
                    res.status(201).send(filterResults(responseJSON, username, pageName, id, lastPhoto));
                  }
                })
              })
        .catch((err) => {
          res.sendStatus(400);
        });
  },

  deletePhoto: (req, res) => {
    fetch(baseLink_pictures_query + req.body.id + '?apiKey=' + mongoDB_API_KEY,
    {
      method: 'DELETE',
      async: true
    }).then((response) => res.send(response));
  },

  vote: (req, res) => {
    const id = req.body._id.$oid;

    const newObj = req.body.type ? {
      username: req.body.username,
      comment: req.body.comment,
      imagelink: req.body.imagelink,
      likes: req.body.likes,
      dislikes: req.body.dislikes + 1
    } : {
      username: req.body.username,
      comment: req.body.comment,
      imagelink: req.body.imagelink,
      likes: req.body.likes + 1,
      dislikes: req.body.dislikes    
    };
    fetch(baseLink_pictures_query + id + '?apiKey=' + mongoDB_API_KEY,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      body: JSON.stringify(newObj)
    })
      .then((response) => response.json())
        .then((responseData) => console.log(responseData));

    fetch(baseLink_users_query + req.body.id + '?apiKey=' + mongoDB_API_KEY,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      body: JSON.stringify( { "$set" : {lastSwiped: id}})
    })
      .then((response) => response.json())
        .then((responseData) => res.send(responseData.lastPhoto));
  },

  updateProfile: (req, res) => {
    const newObj = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      location: req.body.location,
      age: req.body.age,
      profileImageLink: req.body.profileImageLink,
      lastSwiped: req.body.lastPhoto
    };
    fetch(baseLink_users_query + req.body.id + '?apiKey=' + mongoDB_API_KEY, 
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      body: JSON.stringify(newObj)
    }).then((response) => response.json());
  },

  getAllPhotos: (req, res) => {
    fetch(baseLink_pictures + mongoDB_API_KEY)
      .then((response) => response.json())
        .then((responseData) => {
          var results = [];
          responseData.forEach(picture => {
            if (picture.locationData !== undefined) {
              results.push(picture);
            }
          });
          res.status(200).send(results);
        });
  }
};