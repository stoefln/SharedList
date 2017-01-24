import React, {Component} from 'react';
import ReactNative from 'react-native';
const styles = require('../styles.js')
const { View, TouchableHighlight, Text, Image } = ReactNative;

class ListItem extends Component {

  constructor(props){
    super(props);
  }

  render() {
    var style = {width: 30, height: 30};
    console.log("listitem", this.props.item, typeof this.props.item.checkedOn);
    if(typeof this.props.item.checkedOn == 'number'){
      style.opacity = 1;
    }else{
      style.opacity = 0.2;
    }
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.li}>
          <Text style={styles.liText}>{this.props.item.title}</Text>
          <Image source={require('../img/check.png')} style={style}/>
        </View>
      </TouchableHighlight>
    );
  }
}

module.exports = ListItem;
