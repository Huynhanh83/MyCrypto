import { getManualMode } from '../ducks/providerBalancer/balancerConfig/selectors';
import {
  IProviderCall,
  IProviderCallFailed,
  IProviderCallFlushed,
  IProviderCallSucceeded,
  PROVIDER_CALL,
  providerCallRequested
} from '../ducks/providerBalancer/providerCalls';
import { storeManager } from '../ducks/store';
import { subscribeToAction } from '../ducks/subscribe';
import { triggerOnMatchingCallId } from '../ducks/subscribe/utils';
import { AllProviderMethods, IProvider, Reject, Resolve } from '../types';
import { idGeneratorFactory } from '../utils/idGenerator';
import { logger } from '../utils/logging';
import { allRPCMethods } from './constants';

const idGenerator = idGeneratorFactory();

const respondToCallee = (resolve: Resolve, reject: Reject) => (
  action: IProviderCallFailed | IProviderCallSucceeded | IProviderCallFlushed
) => {
  if (action.type === PROVIDER_CALL.SUCCEEDED) {
    const { providerCall, result } = action.payload;

    logger.log(`CallId: ${providerCall.callId} Pid: ${providerCall.providerId}
     ${providerCall.rpcMethod} ${providerCall.rpcArgs}
     Result: ${result}`);

    resolve(action.payload.result);
  } else {
    reject(Error(action.payload.error));
  }
};

const makeProviderCall = (rpcMethod: AllProviderMethods, rpcArgs: string[]): IProviderCall => {
  const isManual = getManualMode(storeManager.getStore().getState());

  const providerCall: IProviderCall = {
    callId: idGenerator(),
    numOfRetries: 0,
    rpcArgs,
    rpcMethod,
    minPriorityProviderList: [],
    ...(isManual ? { providerWhiteList: [isManual] } : {})
  };

  return providerCall;
};

const dispatchRequest = (providerCall: IProviderCall) => {
  // make the request to the load balancer
  const networkReq = providerCallRequested(providerCall);
  storeManager.getStore().dispatch(networkReq);
  return networkReq.payload.callId;
};

const waitForResponse = (callId: number) =>
  new Promise((resolve, reject) =>
    storeManager.getStore().dispatch(
      subscribeToAction({
        trigger: triggerOnMatchingCallId(callId, false),
        callback: respondToCallee(resolve, reject)
      })
    )
  );

const providerCallDispatcher = (rpcMethod: AllProviderMethods) => (...rpcArgs: string[]) => {
  const providerCall = makeProviderCall(rpcMethod, rpcArgs);
  const callId = dispatchRequest(providerCall);
  return waitForResponse(callId);
};

const handler: ProxyHandler<IProvider> = {
  get: (target, methodName: AllProviderMethods) => {
    if (!allRPCMethods.includes(methodName)) {
      return target[methodName];
    }
    return providerCallDispatcher(methodName);
  }
};

export const createProviderProxy = () => new Proxy({} as IProvider, handler);
