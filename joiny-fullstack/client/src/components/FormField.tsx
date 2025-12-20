import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  as?: 'input' | 'textarea';
  [key: string]: any; // 그 외 모든 props를 받을 수 있도록 설정
}

export default function FormField({ label, id, as = 'input', ...props }: FormFieldProps) {
  const commonClasses = "mt-2 block w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white";

  return (
    <div>
      <label htmlFor={id} className="text-lg font-semibold text-gray-700">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          {...props}
          className={commonClasses}
        />
      ) : (
        <input
          id={id}
          {...props}
          className={commonClasses}
        />
      )}
    </div>
  );
}