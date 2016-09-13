/**
 * Created by xayoung on 8/28/16.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Switch,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions
} from 'react-native';

var GiftedListView = require('react-native-gifted-listview');
var GiftedSpinner = require('react-native-gifted-spinner');

var getImage = require("./getImage");

//请求api
var api = require("./api"),
    ShotCell = require("./ShotCell"),
    ShotDetails = require("./ShotDetails"),
    screen = Dimensions.get('window');
//网络请求相关
var resultsCache = {
    dataForQuery: [],
    nextPageNumberForQuery: [],
    totalForQuery: [],
};

var ShotList = React.createClass({
    //初始化参数
    getDefaultProps(){
        return {
            filter: "default"
        };
    },

    //状态机,datasource
    getInitialState(){
        return {

            filter: this.props.filter,
            queryNumber: 0,
        };
    },

    // 跳转到二级界面
    pushToDetail(shot){
        console.log(shot.title);
        this.props.navigator.push(
            {
                component: ShotDetails, // 要跳转的版块
                passProps: {shot},
                title: shot.title

            }
        );
    },




    _onFetch(page = 1, callback, options) {
        this.setState({ queryNumber: this.state.queryNumber + 1 });
        console.log(this.state.queryNumber)
        var query = this.state.filter;
        setTimeout(() => {
            var header = 'Header '+page;
            var rows = {};

            api.getShotsByType(query,this.state.queryNumber)
                .catch((error) => {

                })
                .then((responseData) => {
                    callback(responseData);
                    console.log(responseData)
                })
                .done();


        }, 1000); // simulating network fetching
    },

    _onEndReached(){
        console.log('底部')
        this.refs.glistView._onPaginate()
    },


    /**
     * When a row is touched
     * @param {object} rowData Row data
     */
    _onPress(rowData) {
        console.log(rowData+' pressed');
    },

    /**
     * Render a row
     * @param {object} rowData Row data
     */
    _renderRowView(rowData) {
        return (
            <TouchableOpacity onPress={()=>{this.pushToDetail(rowData)}}>
                <View style={styles.cellViewStyle}>
                    {/*左边*/}
                    <Image  source={getImage.shotImage(rowData)} style={styles.imgStyle}/>
                </View>
            </TouchableOpacity>
        );
    },

    /**
     * Render a row
     * @param {object} rowData Row data
     */
    _renderSectionHeaderView(sectionData, sectionID) {
        return (
            <View style={customStyles.header}>
                <Text style={customStyles.headerTitle}>
                    {sectionID}
                </Text>
            </View>
        );
    },

    /**
     * Render the refreshable view when waiting for refresh
     * On Android, the view should be touchable to trigger the refreshCallback
     * @param {function} refreshCallback The function to call to refresh the listview
     */
    _renderRefreshableWaitingView(refreshCallback) {
        if (Platform.OS !== 'android') {
            return (
                <View style={customStyles.refreshableView}>
                    <Text style={customStyles.actionsLabel}>
                        ↓
                    </Text>
                </View>
            );
        } else {
            return (
                <TouchableHighlight
                    underlayColor='#c8c7cc'
                    onPress={refreshCallback}
                    style={customStyles.refreshableView}
                >
                    <Text style={customStyles.actionsLabel}>
                        ↻
                    </Text>
                </TouchableHighlight>
            );
        }
    },

    /**
     * Render the refreshable view when the pull to refresh has been activated
     * @platform ios
     */
    _renderRefreshableWillRefreshView() {
        return (
            <View style={customStyles.refreshableView}>
                <Text style={customStyles.actionsLabel}>
                    ↻
                </Text>
            </View>
        );
    },

    /**
     * Render the refreshable view when fetching
     */
    _renderRefreshableFetchingView() {
        return (
            <View style={customStyles.refreshableView}>
                <GiftedSpinner />
            </View>
        );
    },

    /**
     * Render the pagination view when waiting for touch
     * @param {function} paginateCallback The function to call to load more rows
     */
    _renderPaginationWaitingView(paginateCallback) {
        return (
            <TouchableHighlight
                underlayColor='#c8c7cc'
                onPress={paginateCallback}
                style={customStyles.paginationView}
            >
                <Text style={[customStyles.actionsLabel, {fontSize: 13}]}>
                    Load more
                </Text>
            </TouchableHighlight>
        );
    },

    /**
     * Render the pagination view when fetching
     */
    _renderPaginationFetchigView() {
        return (
            <View style={customStyles.paginationView}>
                <GiftedSpinner />
            </View>
        );
    },

    /**
     * Render the pagination view when end of list is reached
     */
    _renderPaginationAllLoadedView() {
        return (
            <View style={customStyles.paginationView}>
                <Text style={customStyles.actionsLabel}>
                    ~
                </Text>
            </View>
        );
    },

    /**
     * Render a view when there is no row to display at the first fetch
     * @param {function} refreshCallback The function to call to refresh the listview
     */
    _renderEmptyView(refreshCallback) {
        return (
            <View style={customStyles.defaultView}>
                <Text style={customStyles.defaultViewTitle}>
                    Sorry, there is no content to display
                </Text>

                <TouchableHighlight
                    underlayColor='#c8c7cc'
                    onPress={refreshCallback}
                >
                    <Text>
                        ↻
                    </Text>
                </TouchableHighlight>
            </View>
        );
    },

    /**
     * Render a separator between rows
     */
    _renderSeparatorView() {
        return (
            <View style={customStyles.separator} />
        );
    },


    render(){

        return (
            <View style={screenStyles.container}>
                <GiftedListView
                    ref= 'glistView'
                    rowView={this._renderRowView}

                    onFetch={this._onFetch}
                    initialListSize={10} // the maximum number of rows displayable without scrolling (height of the listview / height of row)

                    firstLoader={true} // display a loader for the first fetching
                    onEndReached={this._onEndReached}
                    pagination={false} // enable infinite scrolling using touch to load more

                    refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                    refreshableViewHeight={50} // correct height is mandatory
                    refreshableDistance={40} // the distance to trigger the pull-to-refresh - better to have it lower than refreshableViewHeight
                    refreshableFetchingView={this._renderRefreshableFetchingView}
                    refreshableWillRefreshView={this._renderRefreshableWillRefreshView}
                    refreshableWaitingView={this._renderRefreshableWaitingView}

                    emptyView={this._renderEmptyView}

                    renderSeparator={this._renderSeparatorView}

                    withSections={false} // enable sections
                    sectionHeaderView={this._renderSectionHeaderView}

                    PullToRefreshViewAndroidProps={{
            colors: ['#fff'],
            progressBackgroundColor: '#003e82',
          }}

                    rowHasChanged={(r1,r2)=>{
            r1.id !== r2.id
          }}
                />
            </View>
        );
    },

});


