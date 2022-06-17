// import bip39 from 'bip39';
import RSA from './seedrsa/rsa';
// import { PublicKey } from '@dfinity/agent';
import { RSAKey, KEYUTIL, hextob64, b64tohex } from 'jsrsasign'
import { b64nonenl, b64withnl, pemtob64, wrap_rsa_private, wrap_rsa_public } from './util';
import { GetCurrentLocalKey, UpdateCurrentLocalKey } from './local';
import { NotesIdentity } from './identity';

export interface NotesKey {
  getPublickey(): string
  getAlias(): string
  encrypt(text: string): string
  decrypt(text: string): string
}

export class NotesMnemonicKey implements NotesKey {
  protected _publickey: string;
  protected _publicRsa: RSAKey;
  protected _privateRsa: RSAKey;
  protected _mnemonic: string = ''; //secret
  protected _alias: string;

  public static async fromMnemonic(mnemonic: string, alias: string): Promise<NotesMnemonicKey> {
    let rsa = new RSA(mnemonic);
    const key = await rsa.generate(2048);

    let rsapri: RSAKey = KEYUTIL.getKey(key.privateKey);
    let ps = KEYUTIL.getPEM(rsapri, "PKCS8PRV");
    let _key = new NotesMnemonicKey(pemtob64(key.publicKey), pemtob64(ps), alias);
    _key.setMnemonic(_key.encrypt(mnemonic));
    return _key;
  }

  public static fromLocal(): NotesMnemonicKey | null {
    let dnt = GetCurrentLocalKey()
    if (!dnt || !dnt.pk || !dnt.pvk) {
      return null;
    }
    let _key = new NotesMnemonicKey(dnt.pk, dnt.pvk, dnt.alias);
    _key.setMnemonic(dnt.mm);
    // if (/\r\n/.test(dnt.pk)) {
    //   this.saveLocal(_key);
    // }
    return _key;
  }

  // public static fromKeyPair(publicB64: string, privateB64: string): NotesMnemonicKey {
  //   return new NotesMnemonicKey(publicB64, privateB64);
  // }

  public static saveLocal(_key: NotesMnemonicKey) {
    let pvk = KEYUTIL.getPEM(_key._privateRsa, "PKCS8PRV");
    let data = {
      pk: _key._publickey,
      pvk: pemtob64(pvk),
      mm: _key._mnemonic,
      alias: _key._alias,
      ok: 1,
    }
    UpdateCurrentLocalKey(data)
  }
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  protected constructor(_publicB64: string, _privateB64: string, alias: string) {
    _publicB64 = b64nonenl(_publicB64);
    _privateB64 = b64nonenl(_privateB64);
    this._publickey = _publicB64;
    this._publicRsa = KEYUTIL.getKey(wrap_rsa_public(_publicB64));
    this._privateRsa = KEYUTIL.getKey(wrap_rsa_private(_privateB64));
    this._alias = alias;

    // let aa = KEYUTIL.getPEM(this._privateRsa, "PKCS8PRV");
    // console.log(aa)
    // console.log(_publicB64);
    // console.log(pemtob64(aa));
    // console.log(KEYUTIL.getKey(wrap_rsa_private(pemtob64(aa))));
    // this._mnemonic = _mm;
  }
  protected setMnemonic(mm: string) {
    this._mnemonic = mm;
  }
  public getMnemonic(): string {
    if (!this._mnemonic) {
      return '';
    }
    return this.decrypt(this._mnemonic);
  }
  public getAlias(): string {
    return this._alias;
  }
  public getPublickey(): string {
    return this._publickey;
  }
  public encrypt(text: string): string {
    return hextob64(this._publicRsa.encryptOAEP(text))
  }
  public decrypt(text: string): string {
    return this._privateRsa.decryptOAEP(b64tohex(text))
  }
}

export const EncryptByPublicKey = (_pkeyB64: string, text: string): string => {
  let _publicRsa = KEYUTIL.getKey(wrap_rsa_public(_pkeyB64));
  return hextob64(_publicRsa.encryptOAEP(text))
}