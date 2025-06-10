import { Ionicons } from '@expo/vector-icons';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const SUGGESTED_PHRASES = [
  'What do I need a shaker for?',
  'What are the best gifts for my best friends?',
  'What are the best sustainable shoes?',
];

import Vapi from '@vapi-ai/react-native';

const key = process.env.EXPO_PUBLIC_VAPI_KEY as string;
const vapi = new Vapi(key);

const Page = () => {
  const onPhrasePress = (phrase: string) => {
    console.log(phrase);
  };

  const onMicPress = () => {
    console.log('mic pressed');
  };

  const startCall = async () => {
    console.log('start call...');
    vapi.start({
      model: {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant.',
          },
        ],
      },
      voice: {
        provider: '11labs',
        voiceId: 'burt',
      },
    });
  };
  return (
    <View className="flex-1 bg-white pb-safe">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold mb-6 text-center">
          What do you need help with today?
        </Text>
      </View>
      {/* Suggested phrases */}
      <View className="px-4 pb-2">
        <View className="flex-row flex-wrap gap-2 justify-center mb-2">
          {SUGGESTED_PHRASES.map((phrase, idx) => (
            <TouchableOpacity
              key={idx}
              className="bg-blue-100 px-3 py-2 rounded-full mb-2"
              activeOpacity={0.7}
              onPress={() => onPhrasePress(phrase)}>
              <Text className="text-blue-700 font-medium text-sm">{phrase}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* Input with mic icon */}
      <View className="px-4 pb-6">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 shadow-md">
          <TextInput
            className="flex-1 text-base"
            placeholder="Ask Rufus a question"
            placeholderTextColor="#888"
            style={{ minHeight: 40 }}
          />
          <TouchableOpacity className="ml-2" onPress={onMicPress}>
            <Ionicons name="mic-outline" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Page;