var customStyles = {
    separator: {
        height: 1,
        backgroundColor: '#CCC'
    },
    refreshableView: {
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsLabel: {
        fontSize: 20,
        color: '#007aff',
    },
    paginationView: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    defaultView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    defaultViewTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    row: {
        padding: 10,
        height: 44,
    },
    header: {
        backgroundColor: '#50a4ff',
        padding: 10,
    },
    headerTitle: {
        color: '#fff',
    },
};


var screenStyles = {
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    navBar: {
        height: 64,
        backgroundColor: '#007aff',

        justifyContent: 'center',
        alignItems: 'center',
    },
    navBarTitle: {
        color: '#fff',
        fontSize: 16,
        marginTop: 12,
    }
};

const styles = StyleSheet.create({
    mainViewStyle:{
        flex: 1
    },

    cellViewStyle:{
        // 确定主轴的方向
        flexDirection:'row',
        // 设置侧轴的对齐方式
        // alignItems:'center',
        // padding:10,
        // 设置下边框
        borderBottomColor:'#e8e8e8',
        borderBottomWidth:0.5

    },

    imgStyle:{
        height: 300,
        width: screen.width,
        backgroundColor: "transparent",
        resizeMode: "cover"
    },
    titleStyle:{
        fontSize:16,
        marginBottom:5
    },
    container: {
        flex: 1,
    },
    switch: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    control: {
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 16,
        marginRight: 16
    }

});

//输出类
module.exports = ShotList;
