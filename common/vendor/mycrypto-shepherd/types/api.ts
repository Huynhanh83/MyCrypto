import { BalancerConfigInitConfig } from '../ducks/providerBalancer/balancerConfig';
import { IProviderConfig } from '../ducks/providerConfigs';
import { IProvider, IProviderContructor, StrIdx } from './';
import { Store } from 'redux';

export interface IInitConfig extends BalancerConfigInitConfig {
  customProviders?: StrIdx<IProviderContructor>;
  storeRoot?: string;
  store?: Store<any>;
}

export interface IShepherd {
  init(config: IInitConfig): Promise<IProvider>;
  addProvider(providerName: string, Provider: IProviderContructor): void;
  useProvider(
    providerName: string,
    instanceName: string,
    config: IProviderConfig,
    ...args: any[]
  ): void;
  switchNetworks(network: string): Promise<void>;
  manual(providerId: string, skipOfflineCheck: boolean): Promise<string>;
  auto(): void;
  enableLogging(): void;
}
