import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';

const SpeedControl: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  const handleBPMChange = (value: number) => {
    dispatch({ type: 'SET_BPM', payload: state.bpm + value });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_BPM', payload: parseInt(e.target.value) || 0 });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">速度控制</h3>
      
      <div className="flex items-center justify-between">
        {/* 减号按钮 */}
        <button
          onClick={() => handleBPMChange(-1)}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-800 font-bold transition-all"
        >
          -
        </button>
        
        {/* BPM输入框 */}
        <div className="flex-1 mx-4">
          <input
            type="number"
            value={state.bpm}
            onChange={handleInputChange}
            className="w-full text-center text-2xl font-bold border-b-2 border-gray-300 focus:border-blue-600 outline-none"
            min="40"
            max="208"
          />
        </div>
        
        {/* 加号按钮 */}
        <button
          onClick={() => handleBPMChange(1)}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-800 font-bold transition-all"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SpeedControl;