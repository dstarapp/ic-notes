// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type AccountIdentifier = Text;
  public type Block = {
    transaction : Transaction;
    timestamp : TimeStamp;
    parent_hash : Hash;
  };
  public type BlockHeight = Nat64;
  public type CanisterId = Principal;
  public type Certification = [Nat8];
  public type Hash = ?{ inner : [Nat8] };
  public type ICPTs = { e8s : Nat64 };
  public type Memo = Nat64;
  public type TimeStamp = { timestamp_nanos : Nat64 };
  public type TipOfChain = {
    certification : ?Certification;
    tip_index : BlockHeight;
  };
  public type Transaction = {
    memo : Memo;
    created_at_time : TimeStamp;
    transfer : Transfer;
  };
  public type Transfer = {
    #Burn : { from : AccountIdentifier; amount : ICPTs };
    #Mint : { to : AccountIdentifier; amount : ICPTs };
    #Send : {
      to : AccountIdentifier;
      from : AccountIdentifier;
      amount : ICPTs;
    };
  };
  public type LedgerActor = actor {
    block : shared Nat64 -> async {
        #Ok : { #Ok : Block; #Err : CanisterId };
        #Err : Text;
      };
    tip_of_chain : shared () -> async { #Ok : TipOfChain; #Err : Text };
  }
}