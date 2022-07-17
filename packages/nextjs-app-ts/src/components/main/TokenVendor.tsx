import { useContractReader } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { ethers } from 'ethers';
import React, { FC, useState } from 'react';

import { TransactionInput } from './TransactionInput';
import { TransactionValue } from './TransactionValue';

import { useAppContracts } from '~common/components/context';
import { Vendor, GLD } from '~common/generated/contract-types';

const defaultQuantity = '1';

export const TokenVendor: FC = () => {
  const ethersAppContext = useEthersAppContext();
  const GLD = useAppContracts('GLD', ethersAppContext.chainId);
  const Vendor = useAppContracts('Vendor', ethersAppContext.chainId);

  const [tokensPerEth] = useContractReader(Vendor, Vendor?.tokensPerEth);
  console.log(tokensPerEth?.toString());

  const [inputQuantity, setInputQuantity] = useState(defaultQuantity);
  const [action, setAction] = useState<'BUYING' | 'SELLING'>('BUYING');
  const [buying, setBuying] = useState(false);

  const handleBuyClick = async () => {
    // TODO: add try catch
    setBuying(true);
    const ethCostToPurchaseTokens = ethers.utils.parseEther(`${inputQuantity / tokensPerEth?.toString()}`);
    console.log('eth to purchase', ethCostToPurchaseTokens);
    await Vendor!.buyTokens({ value: ethCostToPurchaseTokens });
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
              setInputQuantity(defaultQuantity);
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
              setInputQuantity(defaultQuantity);
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
          <TransactionValue
            unit="ETH"
            value={parseFloat(inputQuantity) / parseFloat(tokensPerEth?.toString() ?? defaultQuantity)}
          />
          {action === 'BUYING' ? (
            <button
              className="p-1 mt-4 text-lg font-bold border-2 rounded-md font-display w-72"
              onClick={handleBuyClick}>
              EXECUTE
            </button>
          ) : (
            <SellButton vendorWrite={Vendor} tokenWrite={GLD} inputQuantity={inputQuantity} />
          )}
        </div>
      </div>
    </div>
  );
};

export const SellButton: FC<{
  vendorWrite?: Vendor;
  tokenWrite?: GLD;
  inputQuantity: string;
}> = ({ vendorWrite, tokenWrite, inputQuantity }) => {
  const [approved, setApproved] = useState(false);

  const handleApprove = async () => {
    await tokenWrite!.approve(vendorWrite!.address, ethers.utils.parseEther(inputQuantity));
    setApproved(true);
  };
  const handleSell = async () => {
    await vendorWrite!.sellTokens(ethers.utils.parseEther(inputQuantity));
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
