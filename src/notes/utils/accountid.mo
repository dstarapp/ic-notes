/**
Generates AccountIdentifier's for the IC (32 bytes). Use with
hex library to generate corresponding hex address.
Uses custom SHA224 and CRC32 motoko libraries
*/

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import SHA224 "./SHA224";
import CRC32 "./CRC32";

module {
  private let ads : [Nat8] = [10, 97, 99, 99, 111, 117, 110, 116, 45, 105, 100]; //b"\x0Aaccount-id"
  private let sa_zero : [Nat8] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  func encodeWord8(w8 : Nat8) : Text {
      func encodeWord4(w4 : Nat8) : Char {
          if (w4 > (0x0F : Nat8)) {
            Prelude.unreachable()
          };
          let arr : [Char] = [
            '0', '1', '2', '3', '4', '5', '6', '7',
            '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
          ];
          var out : Char = arr[Nat8.toNat(w4)];
          return out;
      };
      let n : Nat8 = 0x10;
      let c1 : Char = encodeWord4(w8 / n);
      let c2 : Char = encodeWord4(w8 % n);
      var out : Text = Char.toText(c1) # Char.toText(c2);
      return out
  };

  public func bytesToText(_bytes : [Nat8]) : Text{
    var result : Text = "";
    for(this in _bytes.vals()){
      result #= encodeWord8(this)
    };
    return result;
  };

  public func fromText(t : Text, sa : ?[Nat8]) : [Nat8] {
    return fromPrincipal(Principal.fromText(t), sa);
  };
  public func fromPrincipal(p : Principal, sa : ?[Nat8]) : [Nat8] {
    return fromBlob(Principal.toBlob(p), sa);
  };
  public func fromBlob(b : Blob, sa : ?[Nat8]) : [Nat8] {
    return generate(Blob.toArray(b), sa);
  };
  public func generate(data : [Nat8], sa : ?[Nat8]) : [Nat8] {
    var _sa : [Nat8] = sa_zero;
    if (Option.isSome(sa)) {
      _sa := switch sa {
        case null { Prelude.unreachable() };
        case (?sa_) { sa_ };
      }
    };
    var hash : [Nat8] = SHA224.sha224(Array.append(Array.append(ads, data), _sa));
    var crc : [Nat8] = CRC32.crc32(hash);
    return Array.append(crc, hash);
  };
};