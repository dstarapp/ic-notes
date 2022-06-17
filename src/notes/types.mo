import Hash "mo:base/Hash";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";

module {
    public func nat32hash(n: Nat32) : Hash.Hash {
      return n;
    };

    public func nat64hash(n: Nat64) : Hash.Hash {
      return Text.hash(Nat64.toText(n));
    };
}