import { CALL_STATUS, useVapi } from '@/hooks/useVapi';
import { MessageTypeEnum } from '@/utils/conversation.types';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SUGGESTED_PHRASES = [
  'What do I need a shaker for?',
  'What are the best gifts for my best friends?',
  'What are the best sustainable shoes?',
];

const Rufus = () => {
  const { startCall, callStatus, messages, send } = useVapi();

  const onPhrasePress = async (phrase: string) => {
    if (callStatus !== CALL_STATUS.ACTIVE) {
      await startCall('workflow');
    }
    send(phrase);
  };

  return (
    <ScrollView className="flex-1 bg-white pb-safe">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold mb-6 text-center">
          What do you need help with today?
        </Text>
      </View>

      <View className="flex-1 px-4">
        {messages
          .filter((m) => m.type === MessageTypeEnum.TRANSCRIPT)
          .map((message, index) => (
            <View
              key={index}
              className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <View
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === 'user' ? 'bg-orange-300' : 'bg-gray-200'
                }`}>
                <Text className={`text-sm text-gray-800`}>{message.transcript}</Text>
              </View>
            </View>
          ))}
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

          <TouchableOpacity className="ml-2" onPress={() => startCall('workflow')}>
            <Ionicons
              name={callStatus === CALL_STATUS.ACTIVE ? 'stop-circle-outline' : 'mic-outline'}
              size={24}
              color="#2563eb"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Rufus;
