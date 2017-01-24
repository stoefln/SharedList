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
  Share
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

let RowComponent = React.createClass({
  render: function() {
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        delayLongPress={500} {/* 500ms hold delay */}
        style={{padding: 25, backgroundColor: "#F8F8F8", borderBottomWidth:1, borderColor: '#eee'}}
      >
        <Text>{this.props.data.text}</Text>
      </TouchableHighlight>
    );
  }
});

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

    var now = new Date().getTime();

    itemsRef.on('value', (snap) => {
      // get children as an array
      var items = [];
      snap.forEach((child) => {
        var checkedOn = child.val().checkedOn;
        if(typeof checkedOn == 'undefined' || checkedOn > now - 5 * 60 * 1000){
          items.push({
            title: child.val().title,
            checkedOn: checkedOn,
            _key: child.key
          });
        }
      });

      var data = this.state.dataSource.cloneWithRows(items);
      this.setState({
        dataSource: data,
        order: Object.keys(data)
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
        <SortableListView enableEmptySections={true} data={this.state.dataSource} order={this.state.order}
          onRowMoved={e => {
            this.state.order.splice(e.to, 0, this.state.order.splice(e.from, 1)[0]);
            this.forceUpdate();
          }}
          renderRow={row => <RowComponent data={row} />} style={styles.listview} />
        <NewItemModal onAddItem={this.addItem.bind(this)} />
        <ActionButton onPress={() => Share.share({message: 'bla', title: 'title'})} title="Share List" />
      </View>
    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
