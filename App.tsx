import React, { Component } from 'react';
import { View, Text, ImageBackground} from 'react-native';
import Nav from "./src/nav"
import TabBar from './src/utils/tabbar';
const App = () => {
   
      return (
         <ImageBackground 
            source={require('./images/background.jpg')} // 对于本地图片
             // 或者使用 {uri: 'http://example.com/background-image.jpg'} 对于网络图片
            style={{flex: 1,
                width: '100%',
                height: '100%'
            }}
            >
         <View style={{flex:1}}>
            <Nav></Nav>
         </View>
         
         </ImageBackground>
      );
   }

export default App;