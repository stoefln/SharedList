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
  Share,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import 'firebase/auth';
import 'firebase/database';
import Moment from 'moment';
import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager';


const SortableListView = require('react-native-sortable-listview')
const ActionButton = require('./components/ActionButton');
const StatusBar = require('./components/StatusBar');
const ListItem = require('./components/ListItem');
const ListItemDone = require('./components/ListItemDone');
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
      data: {},
      doneItems: ds.cloneWithRows(['row 1', 'row 2'])
    };

  }

  listenForItems(itemsRef) {

    var now = new Date().getTime();
    this.setState({
      showLoadingIndicator: true
    });

    itemsRef.orderByChild("order").on('value', (snap) => {

      var data = {};
      var doneItems = {};
      snap.forEach((child) => {
        var checkedOn = child.val().checkedOn;
        var key = child.key;
        if(typeof checkedOn == 'undefined' || checkedOn == null){
          data[key] = child.val();
          data[key].key = key;
        } else {
          doneItems[key] = child.val();
          doneItems[key].key = key;
        }
      });

      console.log("loaded data", data);
      console.log("old items", doneItems);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      this.setState({
        data: data,
        doneItems: ds.cloneWithRows(doneItems),
        order: Object.keys(data),
        showLoadingIndicator: false,
      });

    }, (error) => {console.log(error)});
  }

  itemPress(item){
      console.log("itemPress", item, typeof item.checkedOn, item.key);
      item.checkedOn = typeof item.checkedOn == 'number' ? null : new Date().getTime();
      firebaseApp.database().ref('items/' + item.key).set(item);
  }

  onRowMoved(e) {
    this.state.order.splice(e.to, 0, this.state.order.splice(e.from, 1)[0]);
    this.forceUpdate();
    let order = this.state.order;
    for(var i=0; i<order.length; i++){
      var key1 = order[i];
      var item1 = this.state.data[key1];
      item1.order = i;
      firebaseApp.database().ref('items/' + key1).set(item1);
    }
  }

  componentDidMount() {
      this.listenForItems(this.itemsRef);
  }

  addItem(text) {
    let newItem = { title: text, createdOn: new Date().getTime(), order: this.getMinOrder() - 1 };
    console.log("addItem", newItem);
    this.itemsRef.push(newItem);
  }

  getMinOrder(){
    let data = this.state.data;
    var minOrder = 100000;

    Object.keys(data).forEach(function(name, index){
      var order = data[name].order;
      if(typeof order != 'undefined' && order < minOrder){
        minOrder = order;
      }
    });

    return minOrder;
  }

  _renderTitleIndicator() {
      return <PagerTitleIndicator titles={['To do', 'Done']} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <IndicatorViewPager
          style={{flex:1, paddingTop:20, backgroundColor:'white'}}
                   indicator={this._renderTitleIndicator()}
               >
          <View>
            <StatusBar title="ToDo List" />
            <SortableListView enableEmptySections={true} data={this.state.data} order={this.state.order}
              onRowMoved={e => this.onRowMoved(e)}
              renderRow={row => <ListItem item={row} onPress={() => this.itemPress(row)} />}
              style={styles.listview} />
            <NewItemModal onAddItem={(text) => this.addItem(text)} />
            <ActionButton onPress={() => Share.share({message: 'bla', title: 'title'})} title="Share List" />
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator
                  animating={this.state.showLoadingIndicator}
                  size="large"
                />
            </View>
          </View>
          <View>
             <StatusBar title="Done List" />
             <ListView dataSource={this.state.doneItems} renderRow={(row) => <ListItemDone item={row} onPress={() => this.itemPress(row)} />} />
          </View>
        </IndicatorViewPager>
      </View>
    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
