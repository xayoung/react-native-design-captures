/**
 * Created by xayoung on 11/7/16.
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
    ListView,
    Modal,
    Platform

} from 'react-native';

import Image from 'react-native-image-progress';
var HTMLView = require('react-native-htmlview')
import Icon from 'react-native-vector-icons/MaterialIcons';
var getImage = require("./../getImage");
import PhotoView from 'react-native-photo-view';

//请求api
var api = require("./../api"),
    screen = Dimensions.get('window');

var ProjectsDetail = React.createClass({
    //初始化参数
    getDefaultProps(){
        return {
            title: '',
            project: '',

        };
    },

    //状态机,datasource
    getInitialState(){
        return {
            selectImage:'',
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            show:false,
            transparent: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
    },

    componentDidMount() {
        api.getBehanceProjectResources(this.props.project.id).then((responseData) => {
            console.log(responseData)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.project.modules),
            });
        }).done();
    },

    render() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        };
        if (Platform.OS === 'ios')
            return(
                <View style={styles.mainView}>
                    {/*头部*/}

                    {/*ListView*/}
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        onScroll={(e)=>this.handleScroll(e)}
                        renderHeader={this.renderHeader}
                    />
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={this.state.show}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={[styles.mainView, modalBackgroundStyle]}>
                            <View style={{flexDirection: 'row-reverse', marginTop: 20}} >
                                <TouchableOpacity onPress={() => this.setModalVisible()}>
                                    <Icon name="clear" size={40} color='white' />
                                </TouchableOpacity>
                            </View>

                            <PhotoView
                                source={{uri:this.state.selectImage}}
                                minimumZoomScale={0.5}
                                maximumZoomScale={3}
                                androidScaleType="center"
                                onLoad={() => console.log("Image loaded!")}
                                style={{width: screen.width, height: 300}} />
                        </View>
                    </Modal>
                    <View style={styles.floatView}>
                        <TouchableOpacity
                            onPress={()=>this.props.navigator.pop()}>
                            <Icon name="keyboard-arrow-left" size={30} color='white' style={{marginTop: 5,marginLeft:3}}/>
                        </TouchableOpacity>

                    </View>
                </View>
                );
             else
                 return(
                  <View style={styles.mainView}>
                    {/*头部*/}

                    {/*ListView*/}
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        onScroll={(e)=>this.handleScroll(e)}
                        renderHeader={this.renderHeader}
                    />
                    <View style={styles.floatView}>
                        <TouchableOpacity
                            onPress={()=>this.props.navigator.pop()}>
                            <Icon name="keyboard-arrow-left" size={30} color='white' style={{marginTop: 5,marginLeft:3}}/>
                        </TouchableOpacity>

                    </View>
                </View>
                );

    },
    handleScroll(e) {
        // console.log('wtf')
        // console.log(e.nativeEvent);
        let scrollH = e.nativeEvent.contentSize.height;
        let y = e.nativeEvent.contentOffset.y;
        let height = e.nativeEvent.layoutMeasurement.height;
        // console.log('handle scroll', scrollH, y, height);

    },
    renderHeader(){
        return (
            <View>
                <View style={styles.headerViewStyle}>
                    <Image
                        source={getImage.coversOwnersImage(this.props.project)}
                        style={styles.headerImageStyle}
                    />
                    <View style={styles.headerViewRightView}>
                        <Text style={{fontSize: 18,marginRight:5}}>{this.props.project.name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 15}}>by</Text>
                            <Text style={{fontSize: 15, marginLeft: 5, color: 'pink'}}>{this.props.project.owners[0].display_name}</Text>
                        </View>
                    </View>

                </View>
                <View style={styles.shotDetailsRow}>
                    <View style={styles.shotCounter}>
                        <Icon name="favorite" size={20} color="#333"/>
                        <Text style={styles.shotCounterText}> {this.props.project.stats.appreciations} </Text>
                    </View>
                    <View style={styles.shotCounter}>
                        <Icon name="chat-bubble" size={20} color="#333"/>
                        <Text style={styles.shotCounterText}> {this.props.project.stats.comments} </Text>
                    </View>
                    <View style={styles.shotCounter}>
                        <Icon name="visibility" size={20} color="#333"/>
                        <Text style={styles.shotCounterText}> {this.props.project.stats.views} </Text>
                    </View>
                </View>
            </View>
        );
    },
    // 每一行的数据
    renderRow(rowData){
        if (rowData.type == 'image')
            return (
             <TouchableHighlight onPress={() => this.setModalVisible(rowData)}>
                <Image
                    source={getImage.projectImage(rowData)}
                    style={styles.imgStyle}
                />
             </TouchableHighlight>
            );
        else
            return (

            <View style={{ marginTop: 10,marginLeft: 10, marginBottom: 10,marginRight: 10}}>
                <HTMLView
                    value={rowData.text}
                    onLinkPress={(url) => console.log('clicked link: ', url)}
                />
            </View>
            );
    },
    // 显示/隐藏 modal
    setModalVisible(rowData) {
        console.log(rowData);
        if (rowData)
            this.setState({selectImage:rowData.src});

        this.setState({transparent: !this.state.transparent});
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });

    }
});

const styles = StyleSheet.create({
    headerViewStyle: {
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 60,
    },
    headerImageStyle: {
        width: 40,
        height: 40,
        marginLeft: 10

    },
    headerViewRightView: {
        flexDirection: 'column',
        marginLeft: 10
    },
    mainView: {
        flex: 1,
        position: 'absolute',
        width: screen.width,
        height: screen.height,
        backgroundColor: 'white',
    },
    imgStyle:{
        height: 300,
        width: screen.width,
        backgroundColor: "transparent",
        resizeMode: "cover"
    },
    floatView: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: 30,
        left: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2d4486',
        borderRadius: 20,
        backgroundColor: '#2d4486',
    },
    shotDetailsRow: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        flexDirection: "row",
        height: 30
    },
    shotCounter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row'
    },
    shotCounterText: {
        color: "#333"
    },

});

module.exports = ProjectsDetail;