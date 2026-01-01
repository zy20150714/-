import type { TimeSignature, NoteValue } from '../types';

export const parseTimeSignature = (timeSignature: TimeSignature): { beats: number; beatValue: number } => {
  const [beats, beatValue] = timeSignature.split('/').map(Number);
  return { beats, beatValue };
};

export const calculateBeatDuration = (bpm: number, noteValue: NoteValue): number => {
  const baseDuration = 60000 / bpm;
  
  const noteValueMultipliers: Record<NoteValue, number> = {
    whole: 4,
    half: 2,
    quarter: 1,
    eighth: 0.5,
    sixteenth: 0.25,
  };
  
  return baseDuration * noteValueMultipliers[noteValue];
};

export const calculateSubdivisionDuration = (beatDuration: number, subdivision: number): number => {
  return beatDuration / subdivision;
};

export const validateBPM = (bpm: number): number => {
  if (bpm < 40) return 40;
  if (bpm > 208) return 208;
  return bpm; // 只在超出范围时调整，否则保持原样
};

export const validateSubdivision = (subdivision: number): number => {
  if (subdivision < 1) return 1;
  if (subdivision > 4) return 4;
  return Math.round(subdivision);
};

export const getNoteValueSymbol = (noteValue: NoteValue): string => {
  const symbols: Record<NoteValue, string> = {
    whole: '𝅝',
    half: '𝅗𝅥',
    quarter: '𝅘𝅥',
    eighth: '𝅘𝅥𝅮',
    sixteenth: '𝅘𝅥𝅯',
  };
  return symbols[noteValue];
};

export const getSoundTypeEmoji = (soundType: string): string => {
  const emojis: Record<string, string> = {
    click: '👆',
    drum: '🥁',
    wood: '🪵',
    electronic: '🔊',
    metal: '🔔',
  };
  return emojis[soundType] || '🎵';
};

export const getSubdivisionSymbol = (subdivision: number): string => {
  const symbols: Record<number, string> = {
    1: '1',
    2: '1 +',
    3: '1 + a',
    4: '1 + a 2',
  };
  return symbols[subdivision] || '1';
};

export const getSecondaryBeatPositions = (timeSignature: TimeSignature): number[] => {
  const [beats, beatValue] = timeSignature.split('/').map(Number);
  
  if (beatValue === 8) {
    if (beats === 6) return [4];
    if (beats === 9) return [4, 7];
    if (beats === 12) return [4, 7, 10];
    if (beats === 5) return [3];
    if (beats === 7) return [3, 5];
  }
  
  if (beatValue === 4) {
    if (beats === 5) return [3];
    if (beats === 7) return [3, 5];
  }
  
  return [];
};

export const getTimeSignatureName = (timeSignature: TimeSignature): string => {
  const [beats, beatValue] = timeSignature.split('/').map(Number);
  
  if (beatValue === 4) {
    if (beats === 2) return '二拍子';
    if (beats === 3) return '三拍子';
    if (beats === 4) return '四拍子';
    if (beats === 5) return '五拍子';
    if (beats === 6) return '六拍子';
    if (beats === 7) return '七拍子';
  }
  
  if (beatValue === 8) {
    if (beats === 6) return '六八拍子';
    if (beats === 9) return '九八拍子';
    if (beats === 12) return '十二八拍子';
    if (beats === 5) return '五八拍子';
    if (beats === 7) return '七八拍子';
  }
  
  return `${beats}/${beatValue}`;
};

export const getNoteValueName = (noteValue: NoteValue): string => {
  const names: Record<NoteValue, string> = {
    whole: '全音符',
    half: '二分音符',
    quarter: '四分音符',
    eighth: '八分音符',
    sixteenth: '十六分音符',
  };
  return names[noteValue];
};

export const getSoundTypeName = (soundType: string): string => {
  const names: Record<string, string> = {
    click: '点击声',
    drum: '鼓声',
    wood: '木鱼声',
    electronic: '电子音',
    metal: '金属声',
  };
  return names[soundType] || '未知声音';
};