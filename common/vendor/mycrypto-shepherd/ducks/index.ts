import { filterMiddlware } from './middleware';
import { providerBalancer, providerBalancerSelectors } from './providerBalancer';
import { providerConfigs } from './providerConfigs';
import * as providerConfigsSelectors from './providerConfigs/selectors';
import { storeManager } from './store';
import { RootState } from '../types';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'remote-redux-devtools';
import { providerBalancer as providerBalancerSaga } from '../saga';
import * as rootSelectors from './selectors';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = composeWithDevTools({
  realtime: true,
  port: 8000,
  maxAge: 300
});

const rootReducer = combineReducers<RootState>({
  providerBalancer,
  providerConfigs
});

// prettier-ignore
//@ts-ignore
const middleware = process.env.DEV_TOOLS ? composeEnhancers(applyMiddleware(sagaMiddleware, filterMiddlware)) : applyMiddleware(sagaMiddleware, filterMiddlware);

const store = createStore<RootState>(rootReducer, middleware);
storeManager.setStore(store);

const INITIAL_ROOT_STATE = rootReducer(undefined as any, {} as any);

sagaMiddleware.run(providerBalancerSaga);

const selectors = {
  rootSelectors,
  providerBalancerSelectors,
  providerConfigsSelectors
};

export {
  filterMiddlware as shepherdMiddlware,
  providerBalancerSaga,
  rootReducer,
  store,
  INITIAL_ROOT_STATE,
  selectors
};
