import { addProviderConfig, IProviderConfig } from '../ducks/providerConfigs';
import { storeManager } from '../ducks/store';
import { IProviderContructor } from '../types';
import { providerStorage } from './providerStorage';

export function addProvider(providerName: string, Provider: IProviderContructor) {
  return providerStorage.setClass(providerName, Provider);
}

export function useProvider(
  providerName: string,
  instanceName: string,
  config: IProviderConfig,
  ...args: any[]
) {
  const Provider = providerStorage.getClass(providerName);
  const provider = new Provider(...args);
  providerStorage.setInstance(instanceName, provider);
  const action = addProviderConfig({ config, id: instanceName });
  storeManager.getStore().dispatch(action);
  return config;
}
