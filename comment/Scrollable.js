/**
 * Created by xayoung on 9/7/16.
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

import FacebookTabBar from './FacebookTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';

var ShotList = require("./ShotList");


class Scrollable extends Component {
    render() {
        return (
        <ScrollableTabView
            style={{marginTop: 20, }}
            initialPage={1}
            renderTabBar={() => <FacebookTabBar />}
        >
            <ShotList
                tabLabel="ios-paper"
                navigator={this.props.navigator}
            />

        </ScrollableTabView>


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

//输出类
module.exports = Scrollable;