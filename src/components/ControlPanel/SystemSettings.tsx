import React, { useState, useEffect } from 'react';

// 系统设置类型定义
interface SystemSettings {
  darkMode: boolean;
}

// 系统设置上下文类型
interface SystemSettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
}

// 创建系统设置上下文
const SystemSettingsContext = React.createContext<SystemSettingsContextType | undefined>(undefined);

// 系统设置提供器组件
export const SystemSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    // 从localStorage加载设置
    const saved = localStorage.getItem('system-settings');
    return saved ? JSON.parse(saved) : {
      darkMode: false
    };
  });

  // 保存设置到localStorage
  useEffect(() => {
    localStorage.setItem('system-settings', JSON.stringify(settings));
  }, [settings]);

  // 更新设置的函数
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SystemSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

// 自定义钩子，用于访问系统设置
export const useSystemSettings = () => {
  const context = React.useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
};

// 系统设置组件
const SystemSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { settings, updateSettings } = useSystemSettings();
  const [showTutorial, setShowTutorial] = useState(false);

  // 教程步骤
  const tutorialSteps = [
    {
      title: '主界面',
      description: '显示当前BPM、拍号和节拍指示器，点击开始按钮播放节拍。'
    },
    {
      title: '参数设置',
      description: '调整小节数、单拍音符、时值和速度等参数。'
    },
    {
      title: '声音设置',
      description: '选择不同的声音类型和调整音量。'
    },
    {
      title: '系统设置',
      description: '设置是否保存调节记录和切换明暗模式。'
    }
  ];

  // 乐理知识数据
  const musicTheoryData = [
    {
      title: '拍号',
      content: '拍号是表示音乐中每小节的节拍数和节拍单位的符号。例如4/4拍表示每小节有4拍，以四分音符为一拍。'
    },
    {
      title: '音符时值',
      content: '音符时值表示音符的持续时间。常用的音符时值有：全音符（4拍）、二分音符（2拍）、四分音符（1拍）、八分音符（0.5拍）、十六分音符（0.25拍）。'
    },
    {
      title: 'BPM',
      content: 'BPM（Beats Per Minute）表示每分钟的节拍数，用于衡量音乐的速度。例如，120 BPM表示每分钟有120个四分音符。'
    },
    {
      title: '重音',
      content: '重音是指在音乐中被强调的节拍，通常是每小节的第一拍。在节拍器中，重音通常用不同的声音或音量来表示。'
    },
    {
      title: '细分拍',
      content: '细分拍是将一个基本拍分成更小的单位，用于更精确地表示音乐的节奏。例如，将四分音符分成两个八分音符就是2分细分拍。'
    }
  ];

  // 乐理知识学习状态
  const [showMusicTheory, setShowMusicTheory] = useState(false);

  return (
    <div className={`min-h-screen p-4 ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
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
          <h2 className="text-2xl font-bold text-blue-600">系统设置</h2>
        </div>

        {showTutorial ? (
          /* 使用教程 */
          <div className={`rounded-xl shadow-md p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>使用教程</h3>
            <div className="space-y-4">
              {tutorialSteps.map((step, index) => (
                <div key={index} className={`p-4 rounded-lg ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className="font-bold text-blue-600">{index + 1}. {step.title}</h4>
                  <p className={`mt-1 ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{step.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
            >
              关闭教程
            </button>
          </div>
        ) : showMusicTheory ? (
          /* 乐理知识学习 */
          <div className={`rounded-xl shadow-md p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>乐理知识</h3>
            <div className="space-y-4">
              {musicTheoryData.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className="font-bold text-blue-600">{item.title}</h4>
                  <p className={`mt-1 ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.content}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowMusicTheory(false)}
              className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
            >
              关闭乐理知识
            </button>
          </div>
        ) : (
          /* 系统设置选项 */
          <div className="space-y-6">
            {/* 明暗模式调节 */}
            <div className={`rounded-xl shadow-md p-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>显示设置</h3>
              <div className="flex items-center justify-between">
                <span className={settings.darkMode ? 'text-gray-300' : 'text-gray-700'}>暗黑模式</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className={`text-sm mt-2 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>切换应用的明暗主题</p>
            </div>

            {/* 使用教程按钮 */}
            <button
              onClick={() => setShowTutorial(true)}
              className={`w-full py-3 rounded-xl shadow-md hover:bg-gray-50 active:bg-gray-100 transition-colors ${settings.darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 active:bg-gray-600' : 'bg-white text-gray-800'}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">📚</span>
                <span className="text-lg font-semibold">使用教程</span>
              </div>
            </button>

            {/* 乐理知识学习按钮 */}
            <button
              onClick={() => setShowMusicTheory(true)}
              className={`w-full py-3 rounded-xl shadow-md hover:bg-gray-50 active:bg-gray-100 transition-colors ${settings.darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 active:bg-gray-600' : 'bg-white text-gray-800'}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🎵</span>
                <span className="text-lg font-semibold">乐理知识学习</span>
              </div>
            </button>
          </div>
        )}

        {/* 页脚 */}
        <div className={`text-center text-xs mt-8 mb-4 ${settings.darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <p>© 2024 节拍器应用</p>
        </div>
      </div>
    </div>
  );
};



// 导出系统设置组件
export default SystemSettings;