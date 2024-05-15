
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ImageBackground, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { apiUrl } from '../utils/api';
import request from '../utils/request'
import essay from "./essay";
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';


const initialLayout = { width: Dimensions.get('window').width };
// 时间格式化函数
const formatTime = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};
const getStatusText = (status) => {
  switch (status) {
    case 0: return '未提交';
    case 1: return '已提交';
    case 2: return '已批改';
    case 3: return '已退回';
    default: return '状态未知';
  }
};

// 单个作业项组件
const HomeworkItem = ({ data, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.title}>{data.name}</Text>
    <Text style={styles.time}>{formatTime(data.startTime)} - {formatTime(data.endTime)}</Text>
    <Text style={[styles.status, { color: getStatusColor(data.status) }]}>{getStatusText(data.status)}</Text>
  </TouchableOpacity>
);

// 根据作业状态获取显示颜色
const getStatusColor = (status) => {
  switch (status) {
    case 0: return 'black';
    case 1: return 'grey';
    case 2: return 'green';
    case 3: return 'red';
    default: return 'orange';
  }
};
const AllHomework = ({ homeworkList, handlePress }) => (
  <FlatList
    data={homeworkList}

    renderItem={({ item }) => <HomeworkItem data={item} onPress={() => handlePress(item)} />}
    keyExtractor={(item) => item.id.toString()}
  />
);

const SubmittedHomework = ({ homeworkList, handlePress }) => (
  <FlatList
    data={homeworkList.filter(item => item.status === 1 || item.status === 2)}
    renderItem={({ item }) => <HomeworkItem data={item} onPress={() => handlePress(item)} />}
    keyExtractor={(item) => item.id.toString()}
  />
);

const UnsubmittedHomework = ({ homeworkList, handlePress }) => (
  <FlatList
    data={homeworkList.filter(item => item.status === 0 || item.status === 3)}
    renderItem={({ item }) => <HomeworkItem data={item} onPress={() => handlePress(item)} />}
    keyExtractor={(item) => item.id.toString()}
  />
);



const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'aqua' }}
    style={{ backgroundColor: 'transparent' }}
    activeColor={'aqua'}
    inactiveColor={'grey'}
  />
);

// 作业列表屏幕组件
const EssayListScreen = () => {
  const [homeworkList, setHomeworkList] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
      { key: 'all', title: '全部' },
      { key: 'submitted', title: '已提交' },
      { key: 'unsubmitted', title: '未提交' },
    ]);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    getEssayList();
  }, []);
  // 获取作业列表
  const getEssayList = async () => {
    setRefreshing(true);
    const studentId = await AsyncStorage.getItem('id');
    const cookie = await AsyncStorage.getItem('cookie');

    try {
      const response = await request.get(`${apiUrl}/api/homework/studentHomework`, {
//        headers: {
//          'Content-Type': 'application/json',
//          'Cookie': cookie,
//        },
        params: { id: studentId },
      });
//      console.log(response)
      const reversedData = response.data.reverse();
      setHomeworkList(reversedData);
    } catch (error) {
      console.error('获取作业列表失败:', error);
    } finally {
      setRefreshing(false);
    }
  };


  const onRefresh = () => {
      setRefreshing(true);
      getEssayList().then(() => setRefreshing(false));
    };

  // 处理作业项点击事件
  const handlePress = (data) => {
    // 根据作业状态跳转到不同页面的逻辑
    if (data.status === 0) {
      // 如果状态为0，跳转到essay界面
      navigation.navigate('essay', {
        name: data.name,
        description: data.description,
        startTime: formatTime(data.startTime),
        endTime: formatTime(data.endTime),
        studentId: '1013',
        homeworkId: data.id,
        status: data.status,
      });
    } else {
      // 如果状态为1、2或3，跳转到detail界面
      navigation.navigate('detail', {
        name: data.name,
        description: data.description,
        startTime: formatTime(data.startTime),
        endTime: formatTime(data.endTime),
        studentId: '1013', // 示例ID，应从适当的存储中获取
        homeworkId: data.id,
        status: data.status,
      });
    }
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'all':
        return <AllHomework homeworkList={homeworkList} handlePress={handlePress} />;
      case 'submitted':
        return <SubmittedHomework homeworkList={homeworkList} handlePress={handlePress} />;
      case 'unsubmitted':
        return <UnsubmittedHomework homeworkList={homeworkList} handlePress={handlePress} />;
      default:
        return null;
    }
  };

  return (
      <ImageBackground source={require('../../images/background.jpg')} style={styles.imageBackground}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
          style={styles.tabview}
        />
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      </ImageBackground>
    );
  };

// 样式定义
const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabview: {
      marginTop: 50, // 根据你的需要调整
    },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "aqua"

  },
  time: {
    fontSize: 12,
    color: "aqua"
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

export default EssayListScreen;

