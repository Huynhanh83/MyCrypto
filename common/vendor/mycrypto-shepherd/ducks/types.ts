import { ProviderBalancerAction } from './providerBalancer';
import { ProviderConfigAction } from './providerConfigs/types';
import { SubscribeAction } from './subscribe/types';

export type AllActions = ProviderBalancerAction | ProviderConfigAction | SubscribeAction;
