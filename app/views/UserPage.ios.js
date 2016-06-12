import React, {
  Component,
} from 'react';

import {
  AlertIOS,
  Dimensions,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  SegmentedControlIOS,
  Modal,
  TouchableHighlight,
  ScrollView,
  RefreshControl
} from 'react-native';

import ProgressBar from '../../Bar.js';
import pictures from './data.js';
import LoadingView from './LoadingView.ios.js';
import EditProfileView from './EditProfileView.ios.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import NewUserInstructionModal from './NewUserInstructionModal.ios.js';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

// var user = {
//   name: 'Jessica Jones',
//   username: 'jjones',
//   password: 'jjones',
//   location: 'San Francisco',
//   age: 40,
//   profileImageLink: 'http://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png'
// };

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class UserPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
      pictures: [],
      selectedIndex: 0,
      dataSource: null,
      totalPhotos: null,
      totalRating: null,
      totalLikes: null,
      loaded: false,
      refreshing: false,
      navigator: props.navigator
    }
  }

  componentDidMount() {
    this.getUserPhotos();
  }

  refreshPage() {

  }
  
  goToSettings() {
    this.state.navigator.popToTop();
  }

  getUserPhotos() {
    const sendInfo = {
        username: this.state.user.username,
        pagename: 'UserPage'
    };

    fetch('http://104.236.188.210:8000/getPhotos',
    {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendInfo)
    })
    .then((err) => {
      var context = this;
      if(err.status === 201) {
        this.setState({
          dataSource: ds.cloneWithRows(JSON.parse(err._bodyInit)),
          pictures: JSON.parse(err._bodyInit),
          loaded: true
        });
      }
        this.findTotals();

    })
  }

  findTotals() {
    var context = this;
    var photos = this.state.pictures.length;
    var likes = 0;
    var dislikes = 0;
    this.state.pictures.forEach(function(picture) {
      likes += picture.likes;
      dislikes += picture.dislikes;
    })
    var rating = likes / (likes + dislikes);
    this.setState({ totalPhotos: photos, totalRating: Math.floor(rating * 100) || '--', totalLikes: likes });
  }

  onChange(event) {
    this.setState({
      selectedIndex: event.nativeEvent.selectedSegmentIndex,
    });
  }

  renderLoadingView() {
    return (
      <View>
        <LoadingView />
      </View>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});

    const sendInfo = {
      username: this.state.user.username,
      pagename: 'UserPage'
    };

    fetch('http://104.236.188.210:8000/getPhotos',
    {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendInfo)
    })
    .then((err) => {
      var context = this;
      if(err.status === 201) {
        this.setState({
          dataSource: ds.cloneWithRows(JSON.parse(err._bodyInit)),
          pictures: JSON.parse(err._bodyInit),
          refreshing: false
        });
      }
        this.findTotals();

    })
    .then(() => this.setState({refreshing: false}));
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else { 
      return (
        <View>
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
                  <NewUserInstructionModal style={styles.info} header={'User Profile Page'} content={'\nThe user profile page provides a hub for photo statistics and a photo album.\n\nTap on a photo to view what the community thought of your photo.\n\nIn the same photo pop-up, tapping the \'delete picture\' button will permanently remove the photo from our database and your album.\n\nProfile information can be editted by tapping on the \'edit profile\' button beneath your nameplate!\n\nTap the refresh icon in the top left or drag your album downward to reload your album!'}/>
                </View>
                <View style={styles.refresh}>
                <TouchableHighlight onPress={this._onRefresh.bind(this)} underlayColor='transparent'>
                  <Icon name="refresh" size={23} color="#fff" />
                </TouchableHighlight>
                </View>
              </View>
            </View>
            <UserInfo user={this.state.user} navigator={this.state.navigator} />
            <UserStats user={this.state.user} totals={ {photos: this.state.totalPhotos, rating: this.state.totalRating, likes: this.state.totalLikes}}/>
            <View style={styles.segmentedControl}>
              <View style={styles.progressContainer}>
                <ProgressBar
                  style={styles.progress}  
                  progress={this.state.totalRating/100}
                  color={"#4FB948"}
                  borderColor={"#007696"}
                />
              </View>
            </View>
            <View style={styles.mainContainer}>
              <ListView
                  refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />
                }
                contentContainerStyle={styles.gridList}
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                // renderRow={(rowData) => this.typeOfList.bind(this, rowData)}
                renderRow={(rowData) => <GridListItem reference={this} picture={rowData} />}
              />
          </View>
        </View>
      )
    }
  }
}

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      navigator: props.navigator
    };
  }

  goEditProfile() {
    this.props.navigator.push({
      title: "edit.me",
      component: EditProfileView,
      passProps: {user: this.state.user},
    })
  }

  render() {
    return (
      <View style={styles.userInfo}>
        <View style={styles.userPictureContainer}>
          <Image 
            source={{uri: this.state.user.profileImageLink}}
            style={styles.userPicture}
          />
        </View>
        <View style={styles.userInfoRight}>
          <Text style={styles.userName}>{this.state.user.name}</Text>
          <Text style={styles.userLocationAge}>{this.state.user.location} | {this.state.user.age}</Text>
          <View style={styles.userEditOuter}> 
            <TouchableHighlight style={styles.userEditContainer} onPress={this.goEditProfile.bind(this)}>
              <Text style={styles.userEdit}>Edit Profile</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}


class UserStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
    }
  }

  render() {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumbers}>{this.props.totals.photos}</Text>
          <Text style={styles.statText}>Photos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumbers}>{this.props.totals.rating}%</Text>
          <Text style={styles.statText}>Approval Rating</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumbers}>{this.props.totals.likes}</Text>
          <Text style={styles.statText}>Likes</Text>
        </View>
      </View>
    )
  }
}

class GridListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: props.picture,
      animationType: 'slide',
      modalVisible: false,
      transparent: true,
      reference: props.reference,
      rating: Math.floor(props.picture.likes / (props.picture.likes + props.picture.dislikes) * 100) || 0
    };
  }

  setModalVisible(visible, deleteFlag, picID) {
    if (deleteFlag) {
      this.deletePictureAlert.bind(this, picID)();
    } else {
      this.setState({modalVisible: visible});
    }
  }

  deletePictureAlert(picID) {
    AlertIOS.alert(
      'Delete Photo Permanently?',
      null,
      [
        {text: 'Cancel', type: 'default'},
        {text:'Confirm', onPress: this.deletePhoto.bind(this, picID), type: 'default'}
      ]
    );      
  }

  deletePhoto(picID) {
    // ensures only pictures not on the test account are deleted on command
    if (this.state.picture.username !== 'jjones') {
      fetch('http://104.236.188.210:8000/deletePhoto', 
      {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: picID})      
      })
        .then((response) => {
          if(response.status === 200)
            this.setState({modalVisible: false});
            this.state.reference._onRefresh();
      })
    } else {
      AlertIOS.alert('You cannot delete in test mode!');
    }
  }

  render() {
    
    var modalBackgroundStyle = {backgroundColor: 'rgba(0, 0, 0, 0.5)'};
    var innerContainerTransparentStyle = {backgroundColor: '#fff', padding: 20};

    return (
      <View>
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setModalVisible(false, false)}}
          >
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <View style={styles.modalTitleContainer}>
                <Text
                  style={styles.modalTitle}>
                  {this.state.picture.comment.charAt(0).toUpperCase() + this.state.picture.comment.slice(1)}
                </Text>
              </View>
              <Image 
                source={{uri: this.state.picture.imagelink}}
                style={styles.modalPicture}/>
              <View style={styles.modalInfoContainer}>
              <View style={styles.deletePicContainer}> 
                <TouchableHighlight style={styles.deletePicButton} onPress={this.setModalVisible.bind(this, false, true, this.state.picture._id.$oid)} underlayColor='transparent'>
                  <Text style={styles.deletePicText}>Delete Picture</Text>
                </TouchableHighlight>
              </View>
              </View>
              <View style={styles.modalInfoContainer}>
                <View style={styles.modalInfoBox}>
                  <Text style={styles.statNumbers}>{this.state.rating}%</Text>
                  <Text style={styles.statText}>Approval Rating</Text>
                </View>
                <View style={styles.modalInfoBox}>
                  <Text style={styles.statNumbers}>{this.state.picture.likes}</Text>
                  <Text style={styles.statText}>Likes</Text>
                </View>
              </View>
              <View style={styles.closeContainer}> 
                <TouchableHighlight style={styles.closeButton} onPress={this.setModalVisible.bind(this, false, false)}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.gridListItem}>
          <TouchableHighlight
            onPress={this.setModalVisible.bind(this, true, false)}>
            <Image 
              source={{uri: this.state.picture.imagelink}}
              style={styles.gridListPicture}
            />
          </TouchableHighlight>
        </View>
      </View>
    )
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
    alignItems: 'center',
    flexDirection: 'row'
  },
  navRight: {
    width: deviceWidth/3,
    // borderWidth: 0.5,
    // borderColor: '#555555',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  navTitle: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    fontFamily: 'Avenir',
  },
  refresh: {
    width: deviceWidth/4,
    // borderWidth: 0.5,
    // borderColor: '#555555',
    alignItems: 'flex-end',
    paddingRight: deviceWidth/20,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // marginTop: deviceHeight/11,
    paddingTop: deviceHeight/40,
    paddingBottom: deviceHeight/40,
    paddingLeft: deviceWidth/15,
    borderBottomColor: '#47315a',
    borderBottomWidth: 0.5,
    // borderTopColor: '#47315a',
    // borderTopWidth: 0.5
  },
  userPictureContainer: {
    // borderRadius: 8,
    // borderWidth: 0.5,
  },
  userPicture: {
    width: 70,
    height: 70,
  },
  userInfoRight: {
    flex: 1
  },
  userName: {
    textAlign: 'center',
    fontSize: 24,
    // marginBottom: deviceHeight/40,
    fontFamily: 'Avenir'
  },
  userLocationAge: {
    textAlign: 'center',
    fontFamily: 'Avenir'

  },
  statsContainer: {
    flexDirection: 'row',
    borderBottomColor: '#47315a',
    borderBottomWidth: 0.5,

  },
  statBox: {
    width: deviceWidth/3.3,
    alignItems: 'center',
    borderWidth: 0.5,
    paddingTop: deviceHeight/110,
    paddingBottom: deviceHeight/110,
    margin: 5
  },
  statText: {
    fontSize: 10,
    fontFamily: 'Avenir'
  },
  statNumbers: {
    fontSize: 24,
    fontFamily: 'Avenir'
  },
  segmentedControl: {
    backgroundColor: 'white',
    paddingTop: deviceHeight/80,
    paddingBottom: deviceHeight/80,
    paddingLeft: deviceWidth/30,
    paddingRight: deviceWidth/30,
    borderBottomColor: '#47315a',
    borderBottomWidth: 0.5,

  },
  mainContainer: {
    height: deviceHeight/1.8
  },
  gridList: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // borderBottomColor: '#47315a',
    // borderBottomWidth: 0.5,
    // borderTopColor: '#47315a',
    // borderTopWidth: 0.5,
    marginBottom: 5,
    // height: deviceHeight/2
  },
  gridListItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridListPicture: {
    width: deviceWidth/3,
    height: deviceWidth/3,
    // paddingTop: deviceWidth/20,
    // paddingBottom:deviceWidth/20,
    // paddingLeft: deviceWidth/20,
    // paddingRight: deviceWidth/20
  },
  modalTitle: {
    width: deviceWidth/2,
    textAlign: 'center',
    borderWidth: 0.5,
    paddingTop: deviceHeight/110,
    paddingBottom: deviceHeight/110,
    margin: 5,
    fontSize: 18,
    fontFamily: 'Avenir'
  },
  modalInfoContainer: {
    flexDirection: 'row',
    // borderTopColor: '#47315a',
    // borderTopWidth: 0.5,
    // borderBottomColor: '#47315a',
    // borderBottomWidth: 0.5,
  },
  modalInfoBox: {
    width: deviceWidth/3.3,
    alignItems: 'center',
    borderWidth: 0.5,
    paddingTop: deviceHeight/110,
    paddingBottom: deviceHeight/110,
    margin: 5
  },
  modalPicture: {
    width: deviceWidth/2,
    height: deviceHeight/2
  },
  modalButton: {
    width: deviceWidth/3.3,
    textAlign: 'center',
    borderWidth: 0.5,
    paddingTop: deviceHeight/110,
    paddingBottom: deviceHeight/110,
    margin: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 10
  },
  innerContainer: {
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: deviceWidth/12,
    marginRight: deviceWidth/12
  },
  progressContainer: {
    alignItems: 'center'
  },
  userEditOuter: {
    alignItems: 'center'
  },
  userEditContainer: {
    width: deviceWidth/5,
    height: deviceHeight/30,
    flex: 1,
    backgroundColor: "#555555",
    borderColor: "#555555",
    borderWidth: 0.5,
    // borderRadius: 8,
    marginTop: deviceHeight/100,
    justifyContent: "center",
  },
  userEdit: {
    textAlign: 'center',
    fontSize: 12,
    color: "#ffffff",
    alignSelf: "center",
    fontFamily: 'Avenir'
  },
  deletePicContainer: {
    alignItems: 'center',
    marginBottom: deviceHeight/100
  },
  deletePicButton: {
    width: deviceWidth/3.3,
    height: deviceHeight/30,
    flex: 1,
    backgroundColor: "red",
    borderColor: "red",
    borderWidth: 0.5,
    // borderRadius: 8,
    marginTop: deviceHeight/100,
    justifyContent: "center",
  },
  deletePicText: {
    textAlign: 'center',
    fontSize: 15,
    color: "#ffffff",
    alignSelf: "center",
    fontFamily: 'Avenir'
  },
  closeContainer: {
    alignItems: 'center',
    marginBottom: deviceHeight/100
  },
  closeButton: {
    width: deviceWidth/4,
    height: deviceHeight/30,
    flex: 1,
    backgroundColor: "#555555",
    borderColor: "#555555",
    borderWidth: 0.5,
    // borderRadius: 8,
    marginTop: deviceHeight/100,
    justifyContent: "center",
  },
  closeText: {
    textAlign: 'center',
    fontSize: 15,
    color: "#ffffff",
    alignSelf: "center",
    fontFamily: 'Avenir'
  },
  info: {
    paddingLeft: deviceWidth/10
  }
});

module.exports = UserPage;

