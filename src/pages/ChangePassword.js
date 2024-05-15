import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = () => {
    // 确保所有字段都填写了
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }
    // 确保新密码和确认新密码匹配
    if (newPassword !== confirmNewPassword) {
      Alert.alert('错误', '新密码和确认新密码不匹配');
      return;
    }

    // 这里添加修改密码的逻辑
    // 例如，调用API更新密码
    // 假设更新成功
    Alert.alert('成功', '密码已更新');
    // 可以在这里处理密码更新成功后的逻辑，例如导航回上一页
  };

  return (
    <ImageBackground
      source={require('../../images/background.jpg')}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.header}>修改密码</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="旧密码"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.divider} />
          <TextInput
            placeholder="新密码"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.divider} />
          <TextInput
            placeholder="确认新密码"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
          <Text style={styles.changePasswordButtonText}>提交</Text>
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
  changePasswordButton: {
    backgroundColor: 'aqua',
    borderRadius: 10,
    marginTop: 16,
    paddingVertical: 12,
  },
  changePasswordButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePassword;
