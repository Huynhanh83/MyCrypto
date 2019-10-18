import { getRootState } from '../rootState';
import { RootState } from '../../types';

export const getProviderBalancer = (state: RootState) => getRootState(state).providerBalancer;
