import { watchers } from './watchers';
import { all } from 'redux-saga/effects';

export function* providerBalancer() {
  yield all(watchers);
}
