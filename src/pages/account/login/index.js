import React, { Component } from 'react';
import { View, Text, Image, StatusBar, Alert, ImageBackground, StyleSheet } from 'react-native';
import { pxToDp } from '../../../utils/stylesKits';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import validator from "../../../utils/validator";
//import React, { useState } from 'react';
import request from "../../../utils/request";
import { Signup } from "../../Signup";
import { HomePage } from "../../home/HomePage"
import AsyncStorage from '@react-native-async-storage/async-storage';


class Index extends Component {
    state = {
        phoneNumber: "999999",
        phoneValid: true,
        password: "123456", // 新增密码状态
        passwordValid: true, // 新增密码验证状态
        showPassword: false,
    };

    // 登录框手机号码输入
    phoneNumberChangeText = (phoneNumber) => {
        this.setState({ phoneNumber });
        console.log(phoneNumber);
    };

    // 手机号码点击完成
    phoneNumberSubmitEditing = () => {
        /**
         * 手机号码合法性校验
         */
        const { phoneNumber } = this.state;
        // const phoneValid = validator.validatePhone(phoneNumber);
        // this.setState({ phoneValid });
    };

    // 密码输入修改
    passwordChangeText = (password) => {
        this.setState({ password });
    };


    handleLogin = async () => {
        const { phoneNumber, password } = this.state;
        if (password.length === 0) {
            Alert.alert('提示', '请输入密码');
            return;
        }

        try {
            //console.log(request.baseURL);
            //console.log("requesting...");
            const res = await request.get('https://essay.cubenlp.com/api/logsys/login', {
                params: {
                    tel: parseInt(phoneNumber, 10),
                    password: password
                }
            });
            console.log(res.data.id);

            if (res.status === 200) {
                console.log('登录成功', res);
                let cookie = res.cookies; // 获取响应中的cookie
                await AsyncStorage.setItem('id', res.data.id.toString());
                // 只有当cookie存在时才存储
                if (cookie) {
                    await AsyncStorage.setItem('cookie', cookie[0]);
                } else {
                    // 可选：如果cookie不存在，可以选择不做任何操作，或存储一个默认值
                    console.log("Cookie不存在，跳过存储");
                    // await AsyncStorage.setItem('cookie', "默认值或空字符串");
                }
                await AsyncStorage.setItem('userInfo', JSON.stringify(res.data));
                this.props.navigation.replace('Main');
            } else {
                Alert.alert('登录失败', res.data.message || '未知错误');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('请求异常', error.toString());

        }
    };



    toggleShowPassword = () => {
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
    };

    render() {
        const { phoneNumber, phoneValid, password, passwordValid, showPassword } = this.state;

        return (
            <ImageBackground
                source={require('../../../../images/background.jpg')}
                style={{ flex: 1, width: '100%', height: '100%' }}
            >
                <StatusBar backgroundColor="transparent" translucent={true} />

                <View style={styles.upperContainer}>
                    <Text style={styles.mainTitle}>小花狮中文作文智能批改系统</Text>

                </View>

                <View style={styles.loginContainer}>
                    <Input
                        placeholder='请输入手机号码'
                        maxLength={11}
                        keyboardType='phone-pad'
                        value={phoneNumber}
                        inputStyle={{ color: "#42C0D7" }}
                        onChangeText={this.phoneNumberChangeText}
                        errorMessage={phoneValid ? "" : "手机号码格式不正确"}
                        onSubmitEditing={this.phoneNumberSubmitEditing}
                        leftIcon={{ type: 'font-awesome', name: 'phone', color: "#ccc", size: pxToDp(20) }}
                    />

                    <Input
                        placeholder='请输入密码'
                        secureTextEntry={!showPassword}
                        value={password}
                        inputStyle={{ color: "#42C0D7" }}
                        onChangeText={this.passwordChangeText}
                        errorMessage={passwordValid ? "" : "密码格式不正确"}
                        leftIcon={{ type: 'font-awesome', name: 'lock', color: "#ccc", size: pxToDp(20) }}
                        rightIcon={{
                            type: 'font-awesome',
                            name: showPassword ? 'eye' : 'eye-slash',
                            color: "#ccc",
                            size: pxToDp(20),
                            onPress: this.toggleShowPassword,
                        }}
                    />

                    <Button
                        title="登录"
                        onPress={this.handleLogin}
                        buttonStyle={{
                            height: pxToDp(40),
                            borderRadius: pxToDp(20),
                            color: '#42C0D7',
                        }}
                        containerStyle={{
                            marginTop: pxToDp(30),
                            width: "95%",
                            alignSelf: "center",
                        }}
                    />

                    <Button
                        title="没有账号？注册新账号"
                        type="clear"
                        onPress={() => this.props.navigation.navigate('Signup')}
                    />
                </View>

                <View style={styles.lowerContainer}>
                    {/* 如果需要，这里可以放置额外的元素 */}
                </View>

            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    upperContainer: {
        flex: 1, // 占据剩余空间的1/3
        justifyContent: 'flex-end', // 将内容推向底部
        alignItems: 'center',
    },
    loginContainer: {
        flex: 2, 
        
    justifyContent: 'center', // 内容垂直居中
    alignItems: 'center', // 内容水平居中
},
    lowerContainer: {
    flex: 1, // 占据剩余空间的1/3
},
    item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'aqua',
},
    title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "aqua"
},
    time: {
    fontSize: 12,
    color: 'white'
},
    mainTitle: {
        fontSize: 24,
        color: 'aqua',
        fontWeight: 'bold',
},
    status: {
    fontSize: 14,
},
    imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
},
    });

export default Index;