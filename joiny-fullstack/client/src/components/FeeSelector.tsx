import React, { useState, useEffect } from 'react';

interface FeeSelectorProps {
  value: number | string;
  onFeeChange: (value: number | string) => void;
}

const presetFees = [10000, 30000, 50000];

export default function FeeSelector({ value, onFeeChange }: FeeSelectorProps) {
  const [isCustom, setIsCustom] = useState(() => {
    if (value === '') return false;
    return !presetFees.includes(Number(value));
  });

  useEffect(() => {
    if (value !== '' && !presetFees.includes(Number(value))) {
      setIsCustom(true);
    }
  }, [value]);

  const handlePresetClick = (fee: number) => {
    setIsCustom(false);
    onFeeChange(fee);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    if (presetFees.includes(Number(value))) {
        onFeeChange('');
    }
  };

  return (
    <div>
      <label className="text-lg font-semibold text-gray-700">참가비</label>
      {!isCustom ? (
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          {presetFees.map(fee => (
            <button
              key={fee}
              type="button"
              onClick={() => handlePresetClick(fee)}
              className={`p-4 rounded-lg text-center font-semibold transition ${
                value === fee
                  ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500'
                  : 'bg-white border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {fee.toLocaleString()}원
            </button>
          ))}
          <button
            type="button"
            onClick={handleCustomClick}
            className="p-4 rounded-lg text-center font-semibold transition bg-white border border-gray-300 hover:bg-gray-100"
          >
            직접입력
          </button>
        </div>
      ) : (
        <div className="relative mt-2">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-lg text-gray-500">₩</span>
          <input
            type="number"
            id="participation-fee"
            placeholder="금액 입력"
            value={value}
            onChange={(e) => onFeeChange(e.target.value)}
            className="pl-10 block w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
          />
           <button
              type="button"
              onClick={() => setIsCustom(false)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              선택입력
            </button>
        </div>
      )}
    </div>
  );
}