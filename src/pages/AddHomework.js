import { apiUrl } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import axios from 'axios';


const AddHomeworkScreen = ({ navigation }) => {
  const [essays, setEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEssays();
  }, []);

  const fetchEssays = async () => {
    const studentId = 1013; // 设置studentId
    const informalId = 218; // 设置informalId
    try {
      const response = await axios.get(`${apiUrl}/api/evaluation`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          homeworkId: informalId,
          studentId: studentId
        }
      });

      const data = response.data.value.evaluations.map((item, index) => ({
        id: index,
        title: item.title,
        content: formatTime(item.submissionTime)
      }));

      // 反转数组以倒序排列
      const reversedData = data.reverse();

      setEssays(reversedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch essays:', error);
      setIsLoading(false);
    }
  };



  const formatTime = (time) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const handleAddEssay = () => {
    navigation.navigate('SubmitEssay');
  };

//  const renderEssayItem = ({ item }) => (
//    <View style={styles.essayContainer}>
//      <Text style={styles.essayTitle}>{item.title}</Text>
//      <Text style={styles.essayContent}>{item.content}</Text>
//    </View>
//  );
  const renderEssayItem = ({ item }) => (
      <TouchableOpacity
        style={styles.essayContainer}
        onPress={() => navigation.navigate('detail', {
          studentId: 1013,
          homeworkId: 218,
          name: item.title,
          status: 1 // 这里的状态可以根据实际情况调整
        })}
      >
        <Text style={styles.essayTitle}>{item.title}</Text>
        <Text style={styles.essayContent}>{item.content}</Text>
      </TouchableOpacity>
    );

  return (
    <ImageBackground source={require('../../images/background.jpg')} style={styles.imageBackground}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEssay}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={essays}
            renderItem={renderEssayItem}
            keyExtractor={(item) => item.id.toString()}  // 确保 key 是字符串
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  addButton: {
    borderWidth: 1,
    borderColor: 'aqua',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'aqua',
    fontSize: 30,
    fontWeight: 'bold',
  },
  essayContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'aqua',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  essayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'aqua',
  },
  essayContent: {
    fontSize: 14,
    color: 'aqua',
  },
});

export default AddHomeworkScreen;
