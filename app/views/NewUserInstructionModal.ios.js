import React, {
  Component,
} from 'react';

import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class NewUserInstructionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'slide',
      modalVisible: false,
      transparent: true,
      header: props.header,
      content: props.content
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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
          onRequestClose={() => {this.setModalVisible(false)}}
          >
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <View style={styles.headerContainer}>
                <Text>{this.state.header}</Text>
              </View>
              <View style={styles.contentContainer}>
                <Text>{this.state.content}</Text>
              </View>
              <View style={styles.closeContainer}> 
                <TouchableHighlight style={styles.closeButton} onPress={this.setModalVisible.bind(this, false, false)}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.iconContainer}>
            <TouchableHighlight onPress={this.setModalVisible.bind(this, true)} underlayColor='transparent'>
              <Icon name="info" size={25} color="#fff" />
            </TouchableHighlight>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 10
  },
  innerContainer: {
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: deviceWidth/8,
    marginRight: deviceWidth/8
  },
  headerContainer: {

  },
  contentContainer: {

  },
  iconContainer: {
    paddingLeft: deviceWidth/10
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
})

module.exports = NewUserInstructionModal;