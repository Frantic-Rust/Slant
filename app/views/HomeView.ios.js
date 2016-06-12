"use strict";

import React, {
  Component,
} from 'react';

import {
  AlertIOS,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions,
  NavigatorIOS
} from 'react-native';

console.disableYellowBox = true;
 
import Icon from 'react-native-vector-icons/FontAwesome';
 
// import CameraView from './CameraView.ios.js'
import SignupView from './SignupView.ios.js'
import LoginView from './LoginView.ios.js'
import MainView from './MainView.ios.js' 

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height; 

class HomeView extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    renderMainView(res) {
        return (
          <NavigatorIOS
            style={styles.testMode}
            initialRoute={{
                title: "MainView",
                component: MainView,
                // now passes id, id = to id in table for fast look up later
                passProps: { user: this.state.user, username: this.state.username, password: this.state.password, id: JSON.parse(res._bodyText).id, lastPhoto: JSON.parse(res._bodyText).lastPhoto},
            }} />
        )
    }
 
    render() {
        return (
            <View >
                <Image source={require('./images/background4.png')} style={styles.backgroundImage}>
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <Image source={require('./images/slant2.png')} style={styles.logo} />
                        </View>
                        <View style={styles.inputs}>
                            <TouchableHighlight onPress={(this.redirectToLogin.bind(this))} style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={(this.redirectToSignup.bind(this))} style={styles.button}>
                                <Text style={styles.buttonText}>Create Account</Text>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={(this.redirectToCamera.bind(this))} style={styles.button}>
                                <Text style={styles.buttonText}>Test Mode</Text>
                            </TouchableHighlight>
                            <View style={styles.facebookContainer}>
                                <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={this.loginWithFacebook}>
                                  Login with Facebook
                                </Icon.Button>
                            </View>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }
 
    loginWithFacebook() {
      AlertIOS.alert('This feature has not been implemented yet!');
    }

    redirectToSignup() {
      this.props.navigator.push({
        title: "signup.me",
        component: SignupView,
        passProps: {username: this.state.username, password: this.state.password, image: this.state.image}
      })
    }

    redirectToLogin() {
      this.props.navigator.push({
        title: "login.me",
        component: LoginView,
        passProps: {username: this.state.username, password: this.state.password, image: this.state.image}
      })
    }

    redirectToCamera() {

        const account = {
            username: 'jjones',
            password: 'jjones'
        };
        
        fetch('http://104.236.188.210:8000/signin',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(account)
        })
        .then((err) => {
            if (err.status === 200) {
                this.setState({ user: JSON.parse(err._bodyText) });
                this.props.navigator.push({
                    title: "MainView",
                    component: MainView,
                    // now passes id, id = to id in table for fast look up later
                    passProps: { user: this.state.user, username: account.username, password: this.state.password, id: JSON.parse(err._bodyText).id, lastPhoto: false},
                }); 
                // console.warn('Valid Login');
            } else {
                this.setState({
                    username: "",
                    password: ""
                });
                console.warn('Invalid Login');
            }
        });
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
    button: {
        width: deviceWidth/2,
        height: deviceHeight/17,
        flex: 1,
        backgroundColor: "#555555",
        borderColor: "#555555",
        borderWidth: 0.5,
        borderRadius: 8,
        marginTop: 10,
        justifyContent: "center"
    },
    buttonText: {
        fontSize: 18,
        color: "#ffffff",
        alignSelf: "center",
        // fontWeight:'bold',
        fontFamily: 'Avenir'
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover'
    },
    testMode: {
        height: deviceHeight,
        width: deviceWidth
    },
    facebookContainer: {
        marginTop: 10
    }
});
 
module.exports = HomeView;