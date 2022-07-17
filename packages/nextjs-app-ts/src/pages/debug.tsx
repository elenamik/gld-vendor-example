import { GenericContract } from 'eth-components/ant/generic-contract';
import { useEthersAdaptorFromProviderOrSigners } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { useDexEthPrice } from 'eth-hooks/dapps';
import { asEthersAdaptor } from 'eth-hooks/functions';
import React, { FC, ReactElement } from 'react';

import { useLoadAppContracts, useConnectAppContracts, useAppContracts } from '~common/components/context';
import { useBurnerFallback } from '~common/components/hooks/useBurnerFallback';
import { useScaffoldAppProviders } from '~common/components/hooks/useScaffoldAppProviders';
import { Footer } from '~~/components/common/Footer';
import { Header } from '~~/components/common/Header';
import {
  BURNER_FALLBACK_ENABLED,
  CONNECT_TO_BURNER_AUTOMATICALLY,
  INFURA_ID,
  LOCAL_PROVIDER,
  MAINNET_PROVIDER,
  TARGET_NETWORK_INFO,
} from '~~/config/app.config';

interface IDebugPageProps {
  pageName: string;
  children?: ReactElement;
}

const Debug: FC<IDebugPageProps> = () => {
  const scaffoldAppProviders = useScaffoldAppProviders({
    targetNetwork: TARGET_NETWORK_INFO,
    connectToBurnerAutomatically: CONNECT_TO_BURNER_AUTOMATICALLY,
    localProvider: LOCAL_PROVIDER,
    mainnetProvider: MAINNET_PROVIDER,
    infuraId: INFURA_ID,
  });

  const ethersAppContext = useEthersAppContext();
  useBurnerFallback(scaffoldAppProviders, BURNER_FALLBACK_ENABLED);
  useLoadAppContracts();
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(MAINNET_PROVIDER);
  useConnectAppContracts(mainnetAdaptor);
  useConnectAppContracts(asEthersAdaptor(ethersAppContext));

  const GLD = useAppContracts('GLD', ethersAppContext.chainId);
  const Vendor = useAppContracts('Vendor', ethersAppContext.chainId);

  const [ethPrice] = useDexEthPrice(
    scaffoldAppProviders.mainnetAdaptor?.provider,
    ethersAppContext.chainId !== 1 ? scaffoldAppProviders.targetNetwork : undefined
  );

  return (
    <div className="App">
      <Header scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
      <GenericContract
        contractName="Vendor"
        contract={Vendor}
        mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
        blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}></GenericContract>
      <GenericContract
        contractName="GLD"
        contract={GLD}
        mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
        blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}></GenericContract>
      <Footer scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
    </div>
  );
};

export default Debug;
