import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';

const BeatDisplay: React.FC = () => {
  const { state } = useMetronome();
  const [flash, setFlash] = useState(false);
  const [isFirstBeatVisible, setIsFirstBeatVisible] = useState(true);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibilityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getBeatType = useCallback((beatNumber: number): 'first' | 'normal' => {
    return beatNumber === 1 ? 'first' : 'normal';
  }, []);

  useEffect(() => {
    // 清除之前的定时器
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    if (visibilityTimerRef.current) {
      clearTimeout(visibilityTimerRef.current);
    }

    // 只有在播放状态下才显示闪烁效果
    if (state.isPlaying) {
      // 显示闪光效果
      setFlash(true);
      flashTimerRef.current = setTimeout(() => setFlash(false), 100);

      // 处理首拍可见性逻辑，确保所有节拍模式下都正常工作
      setIsFirstBeatVisible(true);
      
      // 计算节拍持续时间，考虑细分拍
      const beatDuration = 60000 / state.bpm;
      const subdivisionDuration = beatDuration / state.subdivision;
      
      // 为所有节拍设置可见性定时器，确保光标正确闪烁
      visibilityTimerRef.current = setTimeout(() => {
        setIsFirstBeatVisible(false);
      }, subdivisionDuration);
    } else {
      // 未播放状态下，第一拍不闪烁，保持可见
      setFlash(false);
      setIsFirstBeatVisible(true);
    }

    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
      }
    };
  }, [state.currentBeat, state.bpm, state.isPlaying, state.subdivision]);

  const totalBeats = parseInt(state.timeSignature.split('/')[0]);

  return (
    <div className="bg-blue-600 rounded-xl p-6 mb-6 shadow-lg hover-lift">
      <div className="flex flex-col items-center">
        {/* BPM显示 */}
        <div className={`text-white text-6xl font-bold mb-2 transition-all duration-100 ${flash ? 'scale-110 animate-pulseSoft' : ''}`}>
          {state.bpm}
        </div>
        <div className="text-white/80 text-sm mb-4">BPM</div>
        
        {/* 拍号显示 */}
        <div className="flex items-center justify-center mb-6 animate-bounceSoft">
          <div className="text-white text-3xl font-semibold">{state.timeSignature}</div>
        </div>
        
        {/* 节拍指示器 - 自动换行 */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-full">
          {Array.from({ length: totalBeats }, (_, i) => {
            const beatNumber = i + 1;
            const beatType = getBeatType(beatNumber);
            const isCurrent = beatNumber === state.currentBeat;
            
            const getColor = () => {
              if (beatType === 'first') {
                // 第一拍（首拍）：根据播放状态和节拍位置控制可见性
                return state.isPlaying && state.currentBeat === 1 && !isFirstBeatVisible ? 'bg-white/30' : 'bg-red-500';
              }
              return 'bg-white';
            };
            
            const getRingColor = () => {
              if (isCurrent) {
                return 'ring-4 ring-white/50';
              }
              return '';
            };
            
            const getAnimation = () => {
              if (isCurrent && state.isPlaying) {
                return 'animate-scale';
              }
              return '';
            };
            
            return (
              <div
                key={i}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out 
                  ${getColor()} 
                  ${getRingColor()}
                  ${getAnimation()}
                  opacity-100 hover:scale-110
                `}
              >
                <span className={`${isCurrent ? 'text-white font-bold' : 'text-white/70'}`}>
                  {beatNumber}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* 节拍类型图例 */}
        <div className="mt-4 flex items-center space-x-4 text-white/80 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>首拍</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <span>普通拍</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatDisplay;