import { ethers } from 'ethers';
import React, { FC, useState } from 'react';

import { TransactionInput } from './TransactionInput';
import { TransactionValue } from './TransactionValue';

import { Vendor, YourToken as YourTokenContract } from '~~/generated/contract-types';

const defaultQuantity = 1;

export const TokenVendor: FC<{
  vendorWrite: Vendor;
  tokenWrite: YourTokenContract;
}> = ({ vendorWrite, tokenWrite }) => {
  const [inputQuantity, setInputQuantity] = useState(defaultQuantity);
  const [action, setAction] = useState<'BUYING' | 'SELLING'>('BUYING');
  const [buying, setBuying] = useState(false);

  // @ts-ignore
  const handleBuyClick = async (): void => {
    setBuying(true);
    const tokensPerEth = await vendorWrite.tokensPerEth();
    const ethCostToPurchaseTokens = ethers.utils.parseEther(`${inputQuantity / parseFloat(tokensPerEth.toString())}`);
    await vendorWrite.buyTokens({ value: ethCostToPurchaseTokens });
    setBuying(false);
  };

  const handleQuantityChange = (event: { target: { value: string } }): void => {
    const re = /^[0-9\b]+$/;
    const val = event.target.value;
    if (val === '' || re.test(val)) {
      // TODO: deal with string / big number typing on this.
      setInputQuantity(val);
    }
  };

  return (
    <div className="w-1/2 m-auto">
      <div id="container" className="flex flex-col items-center">
        <div id="tabs" className="flex flex-row justify-between w-full">
          <button
            onClick={(): void => {
              setAction('BUYING');
              setInputQuantity(1);
            }}
            className={
              'flex-grow px-10 py-4 text-2xl font-bold text-center border-2 border-b-0 font-display rounded-t-2xl ' +
              (action === 'BUYING' ? 'bg-white' : 'bg-gray opacity-50')
            }>
            BUY
          </button>
          <button
            onClick={(): void => {
              setAction('SELLING');
              setInputQuantity(1);
            }}
            className={
              'flex-grow px-10 py-4 text-2xl font-bold text-center border-2 border-b-0 font-display rounded-t-2xl ' +
              (action === 'SELLING' ? 'bg-white' : 'bg-gray opacity-50')
            }>
            SELL
          </button>
        </div>
        <div
          id="buy-sell-tab-content"
          className="flex flex-col items-center w-full py-4 bg-white border-2 rounded-b-xl">
          <TransactionInput unit="GLD" onChange={handleQuantityChange} value={inputQuantity} />
          <div className="p-2 text-lg">⚜️ FOR ⚜️</div>
          <TransactionValue unit="ETH" value={inputQuantity / 100} />
          {action === 'BUYING' ? (
            <button
              className="p-1 mt-4 text-lg font-bold border-2 rounded-md font-display w-72"
              onClick={handleBuyClick}>
              EXECUTE
            </button>
          ) : (
            <SellButton vendorWrite={vendorWrite} tokenWrite={tokenWrite} inputQuantity={inputQuantity} />
          )}
        </div>
      </div>
    </div>
  );
};

export const SellButton: FC<{
  vendorWrite: Vendor;
  tokenWrite: YourTokenContract;
  inputQuantity: string;
}> = ({ vendorWrite, tokenWrite, inputQuantity }) => {
  const [approved, setApproved] = useState(false);

  const handleApprove = async () => {
    await tokenWrite.approve(vendorWrite.address, ethers.utils.parseEther(inputQuantity));
    setApproved(true);
  };
  const handleSell = async () => {
    console.log(inputQuantity, ethers.utils.parseEther(inputQuantity));
    await vendorWrite.sellTokens(ethers.utils.parseEther(inputQuantity));
    setApproved(false);
  };

  if (!approved) {
    return (
      <button className="p-1 mt-4 text-lg font-bold border-2 rounded-md font-display w-72" onClick={handleApprove}>
        APPROVE
      </button>
    );
  } else {
    return (
      <button className="p-1 mt-4 text-lg font-bold border-2 rounded-md font-display w-72" onClick={handleSell}>
        EXECUTE
      </button>
    );
  }
};
