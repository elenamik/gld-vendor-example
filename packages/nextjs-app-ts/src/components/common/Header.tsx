import { getNetwork } from '@ethersproject/networks';
import { Alert } from 'antd';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useGasPrice } from 'eth-hooks';
import {
  useEthersAppContext,
  connectorErrorText,
  NoStaticJsonRPCProviderFoundError,
  CouldNotActivateError,
  UserClosedModalError,
} from 'eth-hooks/context';
import React, { FC, ReactElement, ReactNode, useCallback, useContext } from 'react';

import { Account } from './Account';

import { FaucetHintButton } from '~common/components';
import { useAntNotification } from '~common/components/hooks';
import { getNetworkInfo } from '~common/functions';
import { IScaffoldAppProviders } from '~common/models';
import { FAUCET_ENABLED } from '~~/config/app.config';

// displays a page header
export interface IHeaderProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
  children?: ReactNode;
}

/**
 * ✏ Header: Edit the header and change the title to your project name.  Your account is on the right *
 * @param props
 * @returns
 */
export const Header: FC<IHeaderProps> = (props) => {
  const settingsContext = useContext(EthComponentsSettingsContext);
  const ethersAppContext = useEthersAppContext();
  const selectedChainId = ethersAppContext.chainId;

  const notification = useAntNotification();

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));

  /**
   * this shows the page header and other informaiton
   */
  const left = <div className="p-12" />;

  const onLoginError = useCallback(
    (e: Error) => {
      if (e instanceof UserClosedModalError) {
        notification.info({
          message: connectorErrorText.UserClosedModalError,
          description: e.message,
        });
      } else if (e instanceof NoStaticJsonRPCProviderFoundError) {
        notification.error({
          message: 'Login Error: ' + connectorErrorText.NoStaticJsonRPCProviderFoundError,
          description: e.message,
        });
      } else if (e instanceof CouldNotActivateError) {
        notification.error({
          message: 'Login Error: ' + connectorErrorText.CouldNotActivateError,
          description: e.message,
        });
      } else {
        notification.error({ message: 'Login Error: ', description: e.message });
      }
    },
    [notification]
  );

  /**
   * display the current network on the top left
   */
  let networkDisplay: ReactElement | undefined;
  if (selectedChainId && selectedChainId !== props.scaffoldAppProviders.targetNetwork.chainId) {
    const description = (
      <div>
        You have <b>{getNetwork(selectedChainId)?.name}</b> selected and you need to be on{' '}
        <b>{getNetwork(props.scaffoldAppProviders.targetNetwork)?.name ?? 'UNKNOWN'}</b>.
      </div>
    );
    networkDisplay = (
      <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 84, padding: 2 }}>
        <Alert message="⚠️ Wrong Network" description={description} type="error" closable={false} />
      </div>
    );
  } else {
    networkDisplay = (
      <div
        style={{
          right: 10,
          top: 10,
          padding: 2,
          color: props.scaffoldAppProviders.targetNetwork.color,
          fontSize: 12,
        }}>
        {props.scaffoldAppProviders.targetNetwork.name}
      </div>
    );
  }

  /**
   * 👨‍💼 Your account is in the top right with a wallet at connect options
   */
  const right = (
    <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 12, padding: 10, zIndex: 1 }}>
      {networkDisplay}
      <Account
        createLoginConnector={props.scaffoldAppProviders.createLoginConnector}
        loginOnError={onLoginError}
        ensProvider={props.scaffoldAppProviders.mainnetAdaptor?.provider}
        price={props.price}
        blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        hasContextConnect={true}
      />
      <FaucetHintButton
        ethComponentSettings={settingsContext}
        scaffoldAppProviders={props.scaffoldAppProviders}
        gasPrice={gasPrice}
        faucetEnabled={FAUCET_ENABLED}
      />
      {props.children}
    </div>
  );

  return (
    <>
      {left}
      {right}
    </>
  );
};
