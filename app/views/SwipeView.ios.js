import React, { Component } from 'react';

import {
  AlertIOS,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Tinder from '../lib/Tinder.js';
import LoadingView from './LoadingView.ios.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import NewUserInstructionModal from './NewUserInstructionModal.ios.js';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class SwipeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      id: props.id,
      lastPhoto: props.lastPhoto,
      navigator: props.navigator,
      loaded: true
    };
  }

  renderLoadingView() {
    return (
      <View>
        <LoadingView />
      </View>
    );
  }

  refreshPage() {
    this.setState({loaded: false});
    setTimeout(() => {
      this.setState({loaded: true})
    }, 0);
    // AlertIOS.alert('Currently unimplemented');
  }
  
  goToSettings() {
    this.state.navigator.popToTop();
  }

  render() {
     if (!this.state.loaded) {
      return this.renderLoadingView();
    } else { 
    return (
      <View style={styles.mainContainer}>
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
              <NewUserInstructionModal style={styles.info} header={'Swiping Page'} content={'\nGive your opinion on other users\' outfits by swiping right (buy!) or left (put it back!).\n\nYou will view each picture once and will repopulate as more photos are taken.'}/>
            </View>
            <View style={styles.refresh}>
            <TouchableHighlight onPress={this.refreshPage.bind(this)} underlayColor='transparent'>
              <Icon name="refresh" size={23} color="#fff" />
            </TouchableHighlight>
            </View>
          </View>
        </View>
        <Tinder username={this.state.username} id={this.state.id} lastPhoto={this.state.lastPhoto} style={{flex: 1}} />
      </View>
    )}
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: deviceWidth/20,
    flexDirection: 'row'
  },
  navTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    fontFamily: 'Avenir'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover'
  },
  refresh: {
    width: deviceWidth/4,
    // borderWidth: 0.5,
    // borderColor: '#555555',
    alignItems: 'flex-end',
    paddingRight: deviceWidth/20,
  },
  info: {
    justifyContent: 'center',
  }
});

module.exports = SwipeView;
