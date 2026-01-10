import React, { useState, useEffect } from 'react';
import { MetronomeProvider, useMetronome } from './contexts/MetronomeContext';
import { useMetronomePlayback } from './hooks/useMetronomePlayback';
import BeatDisplay from './components/BeatDisplay/BeatDisplay';
import ControlPanel from './components/ControlPanel/ControlPanel';
import InteractiveControlPanel from './components/ControlPanel/InteractiveControlPanel';
import SystemSettings from './components/ControlPanel/SystemSettings';
import { SystemSettingsProvider, useSystemSettings } from './components/ControlPanel/SystemSettings';
import SoundSelector from './components/SoundSelector/SoundSelector';
import About from './components/About/About';

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
  const [showAbout, setShowAbout] = useState(false);
  const [backButtonAlert, setBackButtonAlert] = useState(false);
  const [lastBackPressed, setLastBackPressed] = useState(0);

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

  // 处理返回键事件
  useEffect(() => {
    const handleBackButton = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Backspace') { // 使用Backspace作为返回键替代
        event.preventDefault();
        
        // 如果不是主界面，优先返回上级界面
        if (showAbout || showSystemSettings || showSettings) {
          if (showAbout) {
            setShowAbout(false);
          } else if (showSystemSettings) {
            setShowSystemSettings(false);
          } else if (showSettings) {
            setShowSettings(false);
          }
          return;
        }

        // 如果在主界面，处理退出逻辑
        const currentTime = Date.now();
        if (currentTime - lastBackPressed < 2000) { // 2秒内连续按下返回键
          // 这里可以调用退出应用的方法，但浏览器环境无法直接退出
          // 所以我们只是清除警告
          setBackButtonAlert(false);
        } else {
          // 显示提示信息
          setBackButtonAlert(true);
          setLastBackPressed(currentTime);
          // 2秒后自动隐藏提示
          setTimeout(() => {
            setBackButtonAlert(false);
          }, 2000);
        }
      }
    };

    // 添加键盘事件监听器
    window.addEventListener('keydown', handleBackButton);

    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleBackButton);
    };
  }, [showSettings, showSystemSettings, showAbout, lastBackPressed]);

  // 关于页面
  if (showAbout) {
    return (
      <div className="animate-slideIn">
        <About onBack={() => setShowAbout(false)} />
      </div>
    );
  }
  
  // 系统设置页面
  if (showSystemSettings) {
    return (
      <div className="animate-slideIn">
        <SystemSettings onBack={() => setShowSystemSettings(false)} />
      </div>
    );
  }
  
  // 参数设置页面
  if (showSettings) {
    return (
      <div className="animate-slideIn">
        <SettingsPage onBack={() => setShowSettings(false)} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-4 animate-fadeIn`}>
      <div className="max-w-md mx-auto">
        {/* 返回键提示 */}
        {backButtonAlert && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 ${settings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} animate-fadeIn`}>
            <p>请连续快速两次返回即可退出</p>
          </div>
        )}
        
        {/* 应用标题 */}
        <div className="text-center mb-6 animate-bounceSoft">
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
          className="w-full py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md mb-4 hover-lift ripple"
        >
          参数设置
        </button>
        
        {/* 系统设置按钮 */}
        <button
          onClick={() => setShowSystemSettings(true)}
          className={`w-full py-4 font-semibold rounded-lg shadow-md mb-6 hover-lift ripple ${settings.darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
        >
          系统设置
        </button>
        
        {/* 页尾 */}
        <div className={`text-center text-xs mt-8 mb-4 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>© 2026 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { settings } = useSystemSettings();
  
  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-4 animate-fadeIn`}>
      <div className="max-w-md mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className={`w-full py-3 font-semibold rounded-lg shadow-sm mb-6 hover-lift ripple ${settings.darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
        >
          返回主界面
        </button>
        
        {/* 页面标题 */}
        <div className="text-center mb-6 animate-bounceSoft">
          <h2 className="text-2xl font-bold text-blue-600">参数设置</h2>
        </div>
        
        {/* 交互式控制面板 */}
        <InteractiveControlPanel />
        
        {/* 声音设置 */}
        <SoundSelector />
        
        {/* 页尾 */}
        <div className={`text-center text-xs mt-8 mb-4 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>© 2026 节拍器应用</p>
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