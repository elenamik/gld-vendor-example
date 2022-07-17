import React, { FC } from 'react';

export const TransactionValue: FC<{ unit: string; value: number }> = ({ unit, value }) => {
  return (
    <div id="quantity-input-container" className="flex flex-row justify-between w-96 bg-yellow">
      <span id="quantity-input" className="w-3/4 p-1 text-xl text-left bg-yellow">
        {value}
      </span>
      <span id="quantity-unit" className="inline-flex items-center px-3 text-xl bg-yellow">
        {unit}
      </span>
    </div>
  );
};
