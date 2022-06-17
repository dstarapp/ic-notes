import { Principal } from '@dfinity/principal';

export const PRINCIPAL_REGEX = /(\w{5}-){10}\w{3}/;
export const CANISTER_REGEX = /(\w{5}-){4}\w{3}/;
export const CANISTER_MAX_LENGTH = 27;
export const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
// export const XTC_ID = 'aanaa-xaaaa-aaaah-aaeiq-cai';

export const isValidPrincipal = (text: string): boolean => {
  return Principal.fromText(text).toText() === text;
};

export const validatePrincipalId = (text: string): boolean => {
  try {
    return Boolean(PRINCIPAL_REGEX.test(text) && isValidPrincipal(text));
  } catch (e) {
    return false;
  }
};

export const validateAccountId = (text): boolean => {
  return text.length === 64 && ALPHANUM_REGEX.test(text);
};

export const validateCanisterId = (text: string): boolean => {
  try {
    return Boolean(text.length <= CANISTER_MAX_LENGTH && isValidPrincipal(text));
  } catch (e) {
    return false;
  }
};