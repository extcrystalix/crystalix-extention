import {
  ACCOUNT_AUTH,
  ACCOUNT_PROFILE,
  ACCOUNT_LOGOUT,
  ACCOUNT_THEME,
  ACCOUNT_CHANGE_SERVER,
  ACCOUNT_ADD_WALLET, CREATE_WALLET,
} from '../actions/account';

const initialState = {
  init: false,
  token: false,
  name: '',
  keywords: false,
  theme: 'light',
  server: 'main.ton.dev',
  wallets: []
};

export default function account(state = initialState, action) {
  const {type, data} = action;
  switch (type) {
    case ACCOUNT_THEME:
      return {
        ...state,
        theme: data
      };
    case ACCOUNT_AUTH:
      return {
        ...state,
        token: data
      };
    case ACCOUNT_PROFILE:
      const {name, keywords} = data;
      return {
        ...state,
        name,
        keywords: Array.isArray(keywords)? keywords.slice() : false
      };
    case ACCOUNT_LOGOUT:
      return {
        ...state,
        token: false,
        name: '',
        keywords: false
      };
    case ACCOUNT_CHANGE_SERVER:
      return {
        ...state,
        server: data
      };
    case CREATE_WALLET:
      const wallets = [...(state.wallets || [])]
      wallets.push(data)
      return {
        ...state,
        wallets
      };
    default:
      return state;
  }
}
