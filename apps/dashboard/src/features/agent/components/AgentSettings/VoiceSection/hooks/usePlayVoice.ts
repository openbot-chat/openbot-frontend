import { useState, useEffect } from 'react';
import { sayQuery, SayRequest } from '@/features/voice/queries/sayQuery'
import { Voice } from 'models';



export function usePlayVoice(voice?: Voice) {
  const [audioInstance, setAudioInstace] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause();
      }
    }
  }, [audioInstance]);

  const play = async (req: SayRequest) => {
    if (audioInstance) {
      audioInstance.pause();
    }

    if (!!voice && !!voice.sample) {
      const audio = new Audio(voice.sample);
      setAudioInstace(audio);
      audio.play();
    } else {
      const res = await sayQuery(req);
      const audio = new Audio(`data:audio/x-wav;base64,${res.data?.data}`);
      setAudioInstace(audio);
      audio.play();
    }
  };

  const pause = () => {
    audioInstance?.pause();
  }

  return {
    play,
    pause,
  }
}