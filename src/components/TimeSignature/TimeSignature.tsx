import React, { useCallback } from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import { getTimeSignatureName } from '../../utils/metronomeUtils';
import type { TimeSignature } from '../../types';

const TIME_SIGNATURES: { numerator: number; denominator: number }[] = [
  { numerator: 2, denominator: 4 },
  { numerator: 3, denominator: 4 },
  { numerator: 4, denominator: 4 },
  { numerator: 5, denominator: 4 },
  { numerator: 6, denominator: 4 },
  { numerator: 7, denominator: 4 },
  { numerator: 6, denominator: 8 },
  { numerator: 9, denominator: 8 },
  { numerator: 12, denominator: 8 },
  { numerator: 5, denominator: 8 },
  { numerator: 7, denominator: 8 },
];

const TimeSignature: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  const currentNumerator = parseInt(state.timeSignature.split('/')[0]);
  const currentDenominator = parseInt(state.timeSignature.split('/')[1]);
  
  const handleTimeSignatureChange = useCallback((numerator: number, denominator: number) => {
    dispatch({ type: 'SET_TIME_SIGNATURE', payload: `${numerator}/${denominator}` as TimeSignature });
  }, [dispatch]);
  
  return (
    <div className="bg-gray-100 rounded-xl p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">拍号选择</h3>
      
      {/* 拍号显示 */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-blue-600">
          {currentNumerator}/{currentDenominator}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {getTimeSignatureName(state.timeSignature)}
        </div>
      </div>
      
      {/* 常用拍号快捷选择 */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {TIME_SIGNATURES.slice(0, 8).map((ts) => (
          <button
            key={`${ts.numerator}/${ts.denominator}`}
            onClick={() => handleTimeSignatureChange(ts.numerator, ts.denominator)}
            className={`py-2 rounded-lg font-medium transition-all ${
              currentNumerator === ts.numerator && currentDenominator === ts.denominator
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            {ts.numerator}/{ts.denominator}
          </button>
        ))}
      </div>
      
      {/* 自定义拍号滑块 */}
      <div className="space-y-3">
        {/* 分子滑块 */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>拍数（分子）</span>
            <span className="font-medium">{currentNumerator}</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            value={currentNumerator}
            onChange={(e) => handleTimeSignatureChange(parseInt(e.target.value), currentDenominator)}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2</span>
            <span>12</span>
          </div>
        </div>
        
        {/* 分母滑块 */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>节拍单位（分母）</span>
            <span className="font-medium">{currentDenominator}</span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="2"
            value={currentDenominator}
            onChange={(e) => handleTimeSignatureChange(currentNumerator, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2</span>
            <span>4</span>
            <span>8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSignature;