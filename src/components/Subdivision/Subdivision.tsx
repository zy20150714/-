import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';

const Subdivision: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  const subdivisions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">节拍细分</h3>
      
      <div className="grid grid-cols-4 gap-2">
        {subdivisions.map((sub) => (
          <button
            key={sub.value}
            onClick={() => dispatch({ type: 'SET_SUBDIVISION', payload: sub.value })}
            className={`py-3 rounded-lg font-semibold transition-all duration-200 ${state.subdivision === sub.value ? 'bg-primary-500 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {sub.label}等分
          </button>
        ))}
      </div>
    </div>
  );
};

export default Subdivision;