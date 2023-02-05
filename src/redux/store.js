import { combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import thunk from "redux-thunk";
import blockchainReducer from "./blockchain/blockchainReducer";
import dataReducer from "./data/dataReducer";

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
  data: dataReducer,
});


const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;
