import React, { useState } from 'react';
import { useSystemSettings } from '../ControlPanel/SystemSettings';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  const { settings } = useSystemSettings();
  const [showDevInfo, setShowDevInfo] = useState(false);
  const [showAIInfo, setShowAIInfo] = useState(true);
  const [showUpdateLog, setShowUpdateLog] = useState(true);

  return (
    <div className={`min-h-screen p-4 ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} animate-fadeIn`}>
      <div className="max-w-md mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          className={`w-full py-3 font-semibold rounded-lg shadow-sm mb-6 hover-lift ripple ${settings.darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
        >
          返回上一级
        </button>

        {/* 关于内容 */}
        <div className={`rounded-xl shadow-md p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'} animate-slideIn`}>
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold animate-bounceSoft">节拍器应用</h3>
            <p className={`${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              专业的节拍辅助工具，帮助音乐爱好者和专业人士精准掌握节奏。
            </p>
            
            <div className={`pt-4 border-t ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className="font-medium">版本号：1.0.1</p>
            </div>
            
            <div className="pt-4 space-y-4">
              {/* 开发者信息点击展开 */}
              <div 
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover-lift"
                onClick={() => setShowDevInfo(!showDevInfo)}
              >
                <p className={`font-medium transition-all duration-300 ${settings.darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                  节拍器由钟*开发
                </p>
                
                {/* 开发者信息详情 */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${showDevInfo ? 'max-h-40 opacity-100 animate-slideIn' : 'max-h-0 opacity-0'}`}
                >
                  <div className={`mt-2 p-3 rounded-lg ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fadeIn`}>
                    <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      节拍器由钟*开发（为保证隐私，已隐藏完整姓名）
                    </p>
                  </div>
                </div>
              </div>
              
              {/* AI功能信息点击展开 */}
              <div 
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover-lift"
                onClick={() => setShowAIInfo(!showAIInfo)}
              >
                <p className={`font-medium transition-all duration-300 ${settings.darkMode ? 'text-purple-400' : 'text-purple-600'} hover:underline`}>
                  部分内容由AI生成
                </p>
                
                {/* AI功能信息详情 */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${showAIInfo ? 'max-h-40 opacity-100 animate-slideIn' : 'max-h-0 opacity-0'}`}
                >
                  <div className={`mt-2 p-3 rounded-lg ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fadeIn`}>
                    <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      利用AI技术辅助开发，提升开发效率和用户体验
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 更新日志点击展开 */}
              <div 
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover-lift"
                onClick={() => setShowUpdateLog(!showUpdateLog)}
              >
                <p className={`font-medium transition-all duration-300 ${settings.darkMode ? 'text-green-400' : 'text-green-600'} hover:underline`}>
                  更新日志
                </p>
                
                {/* 更新日志详情 */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${showUpdateLog ? 'max-h-60 opacity-100 animate-slideIn' : 'max-h-0 opacity-0'}`}
                >
                  <div className={`mt-2 p-3 rounded-lg ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-fadeIn`}>
                    <p className={`text-center font-medium mb-2 ${settings.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      1.0.1
                    </p>
                    <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      修复了暗黑模式和循环单次的bug
                    </p>
                    <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      修复了节拍器显示的问题
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <p className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                © 2026 节拍器应用. 保留所有权利.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;