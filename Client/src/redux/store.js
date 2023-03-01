import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import faceidReducer from './reducers';

const rootReducer = combineReducers({faceidReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
