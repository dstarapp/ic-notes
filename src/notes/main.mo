import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import ICActor "mo:base/TrieSet";
import IcManager "./icmanager";
import IcLedger "./icledger";
import AccountId "./utils/accountid";
import IcNote "./ic-note/src/notebook";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat64 "mo:base/Nat64";
import Prim "mo:prim";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Types "./types";

shared({caller = owner}) actor class Notes() = this {
    public type NoteInfo = {
        id: Nat;
        name: Text;
        owner: Principal;
        canisterId: Principal;
        timestamp: Int;
        canControll: Bool;
    };

    public type PayOrder = {
        id: Nat64;
        from: Principal;
        to: Principal;
        amount: Nat64;
        block: Nat64;
        name: Text;
    };

    public type PayInfo = {
        id: Nat64;
        to: Principal;
        amount: Nat64;
    };

    public type StatInfo = {
        notesNum: Nat;
        feeTotal: Nat64;
    };

    private stable var _owner: Principal = owner;
    private stable var _nums: Nat = 0;
    private stable var _payindex = Prim.intToNat64Wrap(Time.now());
    private stable var _payee: Principal = Principal.fromText("aaaaa-aa");
    // private stable var cyclesPerToken: Nat = 20000; // 2 trillion cycles for each token canister
    private stable var cyclesPerToken: Nat = 200_000_000_000; // 0.2 trillion cycles for each token canister
    // private stable var maxNumTokens: Nat = 100;
    // private stable var maxNumTokensPerId: Nat = 2;
    // private stable var feeTokenId: Principal = _feeTokenId;
    // private stable var fee: Nat = _fee;

    private stable var allNotesSt : [(Principal, NoteInfo)] = [];
    private stable var allTxsSt : [(Nat64, PayOrder)] = [];
    private var allNotes = HashMap.HashMap<Principal, NoteInfo>(0, Principal.equal, Principal.hash);
    private var allTxs = HashMap.HashMap<Nat64, PayOrder>(1, Nat64.equal, Types.nat64hash);

    let ICActor: IcManager.ICActor = actor("aaaaa-aa");
    let LedgerActor: IcLedger.LedgerActor = actor("ockk2-xaaaa-aaaai-aaaua-cai");

    system func preupgrade() {
        allNotesSt := Iter.toArray(allNotes.entries());
        allTxsSt := Iter.toArray(allTxs.entries());
    };

    system func postupgrade() {
        allNotes := HashMap.fromIter<Principal, NoteInfo>(allNotesSt.vals(), 1, Principal.equal, Principal.hash);
        allNotesSt := [];
        allTxs := HashMap.fromIter<Nat64, PayOrder>(allTxsSt.vals(), 1, Nat64.equal, Types.nat64hash);
        allTxsSt := [];
    };

    public query({caller}) func getUserNotes(): async [NoteInfo] {
        var noteList: [NoteInfo] = [];
        for((index, notebook) in allNotes.entries()) {
            if(notebook.owner == caller) {
                noteList := Array.append<NoteInfo>(noteList, [notebook]);
            };
        };
        noteList
    };

    public query({caller}) func getNoteInfo(cid: Principal): async ?NoteInfo {
        switch(allNotes.get(cid)) {
            case (?notebook) {
                if (notebook.owner != caller) {
                    return null;
                };
                return ?notebook;
            };
            case(_){
                return null;
            }
        }
    };

    public shared({caller}) func getNoteStatus(cid: Principal): async ?IcManager.CanisterStatus {
        switch(allNotes.get(cid)) {
            case(?notebook) {
                if (notebook.owner != caller) {
                    return null;
                };
                let param: IcManager.CanisterId = {
                    canister_id = cid;
                };
                let status = await ICActor.canister_status(param);
                return ?status;
            };
            case(_) {return null};
        }
    };

    public shared({caller}) func preNewNoteBook(name: Text): async PayInfo {
        let now = Time.now();
        let code = genTxID(now);
        let order: PayOrder = {
            id = code;
            from = caller;
            to = _payee;
            amount = 20_000_000; // 0.2 ICP
            // amount = 100_000; // 0.001 ICP
            block = 0;
            name = name;
        };
        // Debug.print(debug_show(order));
        allTxs.put(code, order);
        let info: PayInfo = {
            id = order.id;
            to = order.to;
            amount = order.amount;
        };
        return info;
    };

    public shared({caller}) func newNoteBook(id: Nat64, height: Nat64): async ?NoteInfo {
        switch(allTxs.get(id)) {
            case (?tx) {

                if (not Principal.equal(tx.from, caller)) {
                    return null;
                };

                let ret = await verifyBlock(tx, height);
                if (not ret) {
                    return null;
                };
                // let cyclesPerToken =
                Cycles.add(cyclesPerToken);
                // Cycles.add(2000); // cycles top-up by web
                let notebook = await IcNote.NoteBook(caller, tx.name);
                let noteid = Principal.fromActor(notebook);

                _nums := _nums + 1;
                let noteinfo : NoteInfo = {
                    id = _nums;
                    name = tx.name;
                    canisterId = noteid;
                    owner = caller;
                    timestamp = Time.now();
                    canControll = true;
                };
                allNotes.put(noteid, noteinfo);
                return ?noteinfo
            };
            case (_) {}
        };
        return null;
    };

    public shared({caller}) func setPayee(payee: Principal): async Bool {
        assert(caller == _owner);
        _payee := payee;
        return true;
    };

    public shared({caller}) func setNoteBookName(cid: Principal, name: Text) : async Bool {
        switch(allNotes.get(cid)) {
            case (?notebook) {
                if (notebook.owner != caller) {
                    return false;
                };
                let noteinfo : NoteInfo = {
                    id = notebook.id;
                    name = name;
                    canisterId = notebook.canisterId;
                    owner = notebook.owner;
                    timestamp = notebook.timestamp;
                    canControll = notebook.canControll;
                };
                allNotes.put(cid, noteinfo);
                return true;
            };
            case(_){
                return false;
            }
        }
    };

    public shared({caller}) func setNoteBookOwner(cid: Principal, owner: Principal) : async Bool {
        switch(allNotes.get(cid)) {
            case (?notebook) {
                if (notebook.owner != caller) {
                    return false;
                };
                let noteinfo : NoteInfo = {
                    id = notebook.id;
                    name = notebook.name;
                    canisterId = notebook.canisterId;
                    owner = owner;
                    timestamp = notebook.timestamp;
                    canControll = notebook.canControll;
                };
                allNotes.put(cid, noteinfo);
                return true;
            };
            case(_){
                return false;
            }
        }
    };

    public shared({caller}) func setNoteBookController(cid: Principal, cons: [Principal]) : async Bool {
        let self =  Principal.fromActor(this);
        switch(allNotes.get(cid)) {
            case (?notebook) {
                if (not notebook.canControll) {
                    return false;
                };
                if (cons.size() < 1) {
                    return false;
                };
                if (notebook.owner != caller) {
                    return false;
                };
                let param : IcManager.UpdateSettingsParams = {
                    canister_id = cid;
                    settings = {
                        compute_allocation = null;
                        controllers = ?cons;
                        freezing_threshold = null;
                        memory_allocation = null;
                    };
                };

                var isControl = false;
                for( v in cons.vals()) {
                    if (Principal.equal(v, self)) {
                        isControl := true;
                    }
                };

                await ICActor.update_settings(param);

                let noteinfo : NoteInfo = {
                    id = notebook.id;
                    name = notebook.name;
                    canisterId = notebook.canisterId;
                    owner = notebook.owner;
                    timestamp = notebook.timestamp;
                    canControll = isControl;
                };
                allNotes.put(cid, noteinfo);
                return true;
            };
            case(_){
                return false;
            }
        }
    };

    public query func getStats() : async StatInfo {
        var feeTotal : Nat64 = 0;
        for ( order in allTxs.vals() ) {
            if (order.block != 0) {
                feeTotal := feeTotal + order.amount;
            };
        };
        return {
            notesNum = allNotes.size();
            feeTotal = feeTotal;
        };
    };

    private func verifyBlock(porder: PayOrder, height: Nat64): async Bool {
        let tx = await LedgerActor.block(height);
        switch(tx){
            case(#Ok(#Ok(block)))
            {
                switch(block.transaction.transfer)
                {
                    case(#Send(send)) {
                        let from = AccountId.fromPrincipal(porder.from, null);
                        let payer = AccountId.bytesToText(from);
                        let to = AccountId.fromPrincipal(porder.to, null);
                        let toer = AccountId.bytesToText(to);
                        if (toer != send.to or payer != send.from or porder.amount != send.amount.e8s) {
                            return false;
                        }
                    };
                    case(_) return false;
                };
                if (porder.id != 0 and block.transaction.memo != porder.id) {
                    return false;
                };

                let order: PayOrder = {
                    id = porder.id;
                    from = porder.from;
                    to = porder.to;
                    amount = porder.amount;
                    block = height;
                    name = porder.name;
                };
                allTxs.put(porder.id, order);
                return true;
            };
            case(_) { return false; }
        };
        return true;
    };

    private func genTxID(now: Time.Time): Nat64 {
        _payindex := _payindex + 1;
        return _payindex;
    };

    private func getCanisterStatus(cid : Principal): async ?IcManager.CanisterStatus {
        let param: IcManager.CanisterId = {
            canister_id = cid;
        };
        let status = await ICActor.canister_status(param);
        return ?status;
    };

    public query({caller}) func snapshot(): async [Principal] {
        assert(caller == _owner);
        let pids : Buffer.Buffer<Principal> = Buffer.Buffer<Principal>(0);
        let hashp : HashMap.HashMap<Principal, Bool> = HashMap.HashMap<Principal, Bool>(0, Principal.equal, Principal.hash);

        for (v in allNotes.vals()) {
            if (v.id <=  12305) {
                if (v.timestamp / 1_000_000 <= 1655042400000) {
                    switch(hashp.get(v.owner)) {
                        case(?pid) {
                        };
                        case(_){
                            pids.add(v.owner);
                        };
                    }
                };
            };
        };
        return pids.toArray();
    };
};
