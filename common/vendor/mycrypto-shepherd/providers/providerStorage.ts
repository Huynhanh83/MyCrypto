import { MyCryptoCustomProvider } from './custom';
import { EtherscanProvider } from './etherscan';
import { InfuraProvider } from './infura';
import { RPCProvider } from './rpc';
import { Web3Provider } from './web3';
import {
  IProvider,
  IProviderContructor,
  IRPCProvider,
  IRPCProviderContructor,
  StrIdx
} from '../types';

interface IProviderStorage {
  setClass(providerName: string, Provider: IProviderContructor | IRPCProviderContructor): void;
  getClass(providerName: string): IProviderContructor | IRPCProviderContructor;
  setInstance(providerName: string, provider: IProvider | IRPCProvider): void;
  getInstance(providerName: string): IProvider | IRPCProvider;
}

class ProviderStorage implements IProviderStorage {
  private readonly instances: Partial<StrIdx<IProvider | IRPCProvider>>;
  private readonly classes: Partial<StrIdx<IProviderContructor | IRPCProviderContructor>>;

  constructor(providers: StrIdx<IProviderContructor | IRPCProviderContructor> = {}) {
    this.classes = providers;
    this.instances = {};
  }

  /**
   * Sets the class
   * @param providerName
   * @param Provider
   */
  public setClass(providerName: string, Provider: IProviderContructor | IRPCProviderContructor) {
    this.classes[providerName] = Provider;
  }

  public getClass(providerName: string) {
    const Provider = this.classes[providerName];
    if (!Provider) {
      throw Error(`${providerName} implementation does not exist in storage`);
    }
    return Provider;
  }

  public setInstance(providerName: string, provider: IProvider | IRPCProvider) {
    this.instances[providerName] = provider;
  }

  public getInstance(providerName: string) {
    const provider = this.instances[providerName];
    if (!provider) {
      throw Error(`${providerName} instance does not exist in storage`);
    }
    return provider;
  }
}

export const providerStorage = new ProviderStorage({
  rpc: RPCProvider,
  etherscan: EtherscanProvider,
  infura: InfuraProvider,
  web3: Web3Provider,
  myccustom: MyCryptoCustomProvider
});
