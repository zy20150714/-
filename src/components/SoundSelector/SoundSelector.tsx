import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { getSoundTypeEmoji } from '../../utils/metronomeUtils';
import { audioUtils } from '../../utils/audioUtils';

const SoundSelector: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  const handleSoundTypeChange = (soundType: string) => {
    dispatch({ type: 'SET_SOUND_TYPE', payload: soundType as any });
  };
  
  const handleVolumeChange = (type: 'accent' | 'normal', value: number) => {
    dispatch({ type: 'SET_VOLUME', payload: { [type]: value } });
  };
  
  const handlePreviewAccent = () => {
    // 预览重音即预览首拍声音
    audioUtils.playAccent(state.soundType, state.volume.accent);
  };
  
  const handlePreviewNormal = () => {
    // 预览普通拍声音
    audioUtils.playNormal(state.soundType, state.volume.normal);
  };
  
  const soundTypes = [
    { value: 'click', label: '点击声' },
    { value: 'drum', label: '鼓声' },
    { value: 'wood', label: '木鱼' },
    { value: 'electronic', label: '电子音' },
    { value: 'metal', label: '金属音' },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">声音类型</h3>
      
      {/* 声音类型选择 */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {soundTypes.map((sound) => (
          <button
            key={sound.value}
            onClick={() => handleSoundTypeChange(sound.value)}
            className={`py-2 rounded-lg font-semibold transition-all duration-200 flex flex-col items-center ${state.soundType === sound.value ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            <span className="text-2xl mb-1">{getSoundTypeEmoji(sound.value)}</span>
            <span className="text-xs">{sound.label}</span>
          </button>
        ))}
      </div>
      
      {/* 预览按钮 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handlePreviewAccent}
          className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition-all"
        >
          预览重音
        </button>
        <button
          onClick={handlePreviewNormal}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all"
        >
          预览普通音
        </button>
      </div>
      
      {/* 音量调节 */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">重音音量: {state.volume.accent}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.accent}
            onChange={(e) => handleVolumeChange('accent', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">普通音音量: {state.volume.normal}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={state.volume.normal}
            onChange={(e) => handleVolumeChange('normal', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default SoundSelector;