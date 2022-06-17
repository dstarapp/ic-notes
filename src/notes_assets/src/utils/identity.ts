import { AuthClient } from "@dfinity/auth-client"
import { Identity } from "@dfinity/agent"
import * as Bip39 from 'bip39';
// const bip39 = require('bip39');
// import { generateKeyPair } from 'human-crypto-keys';
// import cryptico from 'cryptico';
// import RSAKey from './seedrsa/rsa';
// import { import_private_pem, import_public_pem } from "./util";
import { NotesMnemonicKey, NotesKey } from './key';
import { GetCurrentLocalKey } from "./local";
import { HasAesKey } from "./aes";

interface NotesInterfaceIdentity {
  isLogin(): boolean;
  isRegister(): boolean;
  isBackup(): boolean;
  init(): Promise<boolean>;
  login(): Promise<boolean>;
  logout(): Promise<boolean>;
  getIdentity(): Identity | null;
}

var _identity: Identity | null = null;
var _key: NotesMnemonicKey | null = null;

export const GetNotesKey = (): NotesKey | null => {
  return _key;
}
// class
export const CreateMnemonicKey = async (alias: string): Promise<NotesKey> => {
  let seed = Bip39.generateMnemonic();
  _key = await NotesMnemonicKey.fromMnemonic(seed, alias);
  return _key;
}

export const ImportMnemonicKey = async (mn: string, alias: string): Promise<NotesKey> => {
  _key = await NotesMnemonicKey.fromMnemonic(mn, alias);
  return _key;
}

export const SaveDeviceMnemonicKey = (): boolean => {
  if (_key == null) {
    return false;
  }
  if (_identity == null) {
    return false;
  }
  NotesMnemonicKey.saveLocal(_key);
  return true;
}

export const GetDeviceMnemonic = (): string | null => {
  if (!_key) {
    return null;
  }
  return _key.getMnemonic();
}

let NotesIdentity: NotesInterfaceIdentity = {
  isLogin(): boolean {
    return _identity !== null;
  },
  isRegister(): boolean {
    return _key != null && HasAesKey();
  },
  isBackup(): boolean {
    return false;
  },
  async init(): Promise<boolean> {
    console.log("notes identity init");
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      _identity = authClient.getIdentity();

      try {
        _key = NotesMnemonicKey.fromLocal();
        return _key != null;
      } catch (e) {
        console.log(e);
      }
      return false;
    }
    return false;
  },
  async login(): Promise<boolean> {
    let host = "https://identity.ic0.app/"
    if (process.env.NODE_ENV !== "production") {
      host = import.meta.env.VITE_II_CANISTER_URL
    }
    try {
      _identity = await new Promise(async (resolve, reject) => {
        let timer: any = setTimeout(() => {
          timer = null
          reject('do II auth timeout!')
        }, 120 * 1000)
        const authClient = await AuthClient.create()
        authClient.login({
          maxTimeToLive: BigInt(24 * 60 * 60 * 1000000000),
          // identityProvider: "https://identity.ic0.app/",
          identityProvider: host,
          onSuccess: async () => {
            if (timer != null) {
              clearTimeout(timer)
              timer = null
            }
            let identity = await authClient.getIdentity()
            return resolve(identity)
          },
          onError: (err) => {
            if (timer != null) {
              clearTimeout(timer)
              timer = null
            }
            reject(err)
          }
        })
      })
    } catch (e) {
      console.log(e)
      return false
    }
    return true
  },
  async logout(): Promise<boolean> {
    const authClient = await AuthClient.create();
    await authClient.logout();
    _key = null;
    _identity = null;
    return true;
  },
  getIdentity(): Identity | null {
    return _identity;
  }
}

// const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost"
// // const key = new RSAKey(seed);
// // key.generate(2048).then(async function(key) {
// //   console.log(key);
// //   console.log(key.privateKey)
// //   console.log(key.publicKey)
// //   // NotesMnemonicKey.fromKeyPair()
// //   // console.log(await import_public_pem(key.publicKey))
// //   // console.log(await import_private_pem(key.privateKey))
// // }).catch(function(error){
// //   console.error(error.toString())
// // })
// NotesMnemonicKey.fromMnemonic(seed).then(async function(k) {
//   let d = await (k.encrypt('1234'))
//   console.log(d)
//   console.log(await k.decrypt(d))
// })
// console.log(await NotesMnemonicKey.fromMnemonic(seed))

export { NotesIdentity }