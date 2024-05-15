import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

const SubmitEssay = () => {
  const navigation = useNavigation();
  const [imageSource, setImageSource] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIcons, setShowIcons] = useState(true);
  const API_KEY = 'NUzCM0TKAEGjYpYChbv6znrZ';
  const SECRET_KEY = '47cxcYpeqbIEE1wdL0hnOd0NDjUon50l';

  const getAccessToken = async () => {
    try {
      const response = await axios.post(`https://aip.baidubce.com/oauth/2.0/token`, null, {
        params: {
          grant_type: 'client_credentials',
          client_id: API_KEY,
          client_secret: SECRET_KEY,
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Access Token Error:', error);
      Alert.alert('Error', '获取access_token失败');
    }
  };

  const performOCR = async (base64Image) => {
    setIsLoading(true);
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        method: 'post',
        url: `https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token=${accessToken}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: `image=${encodeURIComponent(base64Image)}`,
      });

      const wordsResult = response.data.words_result;
      let text = wordsResult.map(item => item.words).join('\n');
      setOcrText(text);
      setShowIcons(false);
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Error', 'OCR识别失败');
    } finally {
      setIsLoading(false);
    }
  };

  const selectImageSource = () => {
      Alert.alert(
          '选择图片来源',
          '',
          [
              {
                  text: '取消',
                  onPress: () => console.log('取消'),
                  style: 'cancel'
              },
              {
                  text: '拍照',
                  onPress: () => handleCameraPhoto()
              },
              {
                  text: '从相册选择',
                  onPress: () => handleSelectPhoto()
              },
          ],
          { cancelable: false }
      );
  };

  const handleSelectPhoto = () => {
      ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64: true,
      }).then(image => {
          const source = { uri: `data:${image.mime};base64,${image.data}` };
          setImageSource(source);
      }).catch(error => {
          if(error !== 'E_PICKER_CANCELLED'){
              Alert.alert('Error', 'Unable to select image');
          }
      });
  };

  const handleCameraPhoto = () => {
      ImagePicker.openCamera({
          width: 600,
          height: 800,
          cropping: true,
          includeBase64: true,
      }).then(image => {
          const source = { uri: `data:${image.mime};base64,${image.data}` };
          setImageSource(source);
      }).catch(error => {
          Alert.alert('Error', 'Unable to take photo');
      });
  };

  const handleReselectImage = () => {
    setImageSource(null);
    setOcrText('');
    setShowIcons(true);
  };

  const handleSubmitToBackend = async () => {
    // 提交OCR识别后的文本到后端的逻辑
    Alert.alert("Success", "作业已成功提交。");
  };

  return (
    <ImageBackground
      source={require('../../images/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.essayTitle}>随笔</Text>
            <View style={styles.card}>
              {showIcons && (
                <>
                  <TouchableOpacity onPress={handleSelectPhoto} style={styles.selectImage}>
                    <Image source={require('../../images/addphoto.png')} style={styles.addPhotoIcon} />
                  </TouchableOpacity>

                </>
              )}
          {imageSource && (
            <Image source={imageSource} style={styles.selectedImage} />
          )}
          {!ocrText && (
              <TouchableOpacity onPress={() => performOCR(imageSource?.uri)} style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>识别作业</Text>
              </TouchableOpacity>
          )}

          {ocrText && (
            <>
              <TextInput
                style={styles.ocrText}
                multiline
                editable
                onChangeText={text => setOcrText(text)}
                value={ocrText}
              />
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={handleReselectImage} style={[styles.button, styles.reselectButton]}>
                  <Text style={[styles.buttonText, styles.reselectButtonText]}>重新选图</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmitToBackend} style={[styles.button, styles.submitButton]}>
                  <Text style={styles.buttonText}>提交作业</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
      margin: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      padding: 20,
      marginHorizontal: 0, // 使框宽一点
    },
    essayTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'aqua',
      textAlign: 'center',
      marginBottom: 20, // 标题与图片/文本框的间距
    },
  selectedImage: {
    width: '100%', // 图片宽度占满容器宽度
    height: 400, // 设定一个固定高度
    resizeMode: 'contain', // 保证图片完整显示
    marginBottom: 20, // 和下一个元素保持距离
  },
  ocrText: {
    backgroundColor: 'transparent', // 输入框的背景色
    minHeight: 150, // 最小高度
    padding: 15, // 内部填充
    borderRadius: 10, // 圆角边框
    borderWidth: 1, // 边框宽度
    borderColor: 'aqua', // 边框颜色
    marginTop: 10, // 与上方元素的距离
    fontSize: 16, // 文本大小
    color: 'white', // 文本颜色
  },
  selectImage: {
    marginBottom: 15, // 与下一个元素的距离
    alignItems: 'center',
  },
  addPhotoIcon: {
    width: 150, // 图标的宽度
    height: 150, // 图标的高度
  },
  selectImageText: {
    color: 'white', // 文本颜色
    fontSize: 16, // 文本大小
  },
  actionButtons: {
    flexDirection: 'row', // 横向排列
    justifyContent: 'space-between', // 两端对齐
    marginTop: 20, // 与上方元素的距离
  },
  reselectButton: {
    backgroundColor: 'white', // 按钮背景色
    paddingVertical: 10, // 垂直内部填充
    flex: 1, // 占满可用空间
    marginRight: 10, // 与右侧元素的距离
    borderColor: 'aqua', // 边框颜色
    borderWidth: 1, // 边框宽度
  },
  submitButton: {
      backgroundColor: 'green', // 按钮背景色
      paddingVertical: 10, // 垂直内部填充
      flex: 1, // 占满可用空间
    },
  reselectButtonText: {
    color: 'green', // 文本颜色，对于白色背景按钮内文本
    textAlign: 'center', // 文本居中
  },
  buttonText: {
    color: 'white', // 文本颜色，适用于绿色背景按钮
    textAlign: 'center', // 文本居中
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButton: {
      backgroundColor: 'green', // 按钮背景色
      paddingVertical: 10, // 垂直内部填充
      width: '80%', // 宽度调整为80%以适应屏幕
      alignSelf: 'center', // 按钮自身居中对齐
      borderRadius: 5, // 圆角效果
      marginTop: 20, // 与上方元素的距离
    },
    actionButtonText: {
      color: 'white', // 文本颜色
      fontWeight: 'bold', // 文本加粗
      textAlign: 'center', // 文本居中
      fontSize: 18, // 字体大小
    },
});


export default SubmitEssay;
