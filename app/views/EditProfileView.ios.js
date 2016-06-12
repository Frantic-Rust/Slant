"use strict";

import React, {
  Component,
} from 'react';

import {
  AlertIOS,
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;  

class EditProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigator: props.navigator,
      user: props.user
    };
  }
  render() {
    return (
      <View>
        <Image source={require('./images/background4.png')} style={styles.backgroundImage}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <TouchableHighlight underlayColor='transparent' onPress={this.goBackToUserPage.bind(this)}>
                <Image source={require('./images/slant2.png')} style={styles.logo} />
                </TouchableHighlight>
            </View>
            <View style={styles.inputs}>
              <View>
              <TextInput
                autoCapitalize="words"
                placeholder="Name"
                onChange={(event) => this.setState({name: event.nativeEvent.text})}
                style={styles.formInput}
                value={this.state.name} 
              />
              </View>
              <View>
                <TextInput
                  placeholder="New Password"
                  secureTextEntry={true}
                  onChange={(event) => this.setState({password: event.nativeEvent.text})}
                  style={styles.formInput}
                  value={this.state.password} 
                />
              </View>
              <View>
                <TextInput
                  autoCapitalize="words"
                  placeholder="Location"
                  onChange={(event) => this.setState({location: event.nativeEvent.text})}
                  style={styles.formInput}
                  value={this.state.location} 
                />
              </View>
              <TouchableHighlight onPress={(this.saveThenGoBackToUserPage.bind(this))} style={styles.button}>
                <Text style={styles.buttonText}>Make Changes</Text>
                </TouchableHighlight>
            </View>
          </View>
        </Image>
      </View>
    );
  }
  goBackToUserPage() {
    this.state.navigator.pop();
  }
  saveThenGoBackToUserPage() {
    if (this.state.user.username === 'jjones') {
      AlertIOS.alert("Cannot modify the testing account");
      this.goBackToUserPage();
    } else {
      const account = {
        id: this.state.user.id,
        name: this.state.name || this.state.user.name,
        username: this.state.user.username,
        password: this.state.password || this.state.user.password,
        location: this.state.location || this.state.user.location,
        age: this.state.user.age,
        profileImageLink: this.state.user.profileImageLink,
        lastPhoto: this.state.user.lastPhoto
      };    
      fetch('http://104.236.188.210:8000/updateProfile', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account)
      });
      AlertIOS.alert("Profile modified. Re-Login.");
      this.state.navigator.popToTop();
    }
  }
};
 
var styles = StyleSheet.create({
  container: {
    marginTop: deviceHeight/4.5,
  },
  logo: {
      height: deviceHeight/7,
      width: deviceWidth/1.5,
      marginBottom: deviceHeight/35
      // borderWidth: 0.5,
      // borderColor: "#555555",
  },
  logoContainer: {
    width: deviceWidth,
    alignItems: 'center'
  },
  inputs: {
    width: deviceWidth,
    alignItems: 'center'
  },
  formInput: {
    width: deviceWidth/2,
    height: deviceHeight/20,
    paddingLeft: deviceWidth/40,
    paddingRight: deviceWidth/40,
    marginRight: 5,
    marginBottom: 5,
    marginTop: 5,
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: "#555555",
    borderRadius: 8,
    backgroundColor: 'white'
  },
  button: {
    width: deviceWidth/2,
    height: deviceHeight/20,
    flex: 1,
    backgroundColor: "#555555",
    borderColor: "#555555",
    borderWidth: 0.5,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    alignSelf: "center",
    fontFamily: 'Avenir'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover'
  },
});
 
module.exports = EditProfileView;
