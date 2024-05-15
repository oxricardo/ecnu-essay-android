//import React, { useState } from 'react';
//import { View, TextInput, Text, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
//import { useNavigation } from '@react-navigation/native';
//
//const Signup = () => {
//  const [tel, setTel] = useState('');
//  const [password, setPassword] = useState('');
//  const [confirmPassword, setConfirmPassword] = useState('');
//  const [name, setName] = useState('');
//  const [classId, setClassId] = useState('');
//
//  const navigation = useNavigation();
//
//  const onFinish = () => {
//    // 验证输入和API调用逻辑...
//    console.log({
//      tel,
//      password,
//      confirmPassword,
//      name,
//      classId,
//    });
//    // 假设验证通过后跳转
//    navigation.goBack();
//  };
//
//  return (
//    <ImageBackground
//      source={require('../../../images/background.jpg')}
//      style={styles.background}
//    >
//      <KeyboardAvoidingView
//        behavior={Platform.OS === "ios" ? "padding" : "height"}
//        style={styles.container}
//      >
//        <Text style={styles.header}>注册</Text>
//        <View style={styles.inputContainer}>
//          <TextInput
//            placeholder="请输入手机号码"
//            placeholderTextColor="rgba(255,255,255,0.7)"
//            value={tel}
//            onChangeText={setTel}
//            style={styles.input}
//            keyboardType="phone-pad"
//          />
//          <View style={styles.divider} />
//          <TextInput
//            placeholder="密码"
//            placeholderTextColor="rgba(255,255,255,0.7)"
//            value={password}
//            onChangeText={setPassword}
//            secureTextEntry
//            style={styles.input}
//          />
//          <View style={styles.divider} />
//          <TextInput
//            placeholder="确认密码"
//            placeholderTextColor="rgba(255,255,255,0.7)"
//            value={confirmPassword}
//            onChangeText={setConfirmPassword}
//            secureTextEntry
//            style={styles.input}
//          />
//          <View style={styles.divider} />
//          <TextInput
//            placeholder="真实姓名"
//            placeholderTextColor="rgba(255,255,255,0.7)"
//            value={name}
//            onChangeText={setName}
//            style={styles.input}
//          />
//          <View style={styles.divider} />
//          <TextInput
//            placeholder="班级邀请码"
//            placeholderTextColor="rgba(255,255,255,0.7)"
//            value={classId}
//            onChangeText={setClassId}
//            style={styles.input}
//          />
//        </View>
//        <TouchableOpacity style={styles.signUpButton} onPress={onFinish}>
//          <Text style={styles.signUpButtonText}>注册</Text>
//        </TouchableOpacity>
//      </KeyboardAvoidingView>
//    </ImageBackground>
//  );
//};
//
//const styles = StyleSheet.create({
//  background: {
//    flex: 1,
//    width: '100%',
//    height: '100%',
//  },
//  container: {
//    flex: 1,
//    justifyContent: 'center',
//    padding: 20,
//  },
//  header: {
//    fontSize: 30,
//    color: 'white',
//    textAlign: 'center',
//    marginBottom: 24,
//  },
//  inputContainer: {
//    backgroundColor: 'rgba(255, 255, 255, 0.3)',
//    borderRadius: 10,
//  },
//  input: {
//    color: 'white',
//    paddingHorizontal: 15,
//    paddingVertical: 15,
//    fontSize: 16,
//  },
//  divider: {
//    height: 1,
//    backgroundColor: 'rgba(255, 255, 255, 0.7)',
//  },
//  signUpButton: {
//    backgroundColor: '#42C0D7',
//    borderRadius: 10,
//    marginTop: 16,
//    paddingVertical: 12,
//  },
//  signUpButtonText: {
//    textAlign: 'center',
//    color: 'white',
//    fontSize: 18,
//    fontWeight: 'bold',
//  },
//});
//
//export default Signup;
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';
import { apiUrl } from '../../utils/api'; // 请确保路径正确

const Signup = () => {
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');

  const isValidPhoneNumber = (phoneNumber) => {
    var pattern = /^1[3456789]\d{9}$/;
    return pattern.test(phoneNumber);
  };

  const onFinish = () => {
    // 确保所有字段都填写了
    if (!name || !tel || !password || !confirmPassword || !classId) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }
    // 校验手机号
    if (!isValidPhoneNumber(tel)) {
      Alert.alert('错误', '无效的手机号码');
      return;
    }
    // 确保密码匹配
    if (password !== confirmPassword) {
      Alert.alert('错误', '密码不匹配');
      return;
    }

    // 这里添加注册逻辑
    axios.post(`${apiUrl}/api/signupsys/signupStudent?class_id=${classId}`, {
      tel,
      password,
      role: "student",
      name
    }).then((response) => {
      if (response.status === 200) {
        Alert.alert('注册成功', '你已成功注册');
        // 你可以在这里处理注册成功后的逻辑，例如导航到登录页面
      }
    }).catch((error) => {
      console.log(error);
      Alert.alert('注册失败', '发生错误，请稍后再试');
    });
  };

  return (
    <ImageBackground
      source={require('../../../images/background.jpg')}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.header}>注册</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="请输入手机号码"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={tel}
            onChangeText={setTel}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <View style={styles.divider} />
          <TextInput
            placeholder="密码"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.divider} />
          <TextInput
            placeholder="确认密码"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.divider} />
          <TextInput
            placeholder="真实姓名"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <View style={styles.divider} />
          <TextInput
            placeholder="班级邀请码"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={classId}
            onChangeText={setClassId}
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={onFinish}>
          <Text style={styles.signUpButtonText}>注册</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  input: {
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  signUpButton: {
    backgroundColor: 'aqua',
    borderRadius: 10,
    marginTop: 16,
    paddingVertical: 12,
  },
  signUpButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Signup;
