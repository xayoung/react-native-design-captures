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
    Dimensions
} from 'react-native';

import AnimatedSegmentedControl from 'react-native-animated-segmented-control';
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
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            filter: this.props.filter,
            queryNumber: 0,
            items: [
                { label: 'Item1', checked: true },
                { label: 'Item2', checked: true },
                { label: 'Item3', checked: true },
                { label: 'Item4', checked: true },
                { label: 'Item5', checked: true },
                { label: 'Item6', checked: true },
            ]
        };
    },

    componentWillMount() {
        this.getShots(this.state.filter);
    },

    //网络请求
    getShots(query){
        var cachedResultsForQuery = resultsCache.dataForQuery[query];

        this.setState({
            isLoading: true,
            queryNumber: this.state.queryNumber + 1,
            isLoadingTail: false,
        });

        console.log(query);
        api.getShotsByType(query, 1)
            .then((responseData) => {
                // LOADING[query] = false;
                console.log( "请求" + responseData);
                resultsCache.dataForQuery[query] = responseData;
                resultsCache.nextPageNumberForQuery[query] = 2;
                // this.getDataSource(responseData);

                this.setState({

                    dataSource: this.getDataSource(responseData),
                });
            })

            .catch((error) => {
                // LOADING[query] = false;

                // resultsCache.dataForQuery[query] = undefined;
                //
                // this.setState({
                //     dataSource: this.getDataSource([]),
                // });
            })

    },

    //获取数据源
    getDataSource(shots){
        return this.state.dataSource.cloneWithRows(shots);

        // // 定义临时变量
        // var headerArr = [], listDataArr = [];
        // // 遍历拿到的json数据
        // for(var i=0; i<shots.length; i++){
        //     // 取出单独的对象
        //     var data = shots[i];
        //     console.log(data);
        //     listDataArr.push(data);
        //
        // }
        //
        // // 更新状态机
        // this.setState({
        //     // ListView头部的数据源
        //     headerDataArr: headerArr,
        //     // cell的数据源
        //     dataSource: this.state.dataSource.cloneWithRows(listDataArr)
        // });

    },

    renderRow(rowData){
        console.log(rowData);
        return(
        <TouchableOpacity onPress={()=>{this.pushToDetail(rowData)}}>
            <View style={styles.cellViewStyle}>
                {/*左边*/}
                <Image  source={getImage.shotImage(rowData)} style={styles.imgStyle}/>
            </View>
        </TouchableOpacity>

        );
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

    hasMore() {
        var query = this.state.filter;
        if (!resultsCache.dataForQuery[query]) {
            return true;
        }
        return (
            resultsCache.totalForQuery[query] !==
            resultsCache.dataForQuery[query].length
        );
    },

    onEndReached() {
        var query = this.state.filter;
        if (!this.hasMore() || this.state.isLoadingTail) {
            // We"re already fetching or have all the elements so noop
            return;
        }



        this.setState({
            queryNumber: this.state.queryNumber + 1,

        });

        var page = resultsCache.nextPageNumberForQuery[query];
        api.getShotsByType(query, page)
            .catch((error) => {

            })
            .then((responseData) => {
                var shotsForQuery = resultsCache.dataForQuery[query].slice();


                // We reached the end of the list before the expected number of results
                if (!responseData) {
                    resultsCache.totalForQuery[query] = shotsForQuery.length;
                } else {
                    for (var i in responseData) {
                        shotsForQuery.push(responseData[i]);
                    }
                    resultsCache.dataForQuery[query] = shotsForQuery;
                    resultsCache.nextPageNumberForQuery[query] += 1;
                }

                this.setState({

                    dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
                });
            })
            .done();
    },


    render(){
        const { items } = this.state;

        const switches = items.map((item, idx) => (
            <View key={idx} style={styles.switch}>
                <Text>{item.label}</Text>
                <Switch
                    value={item.checked}
                    onValueChange={(val) => {
                        item.checked = val;
                        this.setState({ items });
                    }}
                />
            </View>
        ));
        return(
            <View style={styles.mainViewStyle}>
                <View style={styles.container}>
                    <AnimatedSegmentedControl
                        style={styles.control}
                        borderWidth={1}
                        borderRadius={20}
                        borderColor="rgba(229,163,48,1)"
                        backgroundColor="rgba(229,163,48,1)"
                        textColor="#fff"
                        textPadding={10}
                        selectedBackgroundColor="#fff"
                        selectedTextColor="rgba(229,163,48,1)"
                        values={items.filter((item) => item.checked).map((item) => item.label)}
                    />
                    {switches}
                </View>


                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    onEndReached={this.onEndReached}
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>

        );
    },

});

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
