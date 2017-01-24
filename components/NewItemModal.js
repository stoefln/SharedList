import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, TextInput } from 'react-native';
const styles = require('../styles.js')
const constants = styles.constants;

class NewItemModal extends Component {

  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible, text: ""});
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false) }}>

        <View style={{backgroundColor: '#FFFFFF66', justifyContent: 'center'}}>
           <View style={{margin: 22, backgroundColor: '#FFFF00'}}>
            <View>
              <Text>New ToDo</Text>

              <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                />
              <View style={styles.action}>
                <TouchableHighlight
                  underlayColor={constants.actionColor}
                  onPress={() => {
                  this.setModalVisible(!this.state.modalVisible)
                  this.props.onAddItem(this.state.text);
                }}>
                  <Text style={styles.actionText}>Add</Text>
                </TouchableHighlight>
              </View>
            </View>
           </View>
         </View>
        </Modal>

        <View style={styles.action}>
          <TouchableHighlight
            underlayColor={constants.actionColor}
            onPress={() => {
            this.setModalVisible(true)
          }}>
              <Text style={styles.actionText}>Add Item</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
module.exports = NewItemModal;
