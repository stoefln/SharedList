import React, {Component} from 'react';
import ReactNative from 'react-native';

const styles = require('../styles.js')
const { View, Text } = ReactNative;

class ListItemHeader extends Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
      <View style={styles.li}>
        <Text style={styles.liHeaderText}>{this.props.category}</Text>
      </View>
    );
  }
}

module.exports = ListItemHeader;
