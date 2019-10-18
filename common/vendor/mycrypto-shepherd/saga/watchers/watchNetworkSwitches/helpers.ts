import { ProcessedProvider } from '../../../ducks/providerBalancer/providerStats';
import { getAllProvidersOfNetwork } from '../../../ducks/selectors';
import { processProvider } from '../../helpers/processing';
import { reduceProcessedProviders } from '../../sagaUtils';
import { all, call, select } from 'redux-saga/effects';

/**
 * @description Gets all of the providers of the requested next network,
 * then creates all of the workers and provider statistics required for a successful switch
 * @param network
 */
export function* initializeNewNetworkProviders(network: string) {
  const providers: ReturnType<typeof getAllProvidersOfNetwork> = yield select(
    getAllProvidersOfNetwork,
    network
  );

  const providerEntries = Object.entries(providers).map(([providerId, providerConfig]) =>
    call(processProvider, providerId, providerConfig)
  );

  // process adding all providers in parallel
  const processedProviders: ProcessedProvider[] = yield all(providerEntries);
  const networkSwitchPayload = reduceProcessedProviders(processedProviders, network);

  return networkSwitchPayload;
}
