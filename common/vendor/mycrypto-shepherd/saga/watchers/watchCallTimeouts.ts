import { callMeetsBalancerRetryThreshold } from '../../ducks/providerBalancer/balancerConfig/selectors';
import {
  IProviderCall,
  IProviderCallTimeout,
  PROVIDER_CALL,
  providerCallFailed,
  providerCallRequested
} from '../../ducks/providerBalancer/providerCalls';
import { providerOffline } from '../../ducks/providerBalancer/providerStats';
import { providerExceedsRequestFailureThreshold } from '../../ducks/selectors';
import { createRetryCall } from '../sagaUtils';
import { put, select, takeEvery } from 'redux-saga/effects';

function* handleCallTimeouts(action: IProviderCallTimeout) {
  const {
    payload: { error, providerCall }
  } = action;
  const { providerId } = providerCall;

  const shouldSetProviderOffline: ReturnType<
    typeof providerExceedsRequestFailureThreshold
  > = yield select(providerExceedsRequestFailureThreshold, action);

  if (shouldSetProviderOffline) {
    yield put(providerOffline({ providerId }));
  }

  const callFailed: ReturnType<typeof callMeetsBalancerRetryThreshold> = yield select(
    callMeetsBalancerRetryThreshold,
    action
  );

  if (callFailed) {
    yield put(providerCallFailed({ error: error.message, providerCall }));
  } else {
    const nextProviderCall: IProviderCall = createRetryCall(providerCall);
    yield put(providerCallRequested(nextProviderCall));
  }
}

export const callTimeoutWatcher = [takeEvery(PROVIDER_CALL.TIMEOUT, handleCallTimeouts)];
