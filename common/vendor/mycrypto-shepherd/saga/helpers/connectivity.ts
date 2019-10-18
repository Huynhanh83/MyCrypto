import { getProviderTimeoutThreshold } from '../../ducks/providerConfigs';
import { providerStorage } from '../../providers/providerStorage';
import { logger } from '../../utils/logging';
import { delay } from 'redux-saga';
import { apply, call, race, select } from 'redux-saga/effects';

/**
 * @description polls the offline state of a provider, then returns control to caller when it comes back online
 * @param {string} providerId
 */
export function* checkProviderConnectivity(providerId: string) {
  const provider = providerStorage.getInstance(providerId);
  const timeoutThreshold: ReturnType<typeof getProviderTimeoutThreshold> = yield select(
    getProviderTimeoutThreshold,
    providerId
  );
  try {
    const { lb } = yield race({
      lb: apply(provider, provider.getCurrentBlock),
      to: call(delay, timeoutThreshold)
    });
    return !!lb;
  } catch (error) {
    logger.log(error);
  }
  return false;
}
