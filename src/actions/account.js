export const ACCOUNT_AUTH = 'ACCOUNT_AUTH';
export const ACCOUNT_PROFILE = 'ACCOUNT_PROFILE';
export const ACCOUNT_LOGOUT = 'ACCOUNT_LOGOUT';
export const ACCOUNT_THEME = 'ACCOUNT_THEME';
export const ACCOUNT_INIT = 'ACCOUNT_INIT';
export const CREATE_WALLET = 'CREATE_WALLET';
export const ACCOUNT_CHANGE_SERVER = 'ACCOUNT_CHANGE_SERVER';
export const ACCOUNT_ADD_WALLET = 'ACCOUNT_ADD_WALLET';
export const WALLET_CHANGE_SETTINGS = 'WALLET_CHANGE_SETTINGS';
export const WALLET_DELETE = 'WALLET_DELETE';

export const accountAuth = data => ({
  type: ACCOUNT_AUTH, data
});

export const accountProfile = data => ({
  type: ACCOUNT_PROFILE, data
});

export const accountLogout = () => ({
  type: ACCOUNT_LOGOUT
});

export const accountTheme = data => ({
  type: ACCOUNT_THEME, data
});

export const accountInit = data => ({
  type: ACCOUNT_INIT, data
});

export const createWallet = data => ({
  type: CREATE_WALLET, data
});

export const changeServer = data => ({
  type: ACCOUNT_CHANGE_SERVER, data
});

export const changeSettings = data => ({
  type: WALLET_CHANGE_SETTINGS, data
});

export const walletDelete = data => ({
  type: WALLET_DELETE, data
});

