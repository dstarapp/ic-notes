// import bip39 from 'bip39';
// import { KEYUTIL, b64tohex, hextob64, b64toBA } from "jsrsasign";
// import { RSAKey } from 'jsrsasign'

import { Principal } from '@dfinity/principal';
import { getCrc32 } from '@dfinity/principal/lib/cjs/utils/getCrc';
import { sha224 } from '@dfinity/principal/lib/cjs/utils/sha224';

export const get_account_id = (principal: string, id: number = 0): string => {
  const subaccount = Buffer.from(get_sub_account_array(id));
  const acc_buf = Buffer.from('\x0Aaccount-id');
  const pri_buf = Buffer.from(Principal.fromText(principal).toUint8Array());

  const buff = Buffer.concat([acc_buf, pri_buf, subaccount]);

  const sha = sha224(buff);
  const aId = Buffer.from(sha);

  return addCrc32(aId).toString('hex');
};

export const addCrc32 = (buf) => {
  const crc32Buf = Buffer.alloc(4);
  crc32Buf.writeUInt32BE(getCrc32(buf), 0);
  return Buffer.concat([crc32Buf, buf]);
};

const get_sub_account_array = (index) => {
  //32 bit number only
  return new Uint8Array(Array(28).fill(0).concat(to32bits(index)));
};

export const to32bits = (num: number) => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

// ba2s
export const ab2str = (buf: ArrayBuffer) => {
  let data: string = '';
  new Uint8Array(buf).forEach(function (byte: number) {
    data += String.fromCharCode(byte);
  });
  return data;
  // return String.fromCharCode.apply(null, new Uint8Array(buf));
};

