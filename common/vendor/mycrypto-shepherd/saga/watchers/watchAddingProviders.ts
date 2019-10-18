import { BALANCER } from '../../ducks/providerBalancer/balancerConfig';
import { getNetwork } from '../../ducks/providerBalancer/balancerConfig/selectors';
import { ProcessedProvider, providerAdded } from '../../ducks/providerBalancer/providerStats';
import { IAddProviderConfig, PROVIDER_CONFIG } from '../../ducks/providerConfigs/types';
import { processProvider } from '../helpers/processing';
import { call, put, race, select, take, takeEvery } from 'redux-saga/effects';

function* handleAddingProviderConfig({ payload: { config, id } }: IAddProviderConfig) {
  const network: ReturnType<typeof getNetwork> = yield select(getNetwork);
  if (network !== config.network) {
    return;
  }

  const { processedProvider }: { processedProvider: ProcessedProvider } = yield race({
    processedProvider: call(processProvider, id, config),
    cancelled: take(BALANCER.NETWORK_SWTICH_REQUESTED)
  });

  if (!processedProvider) {
    return;
  }

  yield put(providerAdded(processedProvider));
}

export const addProviderConfigWatcher = [
  takeEvery(PROVIDER_CONFIG.ADD, handleAddingProviderConfig)
];
