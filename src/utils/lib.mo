import Hash "mo:base/Hash";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";

module {
    public func nat64_hash(a : Nat64) : Hash.Hash { return Text.hash(Nat64.toText(a)); };
}