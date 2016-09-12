/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var ShotList = require("./comment/ShotList");

class Designer extends Component {
  render() {
    return (
        <ShotList/>
    );
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('Designer', () => Designer);
