const BASE_URL = 'https://unipos.me';

export const MAX_REQUEST_RESULT = 500000;
export const API_URL = `${BASE_URL}/q/jsonrpc`;
export const USER_ID_REGEX = new RegExp(`${BASE_URL}/.*?i=([a-f0-9-]+)`);
