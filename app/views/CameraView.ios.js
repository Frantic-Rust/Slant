"use strict";

import React, {
  Component,
} from 'react';

import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';

import UserPageObj from './UserPage.ios.js';
var UserPage = UserPageObj.UserPage;

import Camera from 'react-native-camera';
import ViewPage from './ImageView.ios.js';
import NewUserInstructionModal from './NewUserInstructionModal.ios.js';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var icons = {
  home: 'http://summer.newark.rutgers.edu/wp-content/uploads/2015/02/homeicon.png',
  camera: 'http://aspenwillows.com/wp-content/uploads/2015/03/cameraicon.png',
  swipe: 'https://www.one.org/wp-content/plugins/ebola-tracker/images/swipe_icon.png'
}

class CameraView extends Component {
  constructor(props) {
      super(props);
      this.state = {
        user: props.user,
        username: props.username,
        password: props.password,
        id: props.id, 
        lastPhoto: props.lastPhoto,
        type: Camera.constants.Type.back,
        flag: true
      }
  }
  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          captureTarget={Camera.constants.CaptureTarget.disk}
          aspect={Camera.constants.Aspect.fill}
          orientation={Camera.constants.Orientation.portrait}
          type = {this.state.type}
          >
          <View style={styles.info}>
            <NewUserInstructionModal header={'Camera Page'} content={'\nTake a photo of an outfit you are considering buying!\n\nTap the button on the top right corner will flip the camera to selfie-mode and vice-versa.\n\nOnce a photo is taken, you will have a chance to add a comment and submit or delete and retake a photo!\n\nThe community will weigh in their thoughts in the swipe page.'}/>
          </View>
          <TouchableHighlight style={styles.switchCam} onPress={this.switchCamType.bind(this)} underlayColor='transparent'>
            <Image style = {{height:40, width: 40, marginLeft: 40}} source={require('./images/switch_camera_type.png')}/>
          </TouchableHighlight>
          <View style={styles.buttons}>
            <TouchableHighlight onPress={this.takePicture.bind(this)} style={styles.capture} underlayColor='transparent'>
              <Image style = {{height: deviceWidth/6, width: deviceWidth/5.5}} source={require('./images/camera_icon3.png')}/>
            </TouchableHighlight>
          </View>
        </Camera>
      </View>
    );
  }

  goImageViewPage() {
    this.props.navigator.push({
      title: "verify.me",
      component: ViewPage,
      passProps: {user: this.state.user, username: this.state.username, password: this.state.password, image: this.state.image, id: this.state.id, lastPhoto: this.state.lastPhoto},
    })
  }

  switchCamType() {
    if (this.state.flag) {
      this.setState({
        type: Camera.constants.Type.front,
        flag: false
      });
    } else {
     this.setState({
        type: Camera.constants.Type.back,
        flag: true
      });        
    }
  }

  takePicture() {
    this.camera.capture()
      .then((data) => this.setState({image: data}))
      .catch(err => console.error(err))
      .then(() => this.goImageViewPage());
  }
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  switchCam: {
    left: deviceWidth/3, 
    top: -deviceHeight/1.4,
  },
  capture: {
    marginBottom: deviceHeight/10
  },
  buttons: {
    flexDirection: 'row'
  },
  swipe: {
    paddingRight: deviceWidth/5,
    paddingTop: deviceHeight/15
  },
  home: {
    paddingLeft: deviceWidth/5,
    paddingTop: deviceHeight/15
  },
  info: {
    right: deviceWidth/2.2, 
    top: -deviceHeight/1.48,
  }
});
 
module.exports = CameraView;
