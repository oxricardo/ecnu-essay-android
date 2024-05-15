import * as React from 'react';
import { View, Text, Button, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./pages/account/login";
import Index from "./pages/account/login/index";
import Signup from "./pages/account/Signup";
import HomePage from "./pages/home/HomePage";
import BottomTabBar from './utils/tabbar';
import EssayListScreen from "./pages/essay_list"
import essay from "./pages/essay"
import ChangePassword from "./pages/ChangePassword";
import AddHomework from "./pages/AddHomework";
import SubmitEssayScreen from "./pages/SubmitEssay";
import Detail from "./pages/detail";

const Stack = createNativeStackNavigator();



function Nav() {
  return (

    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerTransparent: true, // 使header透明
        headerStyle: {
          borderBottomWidth: 0, // 移除底部边框
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      >
        <Stack.Screen
          name="小花狮"
          component={Index}
          options={{ headerShown: false }} // 这里隐藏头部导航
        />
        {/* 其他屏幕配置 */}
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: '注册' }} // 同样隐藏头部导航
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }} // 同样隐藏头部导航
        />
        <Stack.Screen
          name="essay_list"
          component={EssayListScreen}
          options={{ headerShown: false }} // 同样隐藏头部导航
        />
        <Stack.Screen
          name="AddHomework"
          component={AddHomework}
          options={{ title: '随笔天地' }}
        />
        <Stack.Screen
          name="SubmitEssay"
          component={SubmitEssayScreen} // 确保已经导入了SubmitEssayScreen组件
          options={{
            title: '提交随笔',
          }}
        />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="detail" component={Detail} options={{title:'批改详情'}}/>
        <Stack.Screen
            name="essay"
            component={essay}
            options={{
                title: '作业详情',
                headerStyle: {
                  backgroundColor: 'transparent', // 设置导航栏背景为透明
                  elevation: 0, // 针对 Android，移除阴影
                  shadowOpacity: 0, // 针对 iOS，移除阴影
                },
                headerTintColor: '#fff', // 设置标题颜色为白色
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerBackTitle: '返回',
                headerTransparent: true, // 设置头部导航栏透明
                // 如果需要隐藏头部导航栏
                // headerShown: false,
              }}
        />


        <Stack.Screen name="Main" component={BottomTabBar} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

     
  )
}

export default Nav;
