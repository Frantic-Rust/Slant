"use strict";
 
 import React, {
  Component,
} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native';

import UserPage from './app/views/UserPage.ios.js';
import LoginView from './app/views/LoginView.ios.js';
import CameraView from './app/views/CameraView.ios.js';
import HomeView from './app/views/HomeView.ios.js';
import LoadingView from './app/views/LoadingView.ios.js';
import MainView from './app/views/MainView.ios.js';
import MapViewPage from './app/views/MapView.ios.js';
 
class FranticRust extends Component {
  render() {
      return (
          <NavigatorIOS
              style={styles.navigationContainer}
              navigationBarHidden={true}
              initialRoute={{
              title: 'home.me',
              component: HomeView,
              }}/>
      );
  }
}

var styles = StyleSheet.create({
    navigationContainer: {
        flex: 1
    }
});
 

AppRegistry.registerComponent('FranticRust', () => FranticRust);
