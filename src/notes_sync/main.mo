// version 1.0
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";
import Hash "mo:base/Hash";
import Utils "../utils";

shared ({caller = owner}) actor class NotesSync() {

    public type PublicKey = Text;
    public type DeviceAlias = Text;
    public type Ciphertext = Text;
    public type GetCiphertextError = { #notFound; #notSynced };

    type DeviceInfo = {
        pkey: PublicKey;
        agent: Text;
    };

    type UserInfo = {
        id: Nat64;
        nick: Text;
        avatar: Text;
        register_time: Time.Time;
        last_time: Time.Time;
        super_secret: Text;
        device_list : Map.HashMap<DeviceAlias, DeviceInfo>;
        ciphertext_list : Map.HashMap<PublicKey, Ciphertext>;
    };

    type UserStableInfo = {
        id: Nat64;
        nick: Text;
        avatar: Text;
        register_time: Time.Time;
        last_time: Time.Time;
        super_secret: Text;
        device_list: [(DeviceAlias, DeviceInfo)];
        ciphertext_list : [(PublicKey, Ciphertext)];
    };

    type SimpleUserInfo = {
        id: Nat64;
        nick: Text;
        avatar: Text;
        register_time: Time.Time;
        last_time: Time.Time;
        has_secret: Bool;
    };

    private stable var owner_ : Principal = owner;
    private stable var nowId : Nat64 = 10000;
    private stable var users_st_ : [(Principal, UserStableInfo)] = [];
    private stable var userids_st_ : [(Nat64, Principal)] = [];

    private var userIdMap = Map.HashMap<Nat64, Principal>(10, Nat64.equal, Utils.nat64_hash);
    private var users = Map.HashMap<Principal, UserInfo>(10, Principal.equal, Principal.hash);

    private func NewUser() : UserInfo {
        let id = nowId;
        nowId := nowId + 1;
        return {
            id = id;
            nick = Nat64.toText(id);
            avatar = "";
            register_time = Time.now();
            last_time = Time.now();
            super_secret = "";
            device_list = Map.HashMap<DeviceAlias, DeviceInfo>(10, Text.equal, Text.hash);
            ciphertext_list = Map.HashMap<PublicKey, Ciphertext>(10, Text.equal, Text.hash);
        }
    };

    system func preupgrade() {
        userids_st_ := [];
        for ( (id, principal) in userIdMap.entries()) {
            var a = [(id, principal)];
            userids_st_ := Array.append(userids_st_, a);
        };

        users_st_ := [];
        for ( (principal, store) in users.entries()) {
            var devices : [(DeviceAlias, DeviceInfo)] = [];
            var ciphers : [(PublicKey, Ciphertext)] = [];

            for ( (alias, dinfo) in store.device_list.entries()) {
               var b = [(alias, dinfo)];
               devices := Array.append(devices, b);
            };
            for ( (pkey, cipher) in store.ciphertext_list.entries()) {
               var b = [(pkey, cipher)];
               ciphers := Array.append(ciphers, b);
            };

            let store_new : UserStableInfo = {
                id = store.id;
                nick = store.nick;
                avatar = store.avatar;
                register_time = store.register_time;
                last_time = store.last_time;
                super_secret = store.super_secret;
                device_list = devices;
                ciphertext_list = ciphers;
            };

            var a = [(principal, store_new)];
            users_st_ := Array.append(users_st_, a);
        };

        Debug.print("notes_sync preupgrade success!");
    };

    system func postupgrade() {
        userIdMap := Map.HashMap<Nat64, Principal>(10, Nat64.equal, Utils.nat64_hash);
        for ((id, principal) in userids_st_.vals()) {
            userIdMap.put(id, principal);
        };

        users := Map.HashMap<Principal, UserInfo>(10, Principal.equal, Principal.hash);
        for ((principal, store) in users_st_.vals()) {
            var devices = Map.HashMap<DeviceAlias, DeviceInfo>(10, Text.equal, Text.hash);
            var ciphers = Map.HashMap<PublicKey, Ciphertext>(10, Text.equal, Text.hash);

            for ( (alias, info) in store.device_list.vals()) {
                devices.put(alias, info);
            };

            for ( (pkey, cipher) in store.ciphertext_list.vals()) {
                ciphers.put(pkey, cipher);
            };

            let store_new : UserInfo = {
                id = store.id;
                nick = store.nick;
                avatar = store.avatar;
                register_time = store.register_time;
                last_time = store.last_time;
                super_secret = store.super_secret;
                device_list = devices;
                ciphertext_list = ciphers;
            };

            users.put(principal, store_new);
        };

        userids_st_ := [];
        users_st_ := [];
        Debug.print("notes_sync postupgrade success!");
    };

    public query ({caller}) func profile(): async ?SimpleUserInfo {
        switch (users.get(caller)) {
            case null {
                null;
            };
            case (?store) {
               var has : Bool = false;
               if (store.super_secret != "") {
                   has := true;
               };
               let info : SimpleUserInfo = {
                    id = store.id;
                    nick = store.nick;
                    avatar = store.avatar;
                    register_time = store.register_time;
                    last_time = store.last_time;
                    has_secret = has;
                };
                return ?info;
            }
        }
    };

    public shared ({caller}) func login_logger(alias : DeviceAlias) : async Bool {
        switch (users.get(caller)) {
            case null {
                return false // case null cannot happen
            };
            case (?store) {
                if (Option.isSome(store.device_list.get(alias))) {
                    return false
                };
                let store_new : UserInfo = {
                    id = store.id;
                    nick = store.nick;
                    avatar = store.avatar;
                    register_time = store.register_time;
                    last_time = Time.now();
                    super_secret = store.super_secret;
                    device_list = store.device_list;
                    ciphertext_list = store.ciphertext_list;
                };
                users.put(caller, store_new);
            }
        };

        return true;
    };

    public shared ({caller}) func register_device(alias : DeviceAlias, agent: Text, pk : PublicKey) : async Bool {
        // if caller unknown then create empty lists for user
        if (Option.isNull(users.get(caller))) {
            users.put(caller, NewUser());
        };

        // get caller's device list and add
        switch (users.get(caller)) {
            case null {
                assert false // case null cannot happen
            };
            case (?store) {
                if (Option.isSome(store.device_list.get(alias))) {
                    return false
                };
                let device : DeviceInfo =  {
                    pkey = pk;
                    agent = agent;
                };
                store.device_list.put(alias, device);
            }
        };
        true
    };

    public shared({caller}) func remove_device(alias : DeviceAlias) : () {
        switch (users.get(caller)) {
            case null { };
            case (?store) {
                // 最后一个不允许删除
                if (store.device_list.size() <= 1) {
                    return;
                };
                // remove ciphertexts associated with the device
                switch (store.device_list.get(alias)) {
                    case null { };
                    case (?device) {
                        if (isPublicKeyCanRemove(store, alias, device.pkey)) {
                            store.ciphertext_list.delete(device.pkey);
                        }
                    }
                };
                // remove the device
                store.device_list.delete(alias);
            }
        }
    };

    public shared({caller}) func reset() : async Bool {
        switch (users.get(caller)) {
            case null { };
            case (?store) {
                let user : UserInfo = {
                    id = store.id;
                    nick = store.nick;
                    avatar = store.avatar;
                    register_time = store.register_time;
                    last_time = Time.now();
                    super_secret = "";
                    device_list = Map.HashMap<DeviceAlias, DeviceInfo>(1, Text.equal, Text.hash);
                    ciphertext_list = Map.HashMap<PublicKey, Ciphertext>(1, Text.equal, Text.hash);
                };
                users.put(caller, user);
                return true;
            };
        };
        return false;
    };

    public query ({caller}) func get_devices() : async [(DeviceAlias, DeviceInfo)] {
        switch (users.get(caller)) {
            case null {
                []
            };
            case (?store) {
                Iter.toArray(store.device_list.entries())
            }
        }
    };

    public query ({caller}) func get_unsynced_pubkeys() : async [PublicKey] {
        switch (users.get(caller)) {
            case null {
                []
            };
            case (?store) {
                let a = Iter.toArray(store.device_list.entries());
                func f(x : (DeviceAlias, DeviceInfo)) : ?PublicKey {
                    let info = x.1;
                    switch (store.ciphertext_list.get(info.pkey)) {
                        case null { ?info.pkey };
                        case (?c) { null }
                    }
                };
                Array.mapFilter(a, f);
            }
        };
    };

    public query ({caller}) func isSeeded() : async Bool {
        switch (users.get(caller)) {
            case null {
                false
            };
            case (?store) {
                (store.ciphertext_list.size() > 0);
            }
        }
    };

    func isKnownPublicKey(store : UserInfo, pk : PublicKey) : Bool {
        var found = false;
        for (x in store.device_list.entries()) {
            let device = x.1;
            if (device.pkey == pk) {
                return true;
            }
        };
        false
    };

    // the public key is only one device used can delete
    func isPublicKeyCanRemove(store : UserInfo, alias: DeviceAlias, pk : PublicKey) : Bool {
        var found = false;
        for (x in store.device_list.entries()) {
            let device_alias = x.0;
            let device = x.1;
            if (device.pkey == pk and device_alias != alias) {
                return false;
            };
            if (device.pkey == pk and device_alias == alias) {
                found := true;
            };
        };
        return found;
    };

    public query ({caller}) func get_ciphertext(pk : PublicKey) : async Result.Result<Ciphertext, GetCiphertextError> {
        switch (users.get(caller)) {
            case null {
                #err(#notFound) // user unknown
            };
            case (?store) {
                if (not isKnownPublicKey(store, pk)) {
                    return #err(#notFound) // pk unknown
                };
                switch (store.ciphertext_list.get(pk)) {
                    case null {
                        #err(#notSynced)
                    };
                    case (?ciphertext) {
                        #ok(ciphertext)
                    }
                };
            }
        }
    };

    public shared({caller}) func submit_ciphertexts(ciphertexts : [(PublicKey, Ciphertext)]) : () {
        switch (users.get(caller)) {
            case null { }; // user unknown
            case (?store) {
                label next for (x in ciphertexts.vals()) {
                    let pk = x.0;
                    if (not isKnownPublicKey(store, pk)) {
                        continue next
                    };
                    switch (store.ciphertext_list.get(pk)) {
                        case (?dummy) {
                            continue next
                        };
                        case null {
                            store.ciphertext_list.put(pk, x.1)
                        }
                    }
                }
            }
        }
    };

    public shared({caller}) func seed(pk : PublicKey, c : Ciphertext) : async Bool {
        switch (users.get(caller)) {
            case null { }; // user unknown
            case (?store) {
                if (isKnownPublicKey(store, pk) and store.ciphertext_list.size() == 0) {
                    store.ciphertext_list.put(pk, c);
                    return true;
                }
            }
        };
        return false;
    };

    public shared({caller}) func setAvatar(src: Text) : async Bool {
        switch (users.get(caller)) {
            case null { }; // user unknown
            case (?store) {
                let user : UserInfo = {
                    id = store.id;
                    nick = store.nick;
                    avatar = src;
                    register_time = store.register_time;
                    last_time = store.last_time;
                    super_secret = store.super_secret;
                    device_list = store.device_list;
                    ciphertext_list = store.ciphertext_list;
                };
                users.put(caller, user);
                return true;
            }
        };
        return false;
    };

    public shared({caller}) func setSuperSecret(secret: Text) : async Bool {
        switch (users.get(caller)) {
            case null { }; // user unknown
            case (?store) {
                let user : UserInfo = {
                    id = store.id;
                    nick = store.nick;
                    avatar = store.avatar;
                    register_time = store.register_time;
                    last_time = store.last_time;
                    super_secret = secret;
                    device_list = store.device_list;
                    ciphertext_list = store.ciphertext_list;
                };
                users.put(caller, user);
                return true;
            }
        };
        return false;
    };

    public shared({caller}) func getSuperSecret() : async Text {
        switch (users.get(caller)) {
            case null { }; // user unknown
            case (?store) {
                return store.super_secret;
            }
        };
        return "";
    };

    // Return the principal identifier of the caller of this method.
    public query ({caller}) func whoami() : async Principal {
        return caller;
    };

    public query func statUser(): async Nat {
        return users.size();
    };

    // public query ({caller}) func getUserInfo(): async [(Principal, UserStableInfo)] {
    //     assert(caller == owner_);

    //     var rets : [(Principal, UserStableInfo)] = [];
    //     for ( (principal, store) in users.entries()) {
    //         var devices : [(DeviceAlias, DeviceInfo)] = [];
    //         var ciphers : [(PublicKey, Ciphertext)] = [];

    //         for ( (alias, dinfo) in store.device_list.entries()) {
    //            var b = [(alias, dinfo)];
    //            devices := Array.append(devices, b);
    //         };
    //         for ( (pkey, cipher) in store.ciphertext_list.entries()) {
    //            var b = [(pkey, cipher)];
    //            ciphers := Array.append(ciphers, b);
    //         };

    //         let store_new : UserStableInfo = {
    //             id = store.id;
    //             nick = store.nick;
    //             avatar = store.avatar;
    //             register_time = store.register_time;
    //             last_time = store.last_time;
    //             super_secret = store.super_secret;
    //             device_list = devices;
    //             ciphertext_list = ciphers;
    //         };

    //         var a = [(principal, store_new)];
    //         rets := Array.append(rets, a);
    //     };
    //     return rets;
    // };

    // public shared({caller}) func clearUser(user: Principal): async Bool {
    //     switch (users.get(user)) {
    //         case null { false }; // user unknown
    //         case (?store) {
    //             for ( k in store.ciphertext_list.keys()) {
    //                 store.ciphertext_list.delete(k);
    //             };
    //             for ( k in store.device_list.keys()) {
    //                 store.device_list.delete(k);
    //             };
    //             true;
    //         }
    //     };
    // };
}