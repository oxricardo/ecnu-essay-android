import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Index from '../account/login/index'
import Login from '../account/login'
const HomePage = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // 在这里实现退出登录的逻辑，比如清除用户数据等
    // ...

    // 使用 navigation.reset 重置导航栈并导航到登录页
//    navigation.reset({
//      index: 0,
//      routes: [{ name: 'index' }], // 'Index' 是你的登录页路由名称
//    });
        //navigation.goBack();
       navigation.reset({
       index: 0,
       routes: [{ name: '小花狮' }], // 确保这里使用的是登录页的正确路由名称
       });
  };
  const goToChangePassword = () => {
      navigation.navigate('ChangePassword'); // 使用定义的修改密码界面路由名称
    };

  return (
    <ImageBackground
      source={require('../../../images/background.jpg')}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        {/* 个人资料区域 */}
        <View style={styles.profileContainer}>
          <Image
            source={require('../../../images/elion.png')}
            style={styles.avatar}
          />
          <Text style={styles.userName}>用户名</Text>
          <Text style={styles.userDetail}>在校/在职老师/小学三年级B2班</Text>
        </View>

        {/* 功能按钮区域 */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>修改个人信息</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToChangePassword}>
            <Text style={styles.buttonText}>修改密码</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>退出登录</Text>
          </TouchableOpacity>
        </View>

        {/* 如果需要，这里可以放置其他 UI 元素 */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
      flex: 1,
      backgroundColor: 'transparent', // 背景透明以显示全屏背景图片
    },
    profileContainer: {
      alignItems: 'center',
      margin: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    userName: {
      fontSize: 22,
      color: "aqua",
      fontWeight: 'bold',
    },
    userDetail: {
      fontSize: 16,
      color: "aqua",
      marginBottom: 20,
    },
    buttonsContainer: {
      alignItems: 'center',
    },
    button: {
      backgroundColor: "aqua",
      padding: 15,
      borderRadius: 25,
      marginVertical: 10,
      width: 250,
      alignItems: 'center',
    },
    buttonText: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
    },
});

export default HomePage;