/**
 * Created by xayoung on 9/6/16.
 */
import React, { Component } from 'react';
import {
    PixelRatio,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Dimensions,
    Scroll,
    Modal,
    Image,
    Platform,
    ListView
} from 'react-native';

var getImage = require("./../getImage"),
    api = require("./../api"),
    screen = Dimensions.get('window'),
    ParallaxView = require("react-native-parallax-view");
var HTMLView = require('react-native-htmlview')
import Icon from 'react-native-vector-icons/MaterialIcons';
import PhotoView from 'react-native-photo-view';


var ShotDetails = React.createClass({


    getInitialState() {
        return {
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

    getDefaultProps() {
        return{
            title: '',
            shot: ''
        }
    },


    componentDidMount() {
        api.getResources(this.props.shot.comments_url).then((responseData) => {
            console.log(responseData)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
            });
        }).done();
    },

    render() {
        var modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        };
        return (

            <View style={styles.mainView}>

                <ParallaxView
                    style={{flex: 1,height:screen.height}}
                    backgroundSource={getImage.shotHidpiImage(this.props.shot)}
                    windowHeight={300}
                    onScroll={(e)=>this.handleScroll(e)}
                    header={(

                        <TouchableHighlight onPress={() => this.setModalVisible()}>
                           <View style={styles.invisibleView}></View>
                       </TouchableHighlight>
                    )}
                >
                    <View style={styles.headerViewStyle}>
                        <Image
                            source={{uri: this.props.shot.user.avatar_url}}
                            style={styles.headerImageStyle}
                        />
                        <View style={styles.headerViewRightView}>
                            <Text style={{fontSize: 18}}>{this.props.shot.title}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 15}}>by</Text>
                                <Text style={{fontSize: 15, marginLeft: 5, color: 'pink'}}>{this.props.shot.user.name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.shotDetailsRow}>
                        <View style={styles.shotCounter}>
                            <Icon name="favorite" size={20} color="#333"/>
                            <Text style={styles.shotCounterText}> {this.props.shot.likes_count} </Text>
                        </View>
                        <View style={styles.shotCounter}>
                            <Icon name="chat-bubble" size={20} color="#333"/>
                            <Text style={styles.shotCounterText}> {this.props.shot.comments_count} </Text>
                        </View>
                        <View style={styles.shotCounter}>
                            <Icon name="visibility" size={20} color="#333"/>
                            <Text style={styles.shotCounterText}> {this.props.shot.views_count} </Text>
                        </View>
                    </View>

                    <View style={{flex: 1}}>
                        {this._renderCommentsList()}
                    </View>
                </ParallaxView>

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
                            source={getImage.shotHidpiImage(this.props.shot)}
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

        )
    },

    _renderCommentsList() {
        var commentsStyle;
        if (Platform.OS === 'ios')
            commentsStyle = 0;
        else
            commentsStyle = 20;
        return <View style={styles.sectionSpacing}>
            <View style={styles.separator} />
            <Text style={styles.heading}>Comments</Text>
            <View style={styles.separator} />
            <ListView
                ref="commentsView"
                style = {{marginBottom:commentsStyle}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                automaticallyAdjustContentInsets={false}
            />
        </View>
    },

    renderRow(comment,sectionID, rowID) {
        var b = rowID % 2;
        return (
            <View style={{backgroundColor: b == 0 ? 'white':'#eeeeee'}}>
                <View style={styles.commentTopView}>
                    <Image
                        source={{uri: comment.user.avatar_url}}
                        style={styles.commentImageStyle}
                    />
                    <Text style={{fontSize: 15, marginLeft: 10}}>{comment.user.name}</Text>
                </View>
                <View style={{ marginTop: 10,marginLeft: 40, marginBottom: 10}}>
                    <HTMLView
                        value={comment.body}
                        onLinkPress={(url) => console.log('clicked link: ', url)}
                    />
                </View>

            </View>

        );
    },

    // 显示/隐藏 modal
    setModalVisible() {
        this.setState({transparent: !this.state.transparent});
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }



});

var styles = StyleSheet.create({
    mainView: {
        flex: 1,
        position: 'absolute',
        width: screen.width,
        height: screen.height,
        backgroundColor: 'white'
    },
    invisibleView: {
        flex: 1,
        position: 'absolute',
        width: screen.width,
        height: 300,

    },
    headerViewStyle: {
        height: 60,
        alignItems: 'center',
        flexDirection: 'row'
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
    shotDetailsRow: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        flexDirection: "row",
        height: 20
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
    separator: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        height: 1 / PixelRatio.get(),
        marginVertical: 10,
    },
    sectionSpacing: {
        marginTop: 10
    },
    heading: {
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 10
    },
    commentImageStyle: {
        width: 20,
        height: 20,
        marginLeft: 10

    },
    commentTopView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
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

});

module.exports = ShotDetails;