import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const AudioToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMutedState());

  const handleToggle = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2.5 rounded-lg border transition-all duration-200 flex items-center justify-center ${
        isMuted
          ? 'border-red-500/40 bg-red-950/30 text-red-400 hover:border-red-500'
          : 'border-cyan-500/40 bg-cyan-950/30 text-cyan-400 hover:border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
      }`}
      title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
    </button>
  );
};
