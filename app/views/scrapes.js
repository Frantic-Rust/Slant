  
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setModalVisible(false)}}
          >
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <Image 
                source={{uri: this.state.picture.picture}}
                style={styles.modalPicture}
              />
              <Text
                onPress={this.setModalVisible.bind(this, false)}
                style={styles.modalButton}>
                Close
              </Text>
            </View>
          </View>
        </Modal>

        <View style={styles.gridList}>
        <ScrollView>
          {this.state.pictures.map(picture => 
            <GridListItem picture={picture}/>
          )}
        </ScrollView>
      </View>

  pictureInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    borderBottomColor: '#47315a',
    borderBottomWidth: 0.5
  },
  picPicture: {
    width: 50,
    height: 80
  },
  picInfoRight: {
    flex: 1
  },
  picTitle: {
    textAlign: 'center',
    paddingBottom: 10
  },
  progressBarContainer: {
    alignItems: 'center'
  },
  scrollView: {
     height: 400
  },
  toolbar: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    // backgroundColor: '#E85833'
  },
  toolbarButton: {
    width: 50,
    color: '#fff',
    textAlign: 'center'
  },
  toolbarTitle: {
    color: '#fff',
    textAlign: 'center', 
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15
  },
  settingsButtonContainer: {
    paddingRight: 10
  },
  settingsButton: {
    height: 20,
    width: 20
  },

class UserNavBar extends Component {
  render() {
    return (
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>objectify.me</Text>
        <View style={styles.settingsButtonContainer}>
          <Image 
            source={{uri: 'http://www.iconsdb.com/icons/preview/white/settings-4-xxl.png'}}
            style={styles.settingsButton}
          />
        </View>
      </View>
    )
  }
}

class PictureList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pictures: props.pictures
    }
  }
  render() {
    return (
      <View>
        <ScrollView
          scrollEventThrottle={200}
          contentInset={{top: 0}}
          style={styles.scrollView}>
            {this.state.pictures.map(picture => 
                <PictureListItem picture={picture}/>
            )}
        </ScrollView>
      </View>
    )  
  }
}     

class PictureListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      picture: props.picture,
      progress: props.picture.likes / (props.picture.likes + props.picture.dislikes)
    }
  }
  render() {
    return (
      <View style={styles.pictureInfo}>
        <Image 
          source={{uri: this.state.picture.picture}}
          style={styles.picPicture}
        />
        <View style={styles.picInfoRight}>
          <Text style={styles.picTitle}>"{this.state.picture.title}" - {Math.floor(this.state.progress * 100)}%</Text>
          <View style={styles.progressBarContainer}>
            <ProgressBar  
              progress={this.state.progress}
              color={"#4FB948"}
              borderColor={"#007696"}
            />
          </View>
        </View>
      </View>
    )
  }
}
