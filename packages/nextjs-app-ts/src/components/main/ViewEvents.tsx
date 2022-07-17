import { formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import React, { FC } from 'react';

export const formatDisplayAddress = (address: string): string => {
  return address.slice(0, 6).concat('...').concat(address.slice(-4));
};

interface TxnEvent {
  event: 'BuyTokens' | 'SellTokens';
  args: [string, BigNumber, BigNumber]; // address, eth amount, token amount
  blockNumber: number;
}

export const ViewEvents: FC<{ buyEvents: TxnEvent[]; sellEvents: TxnEvent[] }> = ({ buyEvents, sellEvents }) => {
  const allUnsorted = buyEvents.concat(sellEvents);
  const sortedEvents = allUnsorted.sort((n1: TxnEvent, n2: TxnEvent) => {
    return n1.blockNumber - n2.blockNumber;
  });

  const colDefs = ['ADDRESS', 'TXN', 'TOKENS', 'VALUE'];

  const headers = colDefs.map((title: string) => {
    return (
      <th className="px-6 text-xl font-medium opacity-70 text-brown font-body" key={title}>
        {title}
        <div className="w-32 border-t-2 border-color-brown" />
      </th>
    );
  });

  const Row: React.FC<{ event: TxnEvent }> = ({ event }) => {
    return (
      <tr>
        <td className="py-2 text-lg">{formatDisplayAddress(event.args[0])}</td>
        <td className="py-2 text-lg">{event.event === 'BuyTokens' ? 'BOUGHT' : 'SOLD'}</td>
        <td className="py-2 text-lg">{formatEther(BigNumber.from(event.args[2]))} GLD ⚜️ </td>
        <td className="py-2 text-lg">{formatEther(BigNumber.from(event.args[1]))} ETH ♦ </td>
      </tr>
    );
  };

  const rows = sortedEvents.map((event: TxnEvent) => {
    return <Row key={event.blockNumber} event={event} />;
  });

  if (sortedEvents)
    return (
      <div className="flex flex-col items-center py-6">
        <span id="info-text" className="text-xl font-bold font-display">
          VENDOR TRANSACTION HISTORY:
        </span>
        <table className="table-auto">
          <thead>
            <tr>{headers}</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  else return <></>;
};
