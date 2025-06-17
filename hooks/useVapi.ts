import { Message, MessageTypeEnum, TranscriptMessageTypeEnum } from '@/utils/conversation.types';
import { useUser } from '@clerk/clerk-react';
import Vapi from '@vapi-ai/react-native';
import { useEffect, useState } from 'react';

const key = process.env.EXPO_PUBLIC_VAPI_KEY as string;
const vapi = new Vapi(key);

export enum CALL_STATUS {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export function useVapi() {
  const [callStatus, setCallStatus] = useState<CALL_STATUS>(CALL_STATUS.INACTIVE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const onCallStartHandler = () => {
      setCallStatus(CALL_STATUS.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CALL_STATUS.FINISHED);
    };

    const onMessageUpdate = (message: Message) => {
      if (
        message.type === MessageTypeEnum.TRANSCRIPT &&
        message.transcriptType === TranscriptMessageTypeEnum.FINAL
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const onError = (e: any) => {
      setCallStatus(CALL_STATUS.INACTIVE);
      console.error(e);
    };

    vapi.on('call-start', onCallStartHandler);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessageUpdate);
    vapi.on('error', onError);
    vapi.on('speech-start', () => setIsSpeaking(true));
    vapi.on('speech-end', () => setIsSpeaking(false));

    return () => {
      vapi.off('call-start', onCallStartHandler);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessageUpdate);
      vapi.off('error', onError);
      vapi.off('speech-start', () => setIsSpeaking(true));
      vapi.off('speech-end', () => setIsSpeaking(false));
    };
  }, []);

  const startCall = async (type?: 'assistant' | 'workflow') => {
    setCallStatus(CALL_STATUS.CONNECTING);
    let id =
      type === 'assistant'
        ? process.env.EXPO_PUBLIC_VAPI_ASSISTANT_ID
        : process.env.EXPO_PUBLIC_VAPI_WORKFLOW_ID;
    console.log('🚀 ~ startCall ~ user:', user?.firstName);

    const response = vapi.start(id, {
      variableValues: {
        name: user?.firstName,
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
    setCallStatus(CALL_STATUS.FINISHED);
    vapi.stop();
  };

  const setMuted = (value: boolean) => {
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
    messages,
    startCall,
    stop,
    setMuted,
    isMuted,
    send,
    isSpeaking,
  };
}
