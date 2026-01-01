import { useEffect, useRef } from 'react';
import { useMetronome } from '../contexts/MetronomeContext';
import { calculateBeatDuration } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

export const useMetronomePlayback = () => {
  const { state, dispatch } = useMetronome();
  const timeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  
  // 清除当前所有timeout
  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  // 播放当前节拍并调度下一个
  const playBeat = () => {
    if (!state.isPlaying) {
      clearAllTimeouts();
      return;
    }
    
    // 播放当前节拍的声音
    const isAccent = state.currentBeat === 1 && state.currentSubdivision === 1;
    const volume = isAccent ? state.volume.accent : state.volume.normal;
    
    try {
      audioUtils.playSound(
        state.soundType,
        isAccent,
        false,
        volume,
      );
    } catch (error) {
      console.error('Error playing sound:', error);
    }
    
    // 计算当前节拍的持续时间
    const beatDuration = calculateBeatDuration(state.bpm, state.noteValue);
    const subdivisionDuration = beatDuration / state.subdivision;
    
    // 设置timeout，等待当前节拍播放完毕后更新状态
    timeoutRef.current = setTimeout(() => {
      // 更新状态
      if (state.currentSubdivision < state.subdivision) {
        dispatch({ type: 'NEXT_SUBDIVISION' });
      } else {
        dispatch({ type: 'NEXT_BEAT' });
      }
    }, subdivisionDuration) as unknown as number;
  };
  
  // 当节拍状态变化时，播放当前节拍的声音
  useEffect(() => {
    if (state.isPlaying && isPlayingRef.current) {
      playBeat();
    }
  }, [state.currentBeat, state.currentSubdivision, state.isPlaying, state.bpm, state.noteValue, state.subdivision, state.soundType, state.volume, dispatch]);
  
  // 只有当isPlaying状态变化时，才会设置或清除播放循环
  useEffect(() => {
    if (state.isPlaying) {
      // 开始播放时，设置isPlayingRef为true，然后播放第一个节拍
      isPlayingRef.current = true;
      playBeat();
    } else {
      // 停止播放时，清除所有timeout
      clearAllTimeouts();
      isPlayingRef.current = false;
    }
  }, [state.isPlaying]);
};