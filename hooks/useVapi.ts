import {
  Message,
  MessageTypeEnum,
  TranscriptMessage,
  TranscriptMessageTypeEnum,
} from '@/utils/conversation.types';
import Vapi from '@vapi-ai/react-native';
import { useEffect, useState } from 'react';

const key = process.env.EXPO_PUBLIC_VAPI_KEY as string;
const vapi = new Vapi(key);

export enum CALL_STATUS {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  LOADING = 'loading',
}

export function useVapi() {
  const [callStatus, setCallStatus] = useState<CALL_STATUS>(CALL_STATUS.INACTIVE);
  const [messages, setMessages] = useState<Message[]>([]);

  const [activeTranscript, setActiveTranscript] = useState<TranscriptMessage | null>(null);

  useEffect(() => {
    const onCallStartHandler = () => {
      console.log('Call has started');
      setCallStatus(CALL_STATUS.ACTIVE);
    };

    const onCallEnd = () => {
      console.log('call has ended ok');
      console.log('Call has stopped');
      setCallStatus(CALL_STATUS.INACTIVE);
    };

    const onMessageUpdate = (message: Message) => {
      console.log('onMessageUpdate', message);
      if (
        message.type === MessageTypeEnum.TRANSCRIPT &&
        message.transcriptType === TranscriptMessageTypeEnum.PARTIAL
      ) {
        setActiveTranscript(message);
      } else {
        setMessages((prev) => [...prev, message]);
        setActiveTranscript(null);
      }
    };

    const onError = (e: any) => {
      console.log('on error triggered');
      setCallStatus(CALL_STATUS.INACTIVE);
      console.error(e);
    };

    vapi.on('call-start', onCallStartHandler);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessageUpdate);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStartHandler);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessageUpdate);
      vapi.off('error', onError);
    };
  }, []);

  const start = async () => {
    console.log('starting the call');
    setCallStatus(CALL_STATUS.ACTIVE);
    // setCallStatus(CALL_STATUS.LOADING);
    // const response = vapi.start(characterAssistant);
    const response = vapi.start({
      // endCallFunctionEnabled: true,
      model: {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        // "fallbackModels": ["gpt-4-1106-preview", "gpt-4-0125-preview"],
        messages: [
          {
            content: 'you are an assistant',
            role: 'assistant',
          },
        ],
      },
    });

    response
      .then((_res) => {
        console.log('call', _res);
      })
      .catch((e) => {
        console.error('got an error while starting the call', e);
      });
  };

  const stop = () => {
    setCallStatus(CALL_STATUS.LOADING);
    vapi.stop();
  };

  const toggleCall = async () => {
    if (callStatus === CALL_STATUS.ACTIVE) {
      console.log('stopping the call');
      stop();
    } else {
      await start();
    }
  };

  const setMuted = (value: boolean) => {
    console.log('mute');
    vapi.setMuted(value);
  };
  const isMuted = vapi.isMuted;

  const send = (msg: any) => {
    return vapi.send({
      type: 'add-message',
      message: {
        role: 'user',
        content: msg,
      },
    });
  };

  return {
    callStatus,
    activeTranscript,
    messages,
    start,
    stop,
    setMuted,
    isMuted,
    toggleCall,
    send,
  };
}
