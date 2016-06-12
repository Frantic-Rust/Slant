// Tinder.js
'use strict';

import React, {Component} from 'react'; 

import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';

import SwipeCards from './SwipeCards.js';
import LoadingView from '../views/LoadingView.ios.js';

// import Cards from '../views/data.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class Card extends Component {
  render() {
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{uri: this.props.imagelink}} />
        <Text style={styles.text}>{this.props.comment}</Text>
      </View>
    )
  }
}



class NoMoreCards extends Component {
  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>No more cards</Text>
      </View>
    )
  }
}


class TinderCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      id: props.id,
      lastPhoto: props.lastPhoto,
      cards: [],
      outOfCards: false,
      loaded: false 
    }
  }

  componentDidMount() {
    this.getSwipePhotos();
  }

  getSwipePhotos() {
    const sendInfo = {
        username: this.state.username,
        pagename: 'SwipeView',
        id: this.state.id,
        lastPhoto: this.state.lastPhoto
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
      if(err.status === 201) {
        this.setState({
          cards: JSON.parse(err._bodyInit),
          loaded: true
        });
      }
    })
  }

  handleYup (card) {
    card.type = 0;
    card.id = this.state.id;
    fetch('http://104.236.188.210:8000/vote', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(card)
      });
  }

  handleNope (card) {
    card.type = 1;
    card.id = this.state.id;
    fetch('http://104.236.188.210:8000/vote', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(card)
      });
  }

  renderLoadingView() {
    return (
      <View>
        <LoadingView />
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else { 
      return (
        <SwipeCards
          cards={this.state.cards}
          loop={false}

          renderCard={(cardData) => <Card {...cardData} />}
          renderNoMoreCards={() => <NoMoreCards />}
          showYup={true}
          showNope={true}

          handleYup={this.handleYup.bind(this)}
          handleNope={this.handleNope.bind(this)}/>
      )
    }
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: -deviceHeight/15,
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 1,
  },
  thumbnail: {
    flex: 1,
    width: deviceWidth / 1.1,
    height: deviceHeight / 1.5,
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'Avenir'

  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

module.exports = TinderCards;