export const str2ab = (str) => {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

export const b64withnl = (b64: string): string => {
  var b64nl = b64.replace(/(.{64})/g, '$1\r\n');
  return b64nl;
};

export const b64nonenl = (b64nl: string): string => {
  return b64nl.replace(/\r\n/g, '');
};

export const pemtob64 = (s: string, sHead: string = ''): string => {
  if (s.indexOf('-----BEGIN ') == -1) throw "can't find PEM header: " + sHead;

  if (sHead !== '') {
    s = s.replace(new RegExp('^[^]*-----BEGIN ' + sHead + '-----'), '');
    s = s.replace(new RegExp('-----END ' + sHead + '-----[^]*$'), '');
  } else {
    s = s.replace(/^[^]*-----BEGIN [^-]+-----/, '');
    s = s.replace(/-----END [^-]+-----[^]*$/, '');
  }
  return b64nonenl(s);
};

export const wrap_rsa_private = (b64: string): string => {
  var pem = '-----BEGIN PRIVATE KEY-----\r\n';
  pem += b64;
  pem += '\r\n-----END PRIVATE KEY-----\r\n';
  return pem;
};

export const wrap_rsa_public = (b64: string): string => {
  var pem = '-----BEGIN PUBLIC KEY-----\r\n';
  pem += b64;
  pem += '\r\n-----END PUBLIC KEY-----\r\n';
  return pem;
};

// The function encrypts all data deterministically in order to enable lookups.
// It would be possible to use deterministic encryption only for the encryption
// of keys. All data is correctly encrypted using deterministic encryption for
// the sake of simplicity.
// export const rsa_encrypt = async (data, pubkey) => {
//   let encrypted_data = await window.crypto.subtle.encrypt(
//     {
//       name: "RSA-OAEP"
//     },
//     pubkey,
//     str2ab(data),
//   );
//   return window.btoa(ab2str(encrypted_data));
// }

// export const rsa_decrypt = async (data, privateKey) => {
//   console.log('b64toBA', b64toBA(data))
//   console.log(window.atob(data))
//   let decrypted_data = await window.crypto.subtle.decrypt(
//     {
//       name: "RSA-OAEP"
//     },
//     privateKey,
//     str2ab(window.atob(data))
//   );
//   return ab2str(decrypted_data);
// }

// export const import_public_pem = async (pem: string) => {
//   const pemContents = pemtob64(pem);
//   console.log(pemContents);
//   let rsa: RSAKey = KEYUTIL.getKey(pem);
//   console.log(KEYUTIL.getPEM(rsa));
//   let en = rsa.encryptOAEP(str2ab('1234'));
//   console.log('encryptOAEP', rsa.encryptOAEP(str2ab('1234')));
//   console.log('encrypt', rsa.encrypt('1234'));

//   console.log('encryptOAEP base64' , hextob64(en));
//   let publicKey = await window.crypto.subtle.importKey(
//     'spki',
//     str2ab(window.atob(pemContents)),
//     {
//       name: "RSA-OAEP",
//       hash: { name: "SHA-256" },
//     },
//     true,
//     ["encrypt", "wrapKey"]
//   );
//   console.log('rsa_encrypt', await rsa_encrypt('1234', publicKey))
//   return publicKey;
// }

// export const import_private_pem = async (pem: string) => {
//   const pemContents = pemtob64(pem);
//   console.log(pemContents)

//   let rsa: RSAKey = KEYUTIL.getKey(pem);
//   let ps = KEYUTIL.getPEM(rsa, "PKCS8PRV")
//   console.log(ps);

//   let rsapc8: RSAKey = KEYUTIL.getKey(ps);

//   let a = rsapc8.decryptOAEP('130035779944913da90948adfbfca28632451e232d0acf8445b9c9b20e264156707f51d95dfc04017ba6c4c5967a914b7ed9f2d27db3f1e4a9f2afe86163e05798d3ceb1e6cd223e7b475650b86d0c495ce8a3205414eccd1d6c3b75f5426d7d4e3e72e8abd7ab115c3b2bcc0784dd65f3efe11c83bf47cab76703600cdeefcbfb37b38d5cd175ffe46039245d4cf5655169d9fd8329a625a9cde89862a2e8abdfe4b651a5640edaabffef07f4dbdd95eef35fefcdc33735f71e01c012b0ab4c3a1e1994a5c19b8310094cbe5f5571885768c4e10cc9967be4131bc3182f5d7565bb1cf2cd5871b3a1fdda00d7bfe2d2aea5008523476406b2699d6ad1ff3c76')
//   console.log('decryptOAEP', a)
//   let privateKey = await window.crypto.subtle.importKey(
//     'pkcs8',
//     str2ab(window.atob(pemtob64(ps))),
//     {
//       name: "RSA-OAEP",
//       hash: { name: "SHA-256" },
//     },
//     true,
//     ["decrypt", "unwrapKey"]
//   );
//   console.log(privateKey)
//   // console.log(window.atob('XLLxHmkhkpZc9QlzeMYGjLjBL8qKHbTxVtrfqZKnQ1Vp1wQbxDIykihr7ehvbK5E3wzYJSKep3VJ4Z3sn9xoqOhD6/WsN49yoIVDUpqY1dp6iUnKmHL6NcTYArQgdZcCRc8Osc7Hl4D7tGDN4pibidjr/YoQwMQIubBR6BelROLOqT+NRiDGbobuv6wJKI4ArKg57aqW0r0Eq7ZZc8qnf/T0fhFfCwHERyBe5PZUbxtfC1ou11nE0RudDf+Ep1FF7l5LHWd27wZWxMRWYvHcXAzCL5t/klsA5pJoLJQ7aIRYO+0YGclI2A7/p1gEh6pfBLwh5Xo+yvP0KA0CGAvPAw=='))
//   console.log('vvvv' , await rsa_decrypt('Dm/XmyaLN1uKug48VQyAmquW4fCuJ+qWl+uaHQ6hhBEo4aGby+6ByWEAKDiup6XdAm1+hIoS5yvO70ggCrv11w24+XX0dJpVK4i+JpGRJszatNbh8FURQ3EqvKZsLI9pK6hdNspKKhnJ/DUpGJQjL7+y6eJ2fcFOeBf9HLphp0XQDAyTzmPV73Tk7S4U7fQT/ZapBdEEbhP01j3G+pzGjrmKSlnglrvWU+WaocROSFxlDgrCE8xq5IAwVetF9F5BYmt6OOOftdlZ/LgO8HMQBhjVkCM/bhO2ZHtZHXi9QRMGuFh+XUh2/2d2ZRGOpFwBs6YCWUVuF10OQ9vsdbL7hw==', privateKey))
//   console.log(await rsa_decrypt('CaUqeBLn8nQhez4nNRRzFNfqMlvVhjEsxk3AkdkUXsr+vrqWLvIRXHixCOT93HbcJ+QPYqbavGi1BGiuWPGoPnLnv2+D6D+oaWDs7L3JoIoXQm/vp3OoVLAWxgOuTWie8gzkJG0BrFaJGqIpT3inrJV7JO9UYKmZGO+LHWhVuivGezlPrMeF9TAokfkmu02+CA5MkaVMpWYy3hrJdqfZByNwgf/TZaqjJQf19HiW1SFfGqXNBisvb4MsOg1JpaMbX4//UXGNL+/G2ngtSA8I5NCv3jvXuOdwBFXa465w52AexKlRVVnJ9WjACBWOspis30WtZtd27alkLM9KVpzWzg==', privateKey))
//   return privateKey;
// }
