import { getProviderBalancer } from '../selectors';
import { RootState } from '../../../types';

export const getWorkers = (state: RootState) => getProviderBalancer(state).workers;

export const getWorkerById = (state: RootState, id: string) => getWorkers(state)[id];
