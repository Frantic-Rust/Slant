"use strict";

import React, {
  Component,
} from 'react';

import {
  AlertIOS,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import { RNS3 } from 'react-native-aws3';
import SwipeCards from '../lib/SwipeCards.js';
import CameraView from './CameraView.ios.js';
import NewUserInstructionModal from './NewUserInstructionModal.ios.js';
import Icon from 'react-native-vector-icons/FontAwesome';


var key_file = require('../../config.js');
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Card extends Component {
  render() {
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{uri: this.props.imageLink}} />
        <TouchableHighlight onPress={this.props.commentBox.bind(this)}>
          <Text style={styles.text}>{this.props.comment}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

class NoMoreCards extends Component {
  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>Go Back to Camera</Text>
      </View>
    )
  }
}

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [props.image],
      outOfCards: false,
    }
  }

  handleYup (card) {
    console.log("yup")
  }

  handleNope (card) {
    console.log("nope")
  }

  render() {
    return (
      <SwipeCards
        cards={this.state.cards}
        loop={false}

        renderCard={(cardData) => <Card {...cardData} commentBox={this.props.commentBox.bind(this)}/>}
        renderNoMoreCards={() => <NoMoreCards />}
        showYup={true}
        showNope={true}

        handleYup={this.handleYup}
        handleNope={this.handleNope}/>
    )
  }
}

class ImageView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: props.username || '',
      password: props.password || '',
      image: props.image,
      comment: 'How does it look?',
      userLocation: {},
      navigator: props.navigator
    }
  }
 
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var userGPS = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude        
      };
      this.reverseGeoCoding(userGPS);
    });
  }

  reverseGeoCoding(userGPS) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + userGPS.latitude + ',' + userGPS.longitude + '&key=' + key_file.GOOGLEMAP_API_KEY)
    .then((response) => response.json())
    .then((responseData) => {
      userGPS.neighborhood = responseData.results[0].address_components[2].long_name;
      var address = responseData.results[0].address_components[0].short_name + " " + responseData.results[0].address_components[1].short_name + ", " + responseData.results[0].address_components[3].short_name;
      userGPS.title = 'Hack Reactor';
      userGPS.subTitle = address; 
      this.setState({
        userLocation: userGPS
      });
    });
  }

  commentBox() {
    AlertIOS.prompt(
      'Photo Comment',
      'Link a comment to this photo',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: comment => {
          this.setState({comment: comment});
        }},
      ]
    );
  }

  getCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  submitPhoto() {
    if (this.state.username === 'jjones') {
      AlertIOS.alert('Photos cannot be saved in test mode! Please login to save photos!');
    } else {
      const photo = {
        image: this.state.image.path,
        filename: this.getCode() + '.png'
      };
      const file = {
        uri: photo.image,
        name: photo.filename,
        type: "image/png"
      };
      
      const options = {
        keyPrefix: "uploads/",
        bucket: "franticrust",
        region: "us-west-1",
        accessKey: key_file.S3_ACCESS_KEY, 
        secretKey: key_file.S3_SECRET_KEY,
        successActionStatus: 201
      };

      RNS3.put(file, options).then(response => {
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      });

      const photoObj = {
        username: this.state.username,
        comment: this.state.comment,
        imageLink: 'https://franticrust.s3-us-west-1.amazonaws.com/uploads%2F' + photo.filename,
        locationData: this.state.userLocation
      };
      
      fetch('http://104.236.188.210:8000/upload', 
        {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(photoObj)
        });
      AlertIOS.alert('Photo is now Live');
    }
    this.goBackToCamera();
  }

  goBackToCamera() {
    this.state.navigator.pop();
  }
  goToSettings() {
    this.state.navigator.popToTop();

  }
  refreshPage() {

  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.navbarContainer}>
          <View style={styles.navLeft}>
            <TouchableHighlight onPress={this.goToSettings.bind(this)} underlayColor='transparent'>
              <Icon name="sign-out" size={25} color="#fff" />
            </TouchableHighlight>
          </View>
          <View style={styles.navMiddle}>
            <Text style={styles.navTitle}>Slant</Text>
          </View>
          <View style={styles.navRight}>
            <View>
              <NewUserInstructionModal header={'Photo Verification Page'} content={'\nConfirm if you would like to submit your new photo!\n\nAdd a comment by tapping on the text below your photo; a comment will be displayed when given to the community to judge.\n\nTap on the heart icon to upload the photo or the X icon to go back to the camera.\n\nFun Fact: the picture is swipable!'}/>
            </View>
            <View style={styles.refresh}>
            <TouchableHighlight onPress={this.refreshPage.bind(this)} underlayColor='transparent'>
              <Icon name="refresh" size={23} color="#fff" />
            </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={styles.info}>
         
        </View>
        <Cards image={{imageLink: this.state.image.path, comment: '• How does it look? •'}} commentBox={this.commentBox.bind(this)} submitPhoto={this.submitPhoto.bind(this)} />
        <View style={styles.buttonsContainer}>
          <View style={styles.button}>
            <TouchableHighlight onPress={this.goBackToCamera.bind(this)} underlayColor='transparent'>
              <Image source={require('./images/reject.png')} style={styles.accept} />
            </TouchableHighlight>
          </View>
          <View style={styles.button}>
            <TouchableHighlight onPress={this.submitPhoto.bind(this)} underlayColor='transparent'>
              <Image source={require('./images/accept.png')} style={styles.accept} />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: deviceHeight/10
  },
  navbarContainer: {
    // borderWidth: 0.5,
    // borderColor: '#555555',
    backgroundColor:'#FF562E',
    paddingTop: deviceHeight/25,
    height: deviceHeight/12,
    flexDirection: 'row',
    paddingBottom: deviceHeight/80
  },
  navLeft: {
    width: deviceWidth/3,
    // borderWidth: 0.5,
    // borderColor: '#555555',
    justifyContent: 'center',
    paddingLeft: deviceWidth/20
  },
  navMiddle: {
    width: deviceWidth/3,
    // borderWidth: 0.5,
    // borderColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navRight: {
    width: deviceWidth/3,
    // borderWidth: 0.5,
    // borderColor: '#555555',
    // alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: deviceWidth/20,
    flexDirection: 'row',
  },
  navTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    fontFamily: 'Avenir'
  },
  refresh: {
    width: deviceWidth/4,
    // borderWidth: 0.5,
    // borderColor: '#555555',
    alignItems: 'flex-end',
    paddingRight: deviceWidth/20,
  },
  accept: {
    width: deviceWidth /6,
    height: deviceWidth/6,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: deviceWidth,
    height: deviceHeight/6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: deviceWidth/2.2,
    height: deviceHeight/6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    // marginTop: 50,
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    // elevation: 1,
  },
  thumbnail: {
    flex: 1,
    width: deviceWidth / 1.1,
    height: deviceHeight / 1.5,
  },
  text: {
    fontSize: 20,
    paddingTop: deviceWidth/80,
    paddingBottom: deviceWidth/80,
    fontFamily: 'Baskerville'
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
    info: {
    right: deviceWidth/2.2, 
    top: -deviceHeight/1.48,
  }
});

module.exports = ImageView;