import * as CryptoJS from 'crypto-js';
import { CreateMnemonicKey, GetDeviceMnemonic, GetNotesKey, ImportMnemonicKey, SaveDeviceMnemonicKey } from './identity';
import { DeleteCurrentLocalKey, GetCurrentLocalKey, UpdateCurrentLocalKey } from './local';
import { NotesSync, RemoveDevice } from './notes/sync';
import { EncryptByPublicKey, NotesMnemonicKey } from './key';

// interface AESKey {
//   encrypt(str : string): string;
//   decrypt(str: string): string;
// }
// var NotesAES : AESKey =  {
//   encrypt(str : string): string {
//     return '';
//   },
//   decrypt(str: string): string {
//     return '';
//   }
// }

var _key: string = '';
const generateKey = () => {
  let p = CryptoJS.lib.WordArray.random(128 / 8);
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  let key = CryptoJS.PBKDF2(p, salt, { keySize: 512 / 32, iterations: 1000 });
  return key.toString();
}

export const SeedAesKey = async (): Promise<boolean> => {
  let notes = GetNotesKey();
  if (notes == null) {
    return false;
  }
  let key = generateKey();
  _key = notes.encrypt(key);

  try {
    let ret = await NotesSync().seed(notes.getPublickey(), _key);
    if (ret) {
      UpdateCurrentLocalKey({ 'ak': _key })
    }
    console.log('SeedKey success');
    return ret;
  } catch (e) {
    console.log(e);
  }
  return false;
}

export const HasAesKey = (): boolean => {
  let data = GetCurrentLocalKey();
  if (!data || !data.ak) {
    return false;
  }
  return true;
}

export const CheckIsSeed = async (): Promise<boolean> => {
  let data = GetCurrentLocalKey();
  if (!data || !data.ak) {
    let ret = await NotesSync().isSeeded();
    return ret;
  }
  return true;
}

export const CheckAesKey = async (): Promise<boolean> => {
  let notes = GetNotesKey();
  if (notes == null) {
    return false;
  }
  let data = GetCurrentLocalKey();
  if (!data || !data.ak) {
    let ret = await NotesSync().isSeeded();
    if (!ret) {
      return await SeedAesKey();
    } else {
      console.log('isSeed, but no ak...!!!!');
      return false;
    }
  }
  _key = data.ak;

  // let str = AesEncrypt('1234567890');
  // console.log(str, AesDecrypt(str));

  return true;
}

export const AesEncrypt = (str: string): string => {
  let notes = GetNotesKey();
  if (notes == null) {
    return '';
  }
  try {
    let key = notes.decrypt(_key);
    let encrypted = (CryptoJS.AES.encrypt(str, key))
    return encrypted.toString()
  } catch (e) {
    console.log('AesEncrypt', e)
  }
  return 'AesEncrypt error, It is not a true key';
}

export const AesDecrypt = (str: string): string => {
  let notes = GetNotesKey();
  if (notes == null) {
    return '';
  }
  try {
    let key = notes.decrypt(_key);
    let decrypt = CryptoJS.AES.decrypt(str, key);
    return decrypt.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.log('AesDecrypt', e)
  }
  return 'AesDecrypt error, It is not a true key';
}

export const AesShaEncrypt = (str: string, key: string): string => {
  try {
    key = CryptoJS.SHA3(key);
    let encrypted = (CryptoJS.AES.encrypt(str, key.toString()))
    return encrypted.toString()
  } catch (e) {
    console.log(e)
  }
  return '';
}

export const AesShaDecrypt = (str: string, key: string): string => {
  try {
    key = CryptoJS.SHA3(key);
    let decrypt = (CryptoJS.AES.decrypt(str, key.toString()))
    return decrypt.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.log(e)
  }
  return '';
}

export const GetAesKeyByPublicKey = (pkeyb64: string): string => {
  let notes = GetNotesKey();
  if (notes == null) {
    return '';
  }
  try {
    let key = notes.decrypt(_key);
    return EncryptByPublicKey(pkeyb64, key);
  } catch (e) {
    console.log('AesDecrypt', e)
  }
  return '';
}


export const SubmitKeySync = async (pkeys: string[]): Promise<boolean> => {
  let notes = GetNotesKey();
  if (notes == null) {
    return false;
  }
  let args: any = [];
  pkeys.forEach((pk) => {
    let text = GetAesKeyByPublicKey(pk);
    if (text) {
      args.push([pk, text]);
    }
  })
  if (args.length <= 0) {
    return false;
  }
  await NotesSync().submit_ciphertexts(args)
  return true;
}

export const SyncCurrentAesKey = async (): Promise<string> => {
  let notes = GetNotesKey();
  if (notes == null) {
    return 'wait';
  }
  let pkey = notes.getPublickey();
  let ret = await NotesSync().get_ciphertext(pkey);
  console.log(ret)
  if (ret && ret.ok) {
    UpdateCurrentLocalKey({ 'ak': ret.ok, 'bk': 1 });
    return 'success';
  } else if (ret && ret.err && ret.err.hasOwnProperty('notFound')) {
    DeleteCurrentLocalKey();
    return 'restart';
  }
  return 'wait';
}

export const RemoveCurrentDevice = async (): Promise<boolean> => {
  let notes = GetNotesKey();
  if (notes == null || !notes.getAlias()) {
    return false;
  }
  await RemoveDevice(notes.getAlias());
  return DeleteCurrentLocalKey();
}

export const RegsiterCurrentDevice = async (alias: string): Promise<boolean> => {
  let key = await CreateMnemonicKey(alias)
  let agent = navigator.userAgent
  try {
    let ok = await NotesSync().register_device(alias, agent, key.getPublickey())
    console.log('register_device', ok)
    if (!ok) {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
  return SaveDeviceMnemonicKey();
}

//
export const ImportMnemonicCheck = async (mn: string): Promise<boolean> => {
  let key = await NotesMnemonicKey.fromMnemonic(mn, 'mnemonic_test')
  let pkey = key.getPublickey()
  let ret = await NotesSync().get_ciphertext(pkey);
  if (ret && ret.ok) {
    UpdateCurrentLocalKey({ 'ak': ret.ok, 'bk': 1 });
    return true
  }
  return false;
}

export const ImportMnemonicSave = async (mn: string, alias: string): Promise<boolean> => {
  let key = await ImportMnemonicKey(mn, alias);
  let agent = navigator.userAgent
  let ok = await NotesSync().register_device(alias, agent, key.getPublickey())
  console.log('register_device', ok)
  if (ok) {
    return SaveDeviceMnemonicKey();
  }
  // UpdateCurrentLocalKey({'ak': ak, 'bk': 1});
  return false;
}

export const SetPassSecret = async (pass: string): Promise<boolean> => {
  let str = GetDeviceMnemonic();
  if (!str) {
    return false;
  }
  try {
    let secret = AesShaEncrypt(str, pass);
    let ok = await NotesSync().setSuperSecret(secret);
    if (ok) {

    }
    return ok;
  } catch (e) {
    console.log(e);
  }
  return false;
}

export const GetPhraseByPass = async (pass: string): Promise<string> => {
  try {
    let str = await NotesSync().getSuperSecret();
    if (!str) {
      return '';
    }
    return AesShaDecrypt(str, pass);
  } catch (e) {
    console.log(e);
  }
  return '';
}