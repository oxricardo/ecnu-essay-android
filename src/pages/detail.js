import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { apiUrl } from '../utils/api';

const Detail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { studentId, homeworkId, name, status } = route.params;
  const [evaluation, setEvaluation] = useState(null);
  const [expandedParagraphIndex, setExpandedParagraphIndex] = useState(null);
  const [expandedSentenceIndex, setExpandedSentenceIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchEvaluationDetails();
  }, []);

  const fetchEvaluationDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/evaluation`, {
        params: { studentId, homeworkId },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = response.data.value;
      if (data && data.evaluations && data.evaluations.length > 0) {
        setEvaluation(data.evaluations[data.evaluations.length - 1]);
      } else {
        throw new Error("No evaluations found");
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Fetch evaluation details error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchImages = async (essay) => {
      try {
        const { data } = await axios.post('https://essay.cubenlp.com/api/algorithm/aigc', { Body: {essay:data.evaluations.currText.join("\n") }});
        const imageList = data.map(img => ({ uri: `data:image/jpeg;base64,${img}` }));
        setImages(imageList);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        Alert.alert('Image Error', 'Failed to load AI-generated images.');
      }
    };

  const toggleParagraph = (index) => {
      if (expandedParagraphIndex === index) {
          setExpandedParagraphIndex(null); // 关闭当前段落
          setExpandedSentenceIndex(null); // 同时关闭任何展开的句子评价
      } else {
          setExpandedParagraphIndex(index);
          setExpandedSentenceIndex(null); // 关闭任何展开的句子评价
      }
  };

  const toggleSentence = (pIndex, sIndex) => {
      if (expandedSentenceIndex === sIndex && expandedParagraphIndex === pIndex) {
          setExpandedSentenceIndex(null);
      } else {
          setExpandedParagraphIndex(pIndex);  // 仍然记录当前段落
          setExpandedSentenceIndex(sIndex);   // 展开句子评价
      }
  };
  const getStatusTextAndColor = (status) => {
    switch (status) {
      case 0: return { text: '未提交', color: 'black' };
      case 1: return { text: '已提交', color: 'grey' };
      case 2: return { text: '已批改', color: 'green' };
      case 3: return { text: '已退回', color: 'red' };
      default: return { text: '状态未知', color: 'orange' };
    }
  };



  const navigateToEssay = () => {
    navigation.navigate('essay');
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!evaluation) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDetails}>No evaluation details available.</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../images/background.jpg')} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{evaluation.title}</Text>
        <Text style={[styles.info, { color: getStatusTextAndColor(status).color }]}>
           {name} | {getStatusTextAndColor(status).text}
        </Text>
        {evaluation.currText.map((paragraph, pIndex) => (
                  <View key={pIndex} style={styles.paragraph}>
                    <TouchableOpacity onPress={() => toggleParagraph(pIndex)}>
                      <Text style={styles.paragraphTitle}>第{pIndex + 1}段</Text>
                    </TouchableOpacity>
                    {paragraph.map((sentence, sIndex) => (
                      <TouchableOpacity key={sIndex} onPress={() => toggleSentence(pIndex, sIndex)}>
                        <Text style={styles.paragraphContent}>{sentence}</Text>
                      </TouchableOpacity>
                    ))}
                    {expandedParagraphIndex === pIndex && evaluation.aiEvaluation.paragraphEvaluations[pIndex] && (
                      <Text style={styles.paragraphEvaluation}>{evaluation.aiEvaluation.paragraphEvaluations[pIndex].content}</Text>
                    )}
                    {expandedParagraphIndex === pIndex && expandedSentenceIndex !== null && evaluation.aiEvaluation.sentenceEvaluations[pIndex][expandedSentenceIndex] && (
                      <Text style={styles.sentenceEvaluation}>{evaluation.aiEvaluation.sentenceEvaluations[pIndex][expandedSentenceIndex].type.level1}</Text>
                    )}
                  </View>
                ))}
                <ScrollView horizontal style={styles.imageContainer}>
                          {images.map((img, index) => (
                            <Image key={index} style={styles.image} source={img} />
                          ))}
                        </ScrollView>
        {['wordSentenceDescription', 'expressionDescription', 'fluencyDescription', 'suggestionDescription', 'description'].map((key, index) => (
          <View key={index} style={styles.evaluationContainer}>
            <Text style={styles.evaluationTitle}>{evaluationTitles[key]}</Text>
            <Text style={styles.evaluationText}>{evaluation.aiEvaluation[key]}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.submitButton} onPress={navigateToEssay}>
          <Text style={styles.submitButtonText}>重新提交</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const evaluationTitles = {
  wordSentenceDescription: '好词好句',
  expressionDescription: '逻辑表达',
  fluencyDescription: '流畅度',
  suggestionDescription: '修改建议',
  description: '作文总评'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  info: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginVertical: 5,
  },
  paragraph: {
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 20,
  },
  paragraphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'aqua',
    marginBottom: 5,
  },
  paragraphContent: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: 'aqua',
  },
  sentenceEvaluation: {
    color: 'red',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 3,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
  },
  paragraphEvaluation: {
    marginTop: 5,
    fontSize: 14,
    color: 'aqua',
    fontStyle: 'italic',
  },
  evaluationContainer: {
    borderWidth: 2,
    borderColor: 'aqua',
    padding: 10,
    marginBottom: 20,
  },
  evaluationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'aqua',
    textAlign: 'center',
    marginBottom: 5,
  },
  evaluationText: {
    color: 'white',
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDetails: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
  image: {
      width: 100,
      height: 100,
      marginRight: 10,
      borderRadius: 10,
   }
});

export default Detail;
