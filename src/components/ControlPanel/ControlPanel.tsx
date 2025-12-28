import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';

const ControlPanel: React.FC = () => {
  const { state, dispatch } = useMetronome();
  const [isPressed, setIsPressed] = React.useState(false);
  
  const handleTogglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };
  
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      {/* 播放状态指示器 */}
      <div className={`mb-4 flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${state.isPlaying ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-300'}`}>
        {state.isPlaying && (
          <div className="w-4 h-4 bg-white rounded-full animate-beat" />
        )}
      </div>
      
      {/* 大型播放/停止按钮 - 100x100px */}
      <button
        onClick={handleTogglePlay}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl transition-all duration-200 active:scale-95 ${state.isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} ${isPressed ? 'scale-95' : 'scale-100'}`}
      >
        {state.isPlaying ? (
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-1">⏸</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-1">▶</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;