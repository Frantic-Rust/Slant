import React, {
  Component,
} from 'react';

import {
  AlertIOS,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  MapView
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import NewUserInstructionModal from './NewUserInstructionModal.ios.js';
import LoadingView from './LoadingView.ios.js';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class MapViewPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			navigator: props.navigator,
      loaded: true,
      locationDataArray: props.locationDataArray,
			markers: [],
			region: {
					  latitude: props.locationDataArray[0].locationData.latitude,
					  longitude: props.locationDataArray[0].locationData.longitude,
					  latitudeDelta: 0.01,
					  longitudeDelta: 0.01,
					},
		};

	}

  componentDidMount() {
      this.pinMaker();
  }

  // loop through locationDataArray 
  // make ojects inside of this.state.markers
    pinMaker() {
      var arr = [];
      this.props.locationDataArray.forEach((value) => {
        var object = {
                      latitude: value.locationData.latitude,
                      longitude: value.locationData.longitude,
                      title: value.locationData.neighborhood,
                      rightCalloutView: (
                        <View style={styles.imageContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            alert('You Are Here');
                          }}>
                          <Image
                            style={{width:60, height:60}}
                            source={{ uri:  value.imagelink }}
                          />
                        </TouchableOpacity>
                        </View>
                      ),
                      subtitle: value.locationData.subTitle
                    };
                    // console.error(value);
        arr.push(object);
      });
      this.setState({ markers: this.state.markers.concat(arr) });
    }

	goLogOut() {
		this.state.navigator.popToTop();
	}
  
  fetchNewData() {
    fetch('http://104.236.188.210:8000/getAllPhotos')
    .then((response) => response.json())
    .then((responseData) => this.setState({locationDataArray: responseData, loaded: true}));
  }

	refreshPage() {
    this.setState({loaded: false});
    this.fetchNewData();
	}

  renderLoadingView() {
    return (
      <View>
        <LoadingView />
      </View>
    );
  }

	render() {
    if(!this.state.loaded){
      return this.renderLoadingView();
    } else {
	    return (
	      <View>
			<View style={styles.navbarContainer}>
			  <View style={styles.navLeft}>
			    <TouchableHighlight onPress={this.goLogOut.bind(this)} underlayColor='transparent'>
			      <Icon name="sign-out" size={25} color="#fff" />
			    </TouchableHighlight>
			  </View>
			  <View style={styles.navMiddle}>
			    <Text style={styles.navTitle}>Slant</Text>
			  </View>
			  <View style={styles.navRight}>
				  <View>
				    <NewUserInstructionModal style={styles.info} header={'GPS Photo Map Page'} content={
              '\nView where you are currently and where photos have been taken by GPS location.'}/>
				  </View>
				  <View style={styles.refresh}>
				  <TouchableHighlight onPress={this.refreshPage.bind(this)} underlayColor='transparent'>
				    <Icon name="refresh" size={23} color="#fff" />
				  </TouchableHighlight>
				  </View>
			  </View>
			</View>
		    <MapView 
		      style={{
			      height: deviceHeight,
			      width: deviceWidth,
		      }}
		      region={this.state.region}
		      annotations={this.state.markers}
		    />
	      </View>
	    )}
	}
}

var styles = StyleSheet.create({
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
    paddingLeft: deviceWidth/20,
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
  refresh: {
    width: deviceWidth/4,
    // borderWidth: 0.5,
    // borderColor: '#555555',
    alignItems: 'flex-end',
    paddingRight: deviceWidth/20,
  },
  image: {
    width: deviceWidth/4,
    height: deviceWidth/4
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = MapViewPage;