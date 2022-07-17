import React, { FC } from 'react';

export const TransactionInput: FC<{ unit: string; onChange: any; value: number }> = ({ unit, onChange, value }) => {
  return (
    <div id="quantity-input-container" className="flex flex-row justify-between w-96 bg-yellow">
      <input
        id="quantity-input"
        className="w-3/4 p-1 text-xl bg-yellow"
        type="text"
        onChange={onChange}
        value={value}
      />
      <span id="quantity-unit" className="inline-flex items-center px-3 text-xl bg-yellow">
        {unit}
      </span>
    </div>
  );
};
