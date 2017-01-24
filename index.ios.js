/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import * as firebase from 'firebase';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  AlertIOS
} from 'react-native';

const ActionButton = require('./components/ActionButton');
const StatusBar = require('./components/StatusBar');
const ListItem = require('./components/ListItem');
const NewItemModal = require('./components/NewItemModal');
const styles = require("./styles.js");
const constants = styles.constants;

const firebaseConfig = {
  apiKey: "AIzaSyBWSLByckX-dInb24sP3XBJFol5zaKaAcY",
  authDomain: "localnotes-ae435.firebaseapp.com",
  databaseURL: "https://localnotes-ae435.firebaseio.com",
  storageBucket: "localnotes-ae435.appspot.com",
  messagingSenderId: "569588775649"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);



export default class AwesomeProject extends Component {


  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.itemsRef = firebaseApp.database().ref('items');

    this.state = {
      dataSource: ds.cloneWithRows([])
    };

  }

  listenForItems(itemsRef) {

    itemsRef.on('value', (snap) => {
      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          checkedOn: child.val().checkedOn,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    }, (error) => {console.log(error)});
  }

  _renderItem(item, sectionID, rowID, highlightRow) {
      return (
        <ListItem item={item} onPress={() => this.itemPress(item)} />
      );
  }

  itemPress(item){
      console.log("itemPress", item._key, typeof item.checkedOn);
      item.checkedOn = typeof item.checkedOn == 'number' ? null : new Date().getTime();
      firebaseApp.database().ref('items/' + item._key).set(item);
  }
  componentDidMount() {
      this.listenForItems(this.itemsRef);
  }

  addItem(text) {
    this.itemsRef.push({ title: text, createdOn: new Date().getTime() })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar title="ToDo List" />
        <ListView enableEmptySections={true} dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview} />
        <NewItemModal onAddItem={this.addItem.bind(this)} />
      </View>
    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
