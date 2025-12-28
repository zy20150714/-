import React, { useState, useEffect } from 'react';
import { MetronomeProvider, useMetronome } from './contexts/MetronomeContext';
import { useMetronomePlayback } from './hooks/useMetronomePlayback';
import BeatDisplay from './components/BeatDisplay/BeatDisplay';
import ControlPanel from './components/ControlPanel/ControlPanel';
import SpeedControl from './components/SpeedControl/SpeedControl';
import TimeSignature from './components/TimeSignature/TimeSignature';
import NoteValue from './components/NoteValue/NoteValue';
import SoundSelector from './components/SoundSelector/SoundSelector';

const SETTINGS_KEY = 'metronome-settings';

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return null;
};

const saveSettings = (settings: any) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

const MainPage: React.FC = () => {
  useMetronomePlayback();
  const { state, dispatch } = useMetronome();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = loadSettings();
    if (saved) {
      if (saved.bpm) dispatch({ type: 'SET_BPM', payload: saved.bpm });
      if (saved.timeSignature) dispatch({ type: 'SET_TIME_SIGNATURE', payload: saved.timeSignature });
      if (saved.noteValue) dispatch({ type: 'SET_NOTE_VALUE', payload: saved.noteValue });
      if (saved.soundType) dispatch({ type: 'SET_SOUND_TYPE', payload: saved.soundType });
      if (saved.volume) dispatch({ type: 'SET_VOLUME', payload: saved.volume });
    }
  }, [dispatch]);

  useEffect(() => {
    saveSettings({
      bpm: state.bpm,
      timeSignature: state.timeSignature,
      noteValue: state.noteValue,
      soundType: state.soundType,
      volume: state.volume,
    });
  }, [state]);

  if (showSettings) {
    return (
      <SettingsPage onBack={() => setShowSettings(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        {/* 应用标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">节拍器</h1>
          <p className="text-gray-600 mt-1">专业的节拍辅助工具</p>
        </div>
        
        {/* 节拍显示 */}
        <BeatDisplay />
        
        {/* 控制面板 */}
        <ControlPanel />
        
        {/* 参数设置按钮 */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-full py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md mb-6 active:bg-blue-600"
        >
          参数设置
        </button>
        
        {/* 页脚 */}
        <div className="text-center text-gray-500 text-xs mt-8 mb-4">
          <p>© 2024 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm mb-6 active:bg-gray-300"
        >
          返回主界面
        </button>
        
        {/* 页面标题 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">参数设置</h2>
        </div>
        
        {/* 速度控制 */}
        <SpeedControl />
        
        {/* 拍号设置 */}
        <TimeSignature />
        
        {/* 音符时值设置 */}
        <NoteValue />
        
        {/* 声音设置 */}
        <SoundSelector />
        
        {/* 页脚 */}
        <div className="text-center text-gray-500 text-xs mt-8 mb-4">
          <p>© 2024 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MetronomeProvider>
      <MainPage />
    </MetronomeProvider>
  );
};

export default App;