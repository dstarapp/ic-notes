import { canisterId, createActor } from 'canisters/notes_sync';
import { reactive } from 'vue';
import { GetNotesKey, NotesIdentity } from '../identity';
import { DeleteCurrentLocalKey, GetCurrentLocalKey } from '../local';
// import { reactive } from 'vue'

export const NotesSync = () => {
  // return createActor(canisterId)
  return createActor(canisterId, {
    agentOptions: {
      identity: NotesIdentity.getIdentity(),
    },
  });
};

export const NotesAnonySync = () => {
  // return createActor(canisterId)
  return createActor(canisterId, {});
};

export interface DeviceInfo {
  alias: string;
  agent: string;
  pkey: string;
}

export interface UserInfo {
  id: number;
  pid: string;
  nick: string;
  avatar: string;
  register_time: Date;
  last_time: Date;
  has_secret: boolean;
}

var _devices: DeviceInfo[] = [];
var _user: UserInfo = reactive({
  id: 0,
  pid: '',
  nick: '',
  avatar: '',
  register_time: new Date(),
  last_time: new Date(),
  has_secret: false,
});
var _unsyncList: string[] = [];

export const InitUser = async (): Promise<boolean> => {
  if (!NotesIdentity.isLogin() && !NotesIdentity.isRegister()) {
    return false;
  }

  await GetDevices(true);

  let key = GetNotesKey();
  if (!key || CheckDevice(key.getAlias())) {
    console.log('can not find device! this device had been deleted by others!');
    DeleteCurrentLocalKey();
    return false;
  }

  let users = await NotesSync().profile();
  if (users.length <= 0) {
    return false;
  }
  let user = users[0];
  if (!user) {
    return false;
  }
  let pid = NotesIdentity.getIdentity()?.getPrincipal().toText() ?? '';
  let newuser = {
    id: user.id,
    pid: pid,
    nick: user.nick,
    avatar: user.avatar,
    register_time: new Date(Number(user.register_time / BigInt(1000000))),
    last_time: new Date(Number(user.last_time / BigInt(1000000))),
    has_secret: user.has_secret,
  };
  Object.assign(_user, { ...{}, ...newuser });

  return true;
};

export const GetUserInfo = (): UserInfo => {
  return _user;
};

export const GetDevices = async (force: boolean): Promise<DeviceInfo[]> => {
  if (force) {
    _devices = [];
    // if (!NotesIdentity.isLogin()) {
    //   return _devices;
    // }
    let devices = await NotesSync().get_devices();
    devices.forEach((d) => {
      _devices.push({
        alias: d[0],
        agent: d[1].agent,
        pkey: d[1].pkey,
      });
    });
  }
  return _devices;
};

export const PushDevices = (alias: string, pkey: string) => {
  _devices.push({
    alias: alias,
    agent: navigator.userAgent,
    pkey: pkey,
  });
};

// check alias is available
export const CheckDevice = (alias: string): boolean => {
  let idx = _devices.findIndex((v) => {
    return v.alias == alias;
  });
  return idx === -1;
};

export const CheckUnsyncList = async (): Promise<boolean> => {
  let unsyncs = await NotesSync().get_unsynced_pubkeys();
  if (!unsyncs || unsyncs.length <= 0) {
    return false;
  }
  _unsyncList = [];
  unsyncs.forEach((el) => {
    _unsyncList.push(el);
  });
  return true;
};

export const GetUnsyncDevices = (): DeviceInfo[] => {
  let rets: DeviceInfo[] = [];
  _unsyncList.forEach((el) => {
    let dv = _devices.find((device, idx) => {
      return device.pkey == el;
    });
    if (dv) {
      rets.push(dv);
    }
  });
  return rets;
};

export const RemoveDevice = async (alias: string): Promise<boolean> => {
  await NotesSync().remove_device(alias);
  let idx = _devices.findIndex((e) => {
    return e.alias == alias;
  });
  if (idx !== -1) {
    _devices.splice(idx, 1);
  }
  return true;
};

export const ResetAllDevices = async (): Promise<boolean> => {
  try {
    let ret = await NotesSync().reset();
    return ret;
  } catch (e) {
    console.log(e);
  }
  return false;
};

export const ChangeAvatar = async (src: string): Promise<boolean> => {
  if (!_user) {
    return false;
  }
  let ret = await NotesSync().setAvatar(src);
  if (ret) {
    _user.avatar = src;
  }
  return ret;
};

export const GetUserStat = async (): Promise<Number> => {
  let ret = await NotesAnonySync().statUser();
  if (ret) {
    return Number(ret);
  }
  return 0;
};

export const HasLocalDevice = (): boolean => {
  let key = GetCurrentLocalKey();
  if (!key) {
    return false;
  }
  let hasAlias = false;
  _devices.forEach((el) => {
    if (el.alias == key.alias) {
      hasAlias = true;
    }
  });
  return hasAlias;
};

export const CheckDeviceOnlyLocal = (): boolean => {
  let hasAlias = HasLocalDevice();
  return _devices.length == 1 && hasAlias;
};
