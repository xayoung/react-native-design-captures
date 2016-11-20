/**
 * Created by xayoung on 8/28/16.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';

var GiftedListView = require('react-native-gifted-listview');
import Image from 'react-native-image-progress';
import { RadioButtons } from 'react-native-radio-buttons'

var getImage = require("./../getImage");

//请求api
var api = require("./../api"),
    ShotCell = require("./ShotCell"),
    ShotDetails = require("./ShotDetails"),
    screen = Dimensions.get('window');

var ShotList = React.createClass({
    //初始化参数
    getDefaultProps(){
        return {
            filter: "default",
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

        this.props.navigator.push(
            {
                component: ShotDetails, // 要跳转的版块
                passProps: {shot},
                title: shot.title

            }
        );
    },


    _onFetch(page = 1, callback, options) {

        this.setState({ queryNumber: page });
        var query = this.state.filter;
        setTimeout(() => {
            api.getShotsByType(query,this.state.queryNumber)
                .catch((error) => {

                })
                .then((responseData) => {
                    console.log(responseData)
                    callback(responseData);
                })
                .done();


        }, 1000); // simulating network fetching
    },

    _onEndReached(){

        this.refs.listView._onPaginate()
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
    _renderRowView(rowData,sectionID,rowID) {
        return (
            <TouchableOpacity key={"sectionID_"+sectionID+"_rowID_"+rowID} onPress={()=>{this.pushToDetail(rowData)}}>
                <View
                    style={styles.cellViewStyle}>
                    {/*<Image*/}
                        {/*source={getImage.shotImage(rowData)}*/}
                        {/*style={styles.imgStyle}*/}
                    {/*/>*/}
                    {/*indicator={Progress.CircleSnail}*/}
                    {/*indicatorProps={{*/}
                    {/*color: ['red', 'green', 'blue']*/}
                    {/*}}*/}
                    <Image
                        source={getImage.shotImage(rowData)}

                        style={styles.imgStyle}
                    />
                </View>
            </TouchableOpacity>
        );
    },



    /**
     * Render the refreshable view when waiting for refresh
     * On Android, the view should be touchable to trigger the refreshCallback
     * @param {function} refreshCallback The function to call to refresh the listview
     */
    _renderRefreshableWaitingView(refreshCallback) {
        this.setState({ queryNumber: 0 })
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
    _renderSeparatorView(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View key={sectionID + rowID} style={customStyles.separator} />
        );
    },

    renderOption(option, selected, onSelect, index){
    const style = selected ? { marginLeft:3,marginBottom:3, marginRight:3,overflow: 'hidden',borderWidth: 1, borderColor: '#2d4486',borderRadius: 12,padding: 3,backgroundColor:'#2d4486',marginTop: 5} : {marginTop: 5,marginLeft:3,marginBottom:3, marginRight:3,padding: 3};
    const textStyle = selected ? { textAlign: 'center',color:'white'} : {color:'#666666',textAlign: 'center'};

        return (
            <TouchableOpacity onPress={onSelect} key={index}>
                <View style={style}>
                    <Text style={textStyle}>{option}</Text>
                </View>

            </TouchableOpacity>
    );

    },

    setSelectedOption(selectedOption){
        // 设置tag
        this.setState({
            selectedOption
         });
        this.refs.listView._scrollToTop();
        this.setState({filter: selectedOption}, () => {
            console.log(this.state.filter);
            this.refs.listView._refresh();
        });

    },


    render(){

        const options = [
            "shots",
            "debuts",
            "teams",
            "playoffs",
            "rebounds",
            "animated",
            "attachments",
        ];



        function renderContainer(optionNodes){
            return <View style={{flexDirection: 'row'}}>{optionNodes}</View>;
        }

        return (


                <View style={screenStyles.container}>

                    <ScrollView
                        ref='ScrollView'
                        automaticallyAdjustContentInsets={true}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={{height: 35}}>
                        <RadioButtons
                            style={{flexDirection: 'row',height: 35,padding: 10}}
                            options={ options }
                            selectedIndex={0}
                            onSelection={ this.setSelectedOption}
                            selectedOption={this.state.selectedOption }
                            renderOption={ this.renderOption }
                            renderContainer={renderContainer}
                        />
                    </ScrollView>

                        <GiftedListView
                            style={{height: screen.height-35}}
                            ref= 'listView'
                            rowView={this._renderRowView}
                            onFetch={this._onFetch}
                            initialListSize={10} // the maximum number of rows displayable without scrolling (height of the listview / height of row)
                            //headerView={this._renderHeaderView}
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
                            enableEmptySections={true}


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
    scrollView:{
        height: 30
    },
    horizontalScrollView: {
        height: 40,
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
