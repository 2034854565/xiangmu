//actions/login.js
export const saveDataFun = (data) => {
  return {
    type: 'ACTION_TYPE',
    data: data,
  };
};

// src/store/index.js
import { createStore } from 'redux';
const counterReducer = (state = { counter: 0 }, action) => {
  console.log('action');
  console.log(action);

  if (action.type === 'increment') {
    return { counter: state.counter + 1, data: action.data };
  }
  if (action.type === 'decrement') {
    return { counter: state.counter - 1 };
  }
  return state;
};

const store = createStore(counterReducer);
export default store;
