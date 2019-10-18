import { AllActions } from './types';
import { Dispatch, Middleware } from 'redux';

import { SUBSCRIBE } from './subscribe';
// this should be the last middleware, immediately before the store
// if it's an subscription action then do not dispatch it to the store
export const filterMiddlware: Middleware = () => (next: Dispatch<AllActions>) => (
  action: AllActions
): any => (action.type === SUBSCRIBE.ACTION ? undefined : next(action));
