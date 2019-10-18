require('isomorphic-fetch');
import { shepherd } from './api';
import * as redux from './ducks';

export { redux, shepherd };

import { IProviderConfig } from './ducks/providerConfigs/types';
export type IProviderConfig = IProviderConfig;
export { TxObj, IProvider } from './types';
