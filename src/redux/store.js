
import { createStore, combineReducers,applyMiddleware } from 'redux';
import redux_reducer from './reducers';
import middleware from './middleware';

const reducer = combineReducers({
    redux_reducer,
});
const store = createStore(reducer,undefined,applyMiddleware(middleware));
export default store;