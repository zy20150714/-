// 拍号类型
export type TimeSignature = '2/4' | '3/4' | '4/4' | '6/8' | '9/8' | '12/8';

// 音符时值类型
export type NoteValue = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

// 声音类型
export type SoundType = 'click' | 'drum' | 'wood' | 'electronic' | 'metal';

// 音量类型
export interface Volume {
  accent: number; // 0-100
  normal: number; // 0-100
}

// 节拍器状态类型
export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  timeSignature: TimeSignature;
  noteValue: NoteValue;
  soundType: SoundType;
  volume: Volume;
  subdivision: number; // 1-4
  currentBeat: number;
  currentSubdivision: number;
}

// 节拍器动作类型
export type MetronomeAction =
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_BPM'; payload: number }
  | { type: 'SET_TIME_SIGNATURE'; payload: TimeSignature }
  | { type: 'SET_NOTE_VALUE'; payload: NoteValue }
  | { type: 'SET_SOUND_TYPE'; payload: SoundType }
  | { type: 'SET_VOLUME'; payload: Partial<Volume> }
  | { type: 'SET_SUBDIVISION'; payload: number }
  | { type: 'NEXT_BEAT' }
  | { type: 'NEXT_SUBDIVISION' }
  | { type: 'RESET_BEAT' };

// 声音配置类型
export interface SoundConfig {
  accentFrequency: number;
  secondaryFrequency: number;
  normalFrequency: number;
  duration: number;
}

// 音符时值配置类型
export interface NoteValueConfig {
  name: string;
  symbol: string;
  value: number; // 相对于四分音符的值
}

// 拍号配置类型
export interface TimeSignatureConfig {
  value: TimeSignature;
  beats: number;
  beatValue: number;
}

// 细分配置类型
export interface SubdivisionConfig {
  value: number;
  symbol: string;
}