import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import type { MetronomeState, MetronomeAction } from '../types';
import { validateBPM, validateSubdivision } from '../utils/metronomeUtils';

// 初始状态
const initialState: MetronomeState = {
  isPlaying: false,
  bpm: 120,
  timeSignature: '4/4',
  noteValue: 'quarter',
  soundType: 'click',
  volume: {
    accent: 80,
    normal: 60,
  },
  subdivision: 1,
  currentBeat: 1,
  currentSubdivision: 1,
};

// Reducer函数
const metronomeReducer = (state: MetronomeState, action: MetronomeAction): MetronomeState => {
  switch (action.type) {
    case 'TOGGLE_PLAY':
      return {
        ...state,
        isPlaying: !state.isPlaying,
        currentBeat: !state.isPlaying ? state.currentBeat : 1,
        currentSubdivision: !state.isPlaying ? state.currentSubdivision : 1,
      };
    
    case 'SET_BPM':
      return {
        ...state,
        bpm: validateBPM(action.payload),
      };
    
    case 'SET_TIME_SIGNATURE':
      return {
        ...state,
        timeSignature: action.payload,
        currentBeat: 1,
        currentSubdivision: 1,
      };
    
    case 'SET_NOTE_VALUE':
      return {
        ...state,
        noteValue: action.payload,
      };
    
    case 'SET_SOUND_TYPE':
      return {
        ...state,
        soundType: action.payload,
      };
    
    case 'SET_VOLUME':
      return {
        ...state,
        volume: {
          ...state.volume,
          ...action.payload,
        },
      };
    
    case 'SET_SUBDIVISION':
      return {
        ...state,
        subdivision: validateSubdivision(action.payload),
        currentSubdivision: 1,
      };
    
    case 'NEXT_BEAT':
      const [beats] = state.timeSignature.split('/').map(Number);
      return {
        ...state,
        currentBeat: state.currentBeat >= beats ? 1 : state.currentBeat + 1,
        currentSubdivision: 1,
      };
    
    case 'NEXT_SUBDIVISION':
      return {
        ...state,
        currentSubdivision: state.currentSubdivision >= state.subdivision ? 1 : state.currentSubdivision + 1,
      };
    
    case 'RESET_BEAT':
      return {
        ...state,
        currentBeat: 1,
        currentSubdivision: 1,
      };
    
    default:
      return state;
  }
};

// 创建Context
interface MetronomeContextType {
  state: MetronomeState;
  dispatch: React.Dispatch<MetronomeAction>;
}

const MetronomeContext = createContext<MetronomeContextType | undefined>(undefined);

// Context Provider组件
export const MetronomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(metronomeReducer, initialState);
  
  return (
    <MetronomeContext.Provider value={{ state, dispatch }}>
      {children}
    </MetronomeContext.Provider>
  );
};

// 自定义Hook，用于访问Context
export const useMetronome = (): MetronomeContextType => {
  const context = useContext(MetronomeContext);
  if (context === undefined) {
    throw new Error('useMetronome must be used within a MetronomeProvider');
  }
  return context;
};