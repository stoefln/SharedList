import React, {Component} from 'react';
import ReactNative from 'react-native';
import Moment from 'moment';

const styles = require('../styles.js')
const { View, TouchableHighlight, Text, Image } = ReactNative;

class ListItemDone extends Component {

  constructor(props){
    super(props);
  }

  render() {
    Moment.locale('de');
    var style = {width: 30, height: 30};
    //console.log("listitem", this.props.item, typeof this.props.item.checkedOn);
    if(typeof this.props.item.checkedOn == 'number'){
      style.opacity = 1;
    }else{
      style.opacity = 0.2;
    }
    return (

      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor={'#eee'}
        delayLongPress={500}
        {...this.props.sortHandlers}>
          <View style={styles.li}>
            <View>
              <Text style={styles.liText}>{this.props.item.title}</Text>
              <Text>{Moment(this.props.item.checkedOn).calendar()}</Text>
            </View>
            <Image source={require('../img/check.png')} style={style}/>
          </View>
      </TouchableHighlight>
    );
  }
}

module.exports = ListItemDone;
