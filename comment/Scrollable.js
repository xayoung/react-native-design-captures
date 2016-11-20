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

var ShotList = require("./Dribbble/ShotList");
var ProjectsList = require("./Behance/ProjectsList");


class Scrollable extends Component {
    render() {


        return (
        <ScrollableTabView
            style={{paddingTop: 20}}
            initialPage={0}
            renderTabBar={() => <FacebookTabBar />}
        >
            <ShotList
                tabLabel='dribbble'
                navigator={this.props.navigator}
            />

            <ProjectsList
                tabLabel='behance'
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