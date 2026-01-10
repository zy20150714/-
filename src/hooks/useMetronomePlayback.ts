import { useEffect, useRef } from 'react';
import { useMetronome } from '../contexts/MetronomeContext';
import { calculateBeatDuration } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

export const useMetronomePlayback = () => {
  const { state, dispatch } = useMetronome();
  const timeoutRef = useRef<number | null>(null);
  const wasPlayingRef = useRef(false);
  
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
    // 使用当前函数作用域中的state值，确保更新逻辑正确
    const currentSubdivision = state.currentSubdivision;
    const currentMaxSubdivision = state.subdivision;
    
    timeoutRef.current = setTimeout(() => {
      // 更新状态
      if (currentSubdivision < currentMaxSubdivision) {
        dispatch({ type: 'NEXT_SUBDIVISION' });
      } else {
        dispatch({ type: 'NEXT_BEAT' });
      }
    }, subdivisionDuration) as unknown as number;
  };
  
  // 统一的播放控制逻辑
  useEffect(() => {
    if (state.isPlaying) {
      // 开始播放时，播放第一个节拍
      playBeat();
      wasPlayingRef.current = true;
    } else {
      // 停止播放时，清除所有timeout
      clearAllTimeouts();
      wasPlayingRef.current = false;
    }
  }, [state.isPlaying, state.timeSignature]);
  
  // 当节拍状态变化时，播放当前节拍的声音（仅在播放状态下且不是刚开始播放时）
  useEffect(() => {
    if (state.isPlaying && wasPlayingRef.current) {
      playBeat();
    }
  }, [state.currentBeat, state.currentSubdivision, state.bpm, state.noteValue, state.subdivision, state.soundType, state.volume, dispatch]);
};