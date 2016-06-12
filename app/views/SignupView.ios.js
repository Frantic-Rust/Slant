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
  Dimensions,
  Slider,
  Switch
} from 'react-native';
console.disableYellowBox = true;

import UserPage from './UserPage.ios.js'
import CameraView from './CameraView.ios.js'
import MainView from './MainView.ios.js'

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;  

class SignupView extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            navigator: props.navigator,
            name: "",
            username: "",
            password: "",
            location:"",
            age: 0,
            sex: 'Male',
            user: "",
            value: 0,
            falseSwitchIsOn: false,
            trueSwitchIsOn: true,
        };
    }

    bool(val) {
        if (val) {
            this.setState({sex: 'Female'});
        } else {
            this.setState({sex: 'Male'});
        }
    }
 
    render() {
        return (
            <View>
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
                                    placeholder="Name"
                                    onChange={(event) => this.setState({name: event.nativeEvent.text})}
                                    style={styles.formInput}
                                    value={this.state.name} />
                            </View>
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
                            <View>
                                <TextInput
                                    autoCapitalize="words"
                                    placeholder="Location"
                                    onChange={(event) => this.setState({location: event.nativeEvent.text})}
                                    style={styles.formInput}
                                    value={this.state.location} />
                            </View>
                            <View style={styles.ageSection}>
                                <View style={styles.ageItems}>
                                    <Slider 
                                        onValueChange={(value) => this.setState({age: value})} 
                                        style={styles.slider}
                                        minimumValue={0}
                                        maximumValue={99}
                                        step={1}
                                    />
                                </View>
                                <View style={styles.ageItems}>
                                    <TouchableHighlight style={styles.ageButton}>
                                        <Text style={styles.buttonText}>Age: {this.state.age}</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <View style={styles.sexSection}>
                                <View style={styles.sexToggle}>
                                    <Switch
                                      onValueChange={(value) => {
                                        this.bool(value);
                                        this.setState({falseSwitchIsOn: value});
                                        }}
                                      value={this.state.falseSwitchIsOn} />
                                </View>
                                <View style={styles.sexDisplay}>
                                    <TouchableHighlight style={styles.sexButton}>
                                        <Text style={styles.buttonText}>Sex: {this.state.sex}</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <TouchableHighlight onPress={(this.onCreateAccountPressed.bind(this))} style={styles.button}>
                                <Text style={styles.buttonText}>Create Account</Text>
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

    onCreateAccountPressed() {
        var profileImageLink;
        if (this.state.sex === "Male") {
            profileImageLink = "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png"
        } else {
            profileImageLink = "http://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png"
        }
        const account = {
            name: this.state.name,
            username: this.state.username,
            password: this.state.password,
            location: this.state.location,
            age: this.state.age,
            profileImageLink: profileImageLink
        };

        // if they did not enter a password or username, error them out
        if (account.name && account.password && account.username && account.location && account.age && account.profileImageLink) {
            fetch('http://104.236.188.210:8000/signup',
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
                    this.setState({ user: JSON.parse(err._bodyText) })
                    this.props.navigator.push({
                        title: "main.me",
                        component: MainView,
                        passProps: {user: this.state.user, username: this.state.username, password: this.state.password, id: err._bodyText.id, lastPhoto: err._bodyText.lastPhoto},
                    });                
                } else {
                    this.setState({
                        username: "",
                        password: ""
                    });
                    console.warn('Invalid Account Creation');
                }
            });
        } else {
            this.setState({
                username: "",
                password: ""
            });
            console.warn('Invalid Account Creation');
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
    ageSection: {
        flexDirection: 'row'
    },
    ageItems: {
        // borderWidth: 0.5,
        // borderColor: "#555555",
        alignItems: 'center',
        justifyContent: 'center'
    },
    ageButton: {
        width: deviceWidth/4.5,
        height: deviceHeight/20,
        // flex: 1,
        backgroundColor: "#555555",
        borderColor: "#555555",
        borderWidth: 0.5,
        borderRadius: 8,
        justifyContent: "center"
    },
    sexButton: {
        width: deviceWidth/3.5,
        height: deviceHeight/20,
        // flex: 1,
        backgroundColor: "#555555",
        borderColor: "#555555",
        borderWidth: 0.5,
        borderRadius: 8,
        justifyContent: "center"
    },
    sexSection: {
        marginTop: deviceHeight/70,
        flexDirection: 'row'
    },
    sexToggle: {
        width: deviceWidth/2.6,
        // borderWidth: 0.5,
        // borderColor: "#555555",
        alignItems: 'center',
        justifyContent: 'center'
    },
    sexDisplay: {
        // borderWidth: 0.5,
        // borderColor: "#555555",
        alignItems: 'center',
        justifyContent: 'center'
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover'
    },
    slider: {
        height: 10,
        margin: 10,
        width: deviceWidth/2.6,

    }
});
 
module.exports = SignupView;
