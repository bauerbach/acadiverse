import { combineReducers } from "redux";
import { authSlice } from "./authSlice";
import { accountSlice } from "./accountSlice";
import { errorReducer } from "./errorReducer";

const rootReducer = combineReducers({
  auth: authSlice,
  account: accountSlice,
  errors: errorReducer
});

export default rootReducer;