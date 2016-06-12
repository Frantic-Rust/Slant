"use strict";

import React, {
  Component,
} from 'react';

import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions
} from 'react-native';

console.disableYellowBox = true;

// import UserPage from './UserPage.ios.js'
// import CameraView from './CameraView.ios.js'
// import SignupView from './SignupView.ios.js'
import MainView from './MainView.ios.js' 

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height; 

class LoginView extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            navigator: props.navigator,
            username: "",
            password: "",
            user: ""
        };
    }
 
    render() {
        return (
            <View >
                <Image source={require('./images/background4.png')} style={styles.backgroundImage}>
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <TouchableHighlight onPress={this.redirectHome.bind(this)} underlayColor='transparent'>
                                <Image source={require('./images/slant2.png')} style={styles.logo} />
                            </TouchableHighlight>
                        </View>
                        <View style={styles.inputs}>
                            <View>
                                <TextInput
                                    autoCapitalize="words"
                                    placeholder="Username"
                                    onChange={(event) => this.setState({username: event.nativeEvent.text})}
                                    style={styles.formInput}
                                    value={this.state.username} />
                            </View>
                            <View>
                                <TextInput
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    onChange={(event) => this.setState({password: event.nativeEvent.text})}
                                    style={styles.formInput}
                                    value={this.state.password} />
                            </View>
                            <TouchableHighlight onPress={(this.onSubmitPressed.bind(this))} style={styles.button}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }

    redirectHome() {
        this.state.navigator.popToTop();
    }
 
    onSubmitPressed() {
        const account = {
            username: this.state.username,
            password: this.state.password
        };
        
        // if they did not enter a password or username, error them out
        if (account.password.length|| account.password.length) {
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
                        title: "main.me",
                        component: MainView,
                        // now passes id, id = to id in table for fast look up later
                        passProps: { user: this.state.user, username: this.state.username, password: this.state.password, id: JSON.parse(err._bodyText).id, lastPhoto: JSON.parse(err._bodyText).lastPhoto},
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
        } else {
            this.setState({
                        username: "",
                        password: ""
                    });
            console.warn('Invalid Login');
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
        // padding: 10,
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
        fontSize: 18,
        color: "#ffffff",
        alignSelf: "center",
        fontFamily: 'Avenir'
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover'
    }
});
 
module.exports = LoginView;
