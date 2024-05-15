
import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EssayList from '../pages/essay_list'; // 注意组件名的命名习惯
import HomePage from '../pages/home/HomePage';
import AddHomework from "../pages/AddHomework";

const Tab = createBottomTabNavigator();

function BottomTabBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center', // 将标题置于屏幕顶部中央
        headerTransparent: true, // 使标题栏透明
        headerTitleStyle: {
          color: 'transparent' // 隐藏默认的标题文本
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconPath;

          if (route.name === 'Homework') {
            iconName = focused ? require('../../images/homework_active.png') : require('../../images/homework.png');
          } else if (route.name === 'Profile') {
            iconName = focused ? require('../../images/userpage_active.png') : require('../../images/userpage.png');
          }else if (route.name === 'AddHomework') {
            iconName = focused ? require('../../images/stu_essay.jpg') : require('../../images/stu_essay.jpg');
          }

          // 使用Image组件加载本地图片
          return <Image source={iconName} style={{ width: 20, height: 20 }} />;
        },
        tabBarActiveTintColor: "#42C0D7",
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'black', // 完全透明背景
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
      })}
    >
      <Tab.Screen name="Homework" component={EssayList} options={{ title: '作业批改' }} />
      <Tab.Screen name="AddHomework" component={AddHomework} options={{ title: '随笔天地' }}/>
      <Tab.Screen name="Profile" component={HomePage} options={{ title: '个人中心' }} />
    </Tab.Navigator>
  );
}

export default BottomTabBar;
