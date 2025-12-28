import React from 'react';
import { useMetronome } from '../../contexts/MetronomeContext';
import type { NoteValue as NoteValueType } from '../../types';
import { getNoteValueSymbol } from '../../utils/metronomeUtils';

const NoteValue: React.FC = () => {
  const { state, dispatch } = useMetronome();
  
  const noteValues: NoteValueType[] = ['whole', 'half', 'quarter', 'eighth', 'sixteenth'];
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">音符时值</h3>
      
      <div className="grid grid-cols-5 gap-2">
        {noteValues.map((nv) => (
          <button
            key={nv}
            onClick={() => dispatch({ type: 'SET_NOTE_VALUE', payload: nv })}
            className={`py-3 rounded-lg font-semibold transition-all duration-200 flex flex-col items-center ${state.noteValue === nv ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            <span className="text-3xl mb-1">{getNoteValueSymbol(nv)}</span>
            <span className="text-xs">{nv === 'whole' ? '全' : nv === 'half' ? '二分' : nv === 'quarter' ? '四分' : nv === 'eighth' ? '八分' : '十六分'}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoteValue;