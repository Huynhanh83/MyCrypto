import { storeManager } from './store';
import { RootState } from '../types';

export const getRootState = (s: any): RootState => {
  const customRoot = storeManager.getRoot();
  return customRoot ? s[customRoot] : s;
};
