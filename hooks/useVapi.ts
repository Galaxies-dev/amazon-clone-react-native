import { Message, MessageTypeEnum, TranscriptMessageTypeEnum } from '@/utils/conversation.types';
import { useUser } from '@clerk/clerk-react';
import Vapi from '@vapi-ai/react-native';
import { useEffect, useState } from 'react';

const key = process.env.EXPO_PUBLIC_VAPI_KEY as string;
const vapi = new Vapi(key);

export enum CALL_STATUS {
  // INACTIVE = 'inactive',
  // ACTIVE = 'active',
  // LOADING = 'loading',
  // FINISHED = 'finished',
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export function useVapi() {
  const [callStatus, setCallStatus] = useState<CALL_STATUS>(CALL_STATUS.INACTIVE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTranscript, setActiveTranscript] = useState<Message | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    const onCallStartHandler = () => {
      console.log('Call has started');
      setCallStatus(CALL_STATUS.ACTIVE);
    };

    const onCallEnd = () => {
      console.log('call has ended ok');
      console.log('Call has stopped');
      setCallStatus(CALL_STATUS.FINISHED);
    };

    const onMessageUpdate = (message: Message) => {
      console.log('onMessageUpdate', message);
      if (
        message.type === MessageTypeEnum.TRANSCRIPT &&
        message.transcriptType === TranscriptMessageTypeEnum.FINAL
      ) {
        setMessages((prev) => [...prev, message]);
        setActiveTranscript(null);
      } else {
        setActiveTranscript(message);
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
    console.log('starting the call');
    setCallStatus(CALL_STATUS.CONNECTING);
    let id =
      type === 'assistant'
        ? process.env.EXPO_PUBLIC_VAPI_ASSISTANT_ID
        : process.env.EXPO_PUBLIC_VAPI_WORKFLOW_ID;
    console.log('🚀 ~ startCall ~ id:', id);
    console.log('🚀 ~ startCall ~ user:', user);

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

  const toggleCall = async (type?: 'assistant' | 'workflow') => {
    if (callStatus === CALL_STATUS.ACTIVE) {
      console.log('stopping the call');
      stop();
    } else {
      await startCall(type);
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
    startCall,
    stop,
    setMuted,
    isMuted,
    toggleCall,
    send,
  };
}
