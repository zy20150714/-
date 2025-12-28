import { useEffect, useRef, useCallback } from 'react';
import { useMetronome } from '../contexts/MetronomeContext';
import { calculateBeatDuration } from '../utils/metronomeUtils';
import { audioUtils } from '../utils/audioUtils';

export const useMetronomePlayback = () => {
  const { state, dispatch } = useMetronome();
  const timeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  
  // 使用useCallback确保playNext函数的引用稳定
  const playNext = useCallback(() => {
    if (!state.isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
    
    // 只更新状态，不播放下一个节拍的声音
    // 下一个节拍的声音由useEffect监听状态变化来播放
    const updateState = () => {
      if (!state.isPlaying) return;
      
      if (state.currentSubdivision < state.subdivision) {
        dispatch({ type: 'NEXT_SUBDIVISION' });
      } else {
        dispatch({ type: 'NEXT_BEAT' });
      }
    };
    
    // 设置timeout，等待当前节拍播放完毕后更新状态
    timeoutRef.current = setTimeout(() => {
      updateState();
    }, subdivisionDuration) as unknown as number;
  }, [state, dispatch]);
  
  // 只有当isPlaying状态变化时，才会设置或清除播放循环
  useEffect(() => {
    if (state.isPlaying && !isPlayingRef.current) {
      // 开始播放时，立即播放第一个节拍的声音
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
        console.error('Error playing initial sound:', error);
      }
      
      // 设置isPlayingRef为true，防止重复播放
      isPlayingRef.current = true;
      
      // 设置第一个节拍的timeout
      const beatDuration = calculateBeatDuration(state.bpm, state.noteValue);
      const subdivisionDuration = beatDuration / state.subdivision;
      
      timeoutRef.current = setTimeout(() => {
        // 更新到第二个节拍
        if (state.currentSubdivision < state.subdivision) {
          dispatch({ type: 'NEXT_SUBDIVISION' });
        } else {
          dispatch({ type: 'NEXT_BEAT' });
        }
      }, subdivisionDuration) as unknown as number;
    } else if (!state.isPlaying && isPlayingRef.current) {
      // 停止播放时，清除所有timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isPlayingRef.current = false;
    }
  }, [state.isPlaying, state.bpm, state.noteValue, state.subdivision, state.currentBeat, state.currentSubdivision, state.soundType, state.volume, dispatch]);
  
  // 当节拍状态变化时，播放当前节拍的声音
  useEffect(() => {
    if (state.isPlaying && isPlayingRef.current) {
      // 只要在播放状态，就播放当前节拍的声音
      // 移除了isInitialState的判断，确保第二遍也有声音
      playNext();
    }
  }, [state.currentBeat, state.currentSubdivision, state.isPlaying, playNext]);
};