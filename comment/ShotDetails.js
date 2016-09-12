/**
 * Created by xayoung on 9/6/16.
 */
import React, { Component } from 'react';
import {
    PixelRatio,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Modal
} from 'react-native';


var getImage = require("./getImage"),
    screen = Dimensions.get('window'),
    ParallaxView = require("react-native-parallax-view");

var ShotDetails = React.createClass({

    getDefaultProps(){
        return{
            title: '',
            shot: ''
        }
    },

    render() {
        var player = this.props.shot.user;
        return (

                <ParallaxView
                    backgroundSource={getImage.shotHidpiImage(this.props.shot)}
                    windowHeight={300}
                    header={(
                        <TouchableOpacity onPress={() => this.openModal()}>
                            <View style={styles.invisibleView}></View>
                        </TouchableOpacity>
                    )}
                >
                    <Modal isVisible={this.state.isModalOpen}
                           onClose={() => this.closeModal()}>
                        <Image source={getImage.shotImage(this.props.shot)}
                               style={styles.customModalImage}
                               resizeMode="contain"/>
                    </Modal>
                </ParallaxView>





        )
    },
    openModal() {
        console.log('????')
        this.setState({
            isModalOpen: true
        })
    },

    closeModal() {
        this.setState({
            isModalOpen: false
        })
    }

});

var styles = StyleSheet.create({
    invisibleView: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
    },
    textContainer: {
        flex: 1,
        backgroundColor: "white"
    },
    playerAvatar: {
        borderRadius: 40,
        width: 80,
        height: 80,
        position: "absolute",
        bottom: 60,
        left: screen.width / 2 - 40,
        borderWidth: 2,
        borderColor: "#fff"
    },
    headerContent: {
        flex: 1,
        paddingBottom: 20,
        paddingTop: 40,
        alignItems: "center",
        width: screen.width,
        backgroundColor: "#fff"
    },
    shotTitle: {
        fontSize: 16,
        fontWeight: "400",
        color: "#ea4c89",
        lineHeight: 18
    },
    playerContent: {
        fontSize: 12
    },
    player: {
        fontWeight: "900",
        lineHeight: 18
    },
    customModalImage: {
        height: screen.height / 2
    },


});

module.exports = ShotDetails;