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

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height; 

class LoadingView extends Component {
    render() {
        return (
            <View >
                <Image source={require('./images/background4.png')} style={styles.backgroundImage}>
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            <Image source={require('./images/slant2.png')} style={styles.logo} />
                        </View>
                        <View style={styles.inputs}>
                            <Text style={styles.buttonText}>Loading....</Text>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }
};
 
var styles = StyleSheet.create({
    container: {
        marginTop: deviceHeight/3,
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
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: "#ffffff",
        alignSelf: "center",
        backgroundColor: 'rgba(0,0,0,0)',
        fontFamily: 'Baskerville'

    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover'
    }
});
 
module.exports = LoadingView;