import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Alert, ScrollView, TextInput, Button, ActivityIndicator,Image} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiUrl } from '../utils/api';
import qs from 'qs'
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';



const Essay = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { name, description, startTime, endTime, studentId, homeworkId, status } = route.params;
  const [imageSource, setImageSource] = useState(null); // 存储图片的URI
  const [showImage, setShowImage] = useState(false); // 控制图片显示
  const [ocrText, setOcrText] = useState(''); // OCR文本
  const [showOcrText, setShowOcrText] = useState(false); // 是否显示OCR文本
  const [showSubmissionButtons, setShowSubmissionButtons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCorrectionButton, setShowCorrectionButton] = useState(false);

  const API_KEY = 'NUzCM0TKAEGjYpYChbv6znrZ';
  const SECRET_KEY = '47cxcYpeqbIEE1wdL0hnOd0NDjUon50l';

  // 动态获取access_token
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

  // 进行OCR文本识别
  const performOCR = async (base64Image) => {
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
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Error', 'OCR识别失败');
    }
  };


   const handleSelectPhoto = () => {
       ImagePicker.openPicker({
           width: 300,  // 裁切后图片的宽度
           height: 400,  // 裁切后图片的高度
           cropping: true,  // 启用裁切
           includeBase64: true,  // 返回的图片数据包含base64编码
       }).then(image => {
           //console.log(image);
           const source = { uri: `data:${image.mime};base64,${image.data}` };
           setImageSource(source);  // 设置图片显示
           // 可以在这里调用performOCR，传递image.data作为参数
           setShowImage(true);
           performOCR(image.data);


       }).catch(error => {
           console.log("ImagePicker error", error);
           if(error !== 'E_PICKER_CANCELLED'){
               Alert.alert('错误', '无法选择图片');
           }
       });
   };

  // 处理提交作业，即显示OCR文本
  const handleSubmit = () => {
    if (!imageSource) {
      Alert.alert('提示', '请先选择图片进行OCR识别');
      return;
    }
    setShowOcrText(true); // 显示OCR文本，隐藏图片
    setShowImage(false);
    setShowSubmissionButtons(true);
  };
  const handleResubmit = () => {
      // 重置状态到初始状态
      setImageSource(null);
      setOcrText('');
      setShowOcrText(false);
      setShowSubmissionButtons(false);
    };

    // 处理提交到后端逻辑
    const handleSubmitToBackend = async () => {
      setIsLoading(true);
      try {
        await axios.post(`${apiUrl}/api/submission/submit`, qs.stringify({
          studentId: studentId, //
          homeworkId: homeworkId, //
          path: 'test', // 根据需要调整
          content: ocrText,
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',


          },
        });
        Alert.alert('提交成功', '作业已成功提交。');
        setShowCorrectionButton(true);
      } catch (err) {
        console.error('提交失败', err);
        Alert.alert('提交失败', '无法提交作业。');
      }
      finally {
            setIsLoading(false); // 隐藏加载动画
      }
    };
  const handleViewCorrection = () => {
      navigation.navigate('detail', { studentId, homeworkId, name, status, description, startTime, endTime});
    };
  return (
      <ImageBackground
        style={styles.container}
        source={require('../../images/background.jpg')}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.time}>起始时间：{startTime}</Text>
            <Text style={styles.time}>终止时间：{endTime}</Text>
            {showImage && imageSource && (
               <Image
                   source={imageSource}
                   style={styles.selectedImage} // 定义并添加selectedImage样式
               />
            )}
            <View style={styles.buttonContainer}>
              {!showOcrText && (
                <Button title="选择图片" onPress={handleSelectPhoto} color="#42C0D7" />
              )}
              <Button title="识别作业" onPress={handleSubmit} color="#42C0D7" />
            </View>
            {showOcrText && (
              <TextInput
                style={styles.ocrText}
                multiline
                editable={true}
                onChangeText={text => setOcrText(text)}
                value={ocrText}
              />
            )}
            {showSubmissionButtons && (
                  <>
                       <Button title="重新提交" onPress={handleResubmit} color="#42C0D7" />
                       <Button title="作业提交" onPress={handleSubmitToBackend} color="#42C0D7" />
                 </>
            )}
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
             {showCorrectionButton && (
                 <Button title="查看批改结果" onPress={handleViewCorrection} color="#42C0D7" />
                 )}

          </View>
        </ScrollView>
      </ImageBackground>
    );
  };

  const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // 半透明的白灰色背景
        borderRadius: 10,
        padding: 20,
        marginTop: 50, // 向下移动卡片
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      },
    container: {
      flex: 1,
    },
    selectedImage: {
      width: '100%', // 图片宽度占满容器宽度
      height: 200, // 设定一个固定高度
      resizeMode: 'contain', // 保证图片完整显示
      marginBottom: 20, // 和下一个元素保持距离
    },
    scrollContainer: {
      padding: 20,
    },

    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'aqua',
      textAlign: 'center',
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      color: '#333',
      marginBottom: 10,
    },
    time: {
      fontSize: 14,
      color: 'aqua',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    ocrText: {
      backgroundColor: '#f9f9f9',
      minHeight: 100,
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
      color: '#333',
    },
  });

  export default Essay;

