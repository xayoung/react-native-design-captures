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
    View,
    Navigator,
    ScrollView

} from 'react-native';



var ShotList = require("./comment/ShotList");
var ScrollableView = require("./comment/Scrollable");

class Designer extends Component {
  render() {
    return (



        <Navigator
            tabLabel="ios-paper"
            initialRoute={{name:'首页',component:ScrollableView}}
            configureScene={()=>{
                return Navigator.SceneConfigs.PushFromRight;
            }}
            renderScene={(route,navigator)=>{
                let Component = route.component;
                return <Component {...route.passProps} navigator={navigator}/>;
            }}
        />


    );
  }
}

const styles = StyleSheet.create({
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },

});

AppRegistry.registerComponent('Designer', () => Designer);
