import React, { useState, useEffect } from 'react';
import { MetronomeProvider, useMetronome } from './contexts/MetronomeContext';
import { useMetronomePlayback } from './hooks/useMetronomePlayback';
import BeatDisplay from './components/BeatDisplay/BeatDisplay';
import ControlPanel from './components/ControlPanel/ControlPanel';
import InteractiveControlPanel from './components/ControlPanel/InteractiveControlPanel';
import SystemSettings from './components/ControlPanel/SystemSettings';
import { SystemSettingsProvider, useSystemSettings } from './components/ControlPanel/SystemSettings';
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
  const { settings } = useSystemSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);

  // 加载设置 - 自动加载
  useEffect(() => {
    const saved = loadSettings();
    if (saved) {
      // 自动加载所有保存的设置
      dispatch({ type: 'SET_BPM', payload: saved.bpm });
      dispatch({ type: 'SET_TIME_SIGNATURE', payload: saved.timeSignature });
      dispatch({ type: 'SET_NOTE_VALUE', payload: saved.noteValue });
      dispatch({ type: 'SET_SOUND_TYPE', payload: saved.soundType });
      dispatch({ type: 'SET_VOLUME', payload: saved.volume });
      dispatch({ type: 'SET_SUBDIVISION', payload: saved.subdivision });
    }
  }, [dispatch]);

  // 保存设置 - 自动保存
  useEffect(() => {
    // 自动保存所有设置
    saveSettings({
      bpm: state.bpm,
      timeSignature: state.timeSignature,
      noteValue: state.noteValue,
      soundType: state.soundType,
      volume: state.volume,
      subdivision: state.subdivision,
    });
  }, [state]);

  // 系统设置页面
  if (showSystemSettings) {
    return (
      <SystemSettings onBack={() => setShowSystemSettings(false)} />
    );
  }
  
  // 参数设置页面
  if (showSettings) {
    return (
      <SettingsPage onBack={() => setShowSettings(false)} />
    );
  }

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-4`}>
      <div className="max-w-md mx-auto">
        {/* 应用标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">节拍器</h1>
          <p className={`mt-1 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>专业的节拍辅助工具</p>
        </div>
        
        {/* 节拍显示 */}
        <BeatDisplay />
        
        {/* 控制面板 */}
        <ControlPanel />
        
        {/* 参数设置按钮 */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-full py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md mb-4 active:bg-blue-600"
        >
          参数设置
        </button>
        
        {/* 系统设置按钮 */}
        <button
          onClick={() => setShowSystemSettings(true)}
          className={`w-full py-4 font-semibold rounded-lg shadow-md mb-6 ${settings.darkMode ? 'bg-gray-800 text-gray-200 active:bg-gray-700' : 'bg-gray-200 text-gray-800 active:bg-gray-300'}`}
        >
          系统设置
        </button>
        
        {/* 页脚 */}
        <div className={`text-center text-xs mt-8 mb-4 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>© 2024 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { settings } = useSystemSettings();
  
  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-4`}>
      <div className="max-w-md mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className={`w-full py-3 font-semibold rounded-lg shadow-sm mb-6 active:bg-gray-300 ${settings.darkMode ? 'bg-gray-800 text-gray-200 active:bg-gray-700' : 'bg-gray-200 text-gray-800 active:bg-gray-300'}`}
        >
          返回主界面
        </button>
        
        {/* 页面标题 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">参数设置</h2>
        </div>
        
        {/* 交互式控制面板 */}
        <InteractiveControlPanel />
        
        {/* 声音设置 */}
        <SoundSelector />
        
        {/* 页脚 */}
        <div className={`text-center text-xs mt-8 mb-4 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>© 2024 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SystemSettingsProvider>
      <MetronomeProvider>
        <MainPage />
      </MetronomeProvider>
    </SystemSettingsProvider>
  );
};

export default App;