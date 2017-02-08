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
  AlertIOS,
  Share, TouchableHighlight
} from 'react-native';
import 'firebase/auth';
import 'firebase/database';

const SortableListView = require('react-native-sortable-listview')
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
      data: {}
    };

  }

  listenForItems(itemsRef) {

    var now = new Date().getTime();

    itemsRef.orderByChild("order").on('value', (snap) => {
      // get children as an array
      var items = [];
      var data = {};
      snap.forEach((child) => {
        var checkedOn = child.val().checkedOn;
        if(typeof checkedOn == 'undefined' || checkedOn > now - 5 * 60 * 1000){
          items.push({
            title: child.val().title,
            checkedOn: checkedOn,
            _key: child.key
          });
          data[child.key] = child.val();
        }
      });

      console.log("loaded data", data);

      this.setState({
        data: data,
        order: Object.keys(data)
      });

    }, (error) => {console.log(error)});
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
    console.log("this.state.data2",this.state.data);
    console.log("this.state.order2",this.state.order);
    return (
      <View style={styles.container}>
        <StatusBar title="ToDo List" />
        <SortableListView enableEmptySections={true} data={this.state.data} order={this.state.order}
          onRowMoved={e => {
            this.state.order.splice(e.to, 0, this.state.order.splice(e.from, 1)[0]);
            this.forceUpdate();
            let order = this.state.order;
            for(var i=0; i<order.length;i++){
              var key1 = order[i];
              var item1 = this.state.data[key1];
              item1.order = i;
              firebaseApp.database().ref('items/' + key1).set(item1);
            }

            //console.log("from: ", e.from, "to: ", e.to);
            //console.log("key1: ", item1, "key2: ", item2);

          }}
          renderRow={row => <ListItem item={row} onPress={() => this.itemPress(row)} />}
          style={styles.listview} />
        <NewItemModal onAddItem={this.addItem.bind(this)} />
        <ActionButton onPress={() => Share.share({message: 'bla', title: 'title'})} title="Share List" />
      </View>
    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
