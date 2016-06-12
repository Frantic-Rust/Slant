import React, {
  Component,
} from 'react';

import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NavigatorIOS,
  TabBarIOS
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import SwipeView from './SwipeView.ios.js'
import CameraView from './CameraView.ios.js';
import UserPage from './UserPage.ios.js';
import MapViewPage from './MapView.ios.js';

var key_file = require('../../config.js');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class MainView extends Component {  
  constructor(props) {
  	super(props)
  	this.state = {
      user: props.user,
      username: props.username,
      password: props.password,
      id: props.id, 
      lastPhoto: props.lastPhoto || false,
      userLocation: {},
      locationDataArray: [],
  		selectedTab: 'camera'
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
     fetch('http://104.236.188.210:8000/getAllPhotos')
       .then((response) => response.json())
         .then((responseData) => this.setState({locationDataArray: responseData}));
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

  render() {
    return (
      <TabBarIOS>
        <Icon.TabBarItem
          title='Home'
          selected={this.state.selectedTab === 'home'}
          iconName={'home'}
          iconSize={25}
          onPress={() => {
              this.setState({
                selectedTab: 'home'
              });
          }}>
          {this.renderSwipeView()}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Camera"
          selected={this.state.selectedTab === 'camera'}
          iconName={'camera'}
          iconSize={20}
          onPress={() => {
              this.setState({
                selectedTab: 'camera'
              });
          }}>
          {this.renderCameraView()}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Map"
          selected={this.state.selectedTab === 'map'}
          iconName={'map'}
          iconSize={20}
          onPress={() => {
              this.setState({
                selectedTab: 'map'
              });
          }}>
          {this.renderMapPage()}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Profile"
          selected={this.state.selectedTab === 'user'}
          iconName={'user'}
          iconSize={20}
          onPress={() => {
              this.setState({
                selectedTab: 'user'
              });
          }}>
          {this.renderUserPage()}
        </Icon.TabBarItem>
      </TabBarIOS>
      )
  }

  renderSwipeView() {
    return (
      <SwipeView
        style={styles.container}
        ref='swipeRef'
        user={this.state.user}
        username={this.state.username}
        password={this.state.password}
        id={this.state.id} 
        lastPhoto={this.state.lastPhoto}
        navigator={this.props.navigator}/>
        )
  }

  renderCameraView() {
    return (
      <CameraView
        style={styles.container}
        ref='cameraRef'         
        user={this.state.user}
        username={this.state.username}
        password={this.state.password}
        id={this.state.id} 
        lastPhoto={this.state.lastPhoto}
        navigator={this.props.navigator}/>
        )
  }

  renderMapPage() {
    return (
      <MapViewPage
        style={styles.container}
        ref='mapRef'         
        user={this.state.user}
        username={this.state.username}
        password={this.state.password}
        id={this.state.id} 
        lastPhoto={this.state.lastPhoto}
        userLocation={this.state.userLocation}
        locationDataArray={this.state.locationDataArray}
        navigator={this.props.navigator}/>
        )
  }

  renderUserPage() {
    return (
      <UserPage
        style={styles.container}
        ref='userRef'         
        user={this.state.user}
        username={this.state.username}
        password={this.state.password}
        id={this.state.id} 
        lastPhoto={this.state.lastPhoto}
        navigator={this.props.navigator}/>
        )
  }
}

var styles = StyleSheet.create({
	container: {
		height: deviceHeight,
		width: deviceWidth
	}
});
module.exports = MainView;