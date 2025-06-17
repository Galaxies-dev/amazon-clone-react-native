import { CALL_STATUS, useVapi } from '@/hooks/useVapi';
import { MessageTypeEnum } from '@/utils/conversation.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const VapiOverlay = () => {
  const { startCall, isSpeaking, callStatus, messages, stop } = useVapi();
  const [showOverlay, setShowOverlay] = useMMKVBoolean('vapi.overlay');

  useEffect(() => {
    startCall('assistant');
  }, []);

  useEffect(() => {
    if (callStatus === CALL_STATUS.FINISHED) {
      setShowOverlay(false);
    }
  }, [callStatus]);

  const onEndCall = () => {
    stop();
    setShowOverlay(false);
  };

  return (
    <Animated.View
      className="bg-white top-[70px] w-full h-full z-20 justify-center"
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}>
      {callStatus === CALL_STATUS.CONNECTING && (
        <Text className="font-semibold self-center">Connecting to support....</Text>
      )}
      {(callStatus === CALL_STATUS.INACTIVE || callStatus === CALL_STATUS.FINISHED) && (
        <Text className="font-semibold self-center">Inactive call</Text>
      )}

      {callStatus === CALL_STATUS.ACTIVE && (
        <>
          <ScrollView className="flex-1 p-4">
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
          </ScrollView>

          <View className="flex-1 items-center ">
            {/* Microphone Icon with Animated Ping */}
            <View className="items-center justify-center mb-8 ">
              <View
                className={`w-24 h-24 rounded-full  items-center justify-center shadow-md ${
                  isSpeaking ? ' bg-primary' : 'bg-gray-200'
                }`}>
                <Ionicons name="mic" size={48} color="#151D26" />
              </View>
            </View>
            {/* End Call Button */}
            <TouchableOpacity
              className="bg-red-500 rounded-full px-8 py-4 shadow-md"
              onPress={onEndCall}
              activeOpacity={0.8}>
              <Text className="text-white text-lg font-bold">End Call</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Animated.View>
  );
};
export default VapiOverlay;
