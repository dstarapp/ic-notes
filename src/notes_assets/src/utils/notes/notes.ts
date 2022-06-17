// import { ActorSubclass, CanisterSettings } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { canisterId, createActor } from 'canisters/notes';
// import { CanisterStatus } from 'canisters/notes.did';
import { NotesIdentity } from '../identity';
import { DepositCycles, TransferICP } from '../wallet';
import { reactive, ref } from 'vue';
import { NoteBook } from './notebook';

export const DEFAULT_CYCLES_ICP = BigInt(30_000_000);
export const CREATE_MIN_ICP = Number(0.5003);
// export const DEFAULT_CYCLES_ICP = BigInt(100_000);
// export const CREATE_MIN_ICP = Number(0.00002);

// export interface NoteBookStatus {
//   cycles: bigint;
//   memory_size: bigint;
//   module_hash: string;
//   controllers: Principal[];
// }

// export interface NoteBook {
//   id?: string; // canisterId to string
//   canisterId?: Principal;
//   name: string;
//   canControll: boolean;
//   loading: boolean;
//   loadingNote: boolean;
//   loadingStat: boolean;
//   status?: NoteBookStatus;
//   lastNotes: SimpleNote[];
//   stat: SimpleStat;
// }
export interface NBStatInfo {
  notesNum: Number;
  feeTotal: Number;
}

var _createState = ref(0);
var _notebooks: NoteBook[] = reactive([]);
var _curnotebook: NoteBook = reactive(NoteBook.newEmpty());

export const NotesActor = () => {
  return createActor(canisterId, {
    agentOptions: {
      identity: NotesIdentity.getIdentity(),
    },
  });
};

export const NotesAnonyActor = () => {
  return createActor(canisterId, {});
};

export const GetNoteBooks = (): NoteBook[] => {
  return _notebooks;
};

export const GetCurNoteBook = (): NoteBook => {
  return _curnotebook;
};

export const GetCreateState = () => {
  return _createState;
};

export const SetCurNoteBook = (cid: string) => {
  let note = _notebooks.find((v: NoteBook, idx: number) => {
    return v.getID() == cid;
  });
  if (note) {
    Object.assign(_curnotebook, { ...note });
  } else if (!note) {
    let empty = NoteBook.newEmpty();
    Object.assign(_curnotebook, { ...empty });
  }
};

export const GetNotesStat = async (): Promise<NBStatInfo> => {
  let actor = NotesAnonyActor();
  let stat = await actor.getStats();
  if (!stat) {
    return { notesNum: 0, feeTotal: 0 };
  }

  let feeTotal = Number(stat.feeTotal / BigInt(100)) / 1000_000;
  return {
    notesNum: Number(stat.notesNum),
    feeTotal: feeTotal,
  } as NBStatInfo;
};

export const GetNoteBook = (cid: string = ''): NoteBook => {
  let note = _notebooks.find((v: NoteBook, idx: number) => {
    return v.getID() == cid;
  });
  return note ? note : NoteBook.newEmpty();
};

export const LoadNoteBooks = async (): Promise<boolean> => {
  let actor = NotesActor();
  let notes = await actor.getUserNotes();
  if (!notes) {
    return false;
  }

  _notebooks.length = 0; // clean
  notes.forEach((note) => {
    let notebook = new NoteBook(note.name, note.canisterId);
    notebook.setCanControl(note.canControll);
    _notebooks.push(notebook);
  });

  return true;
};

export const HasNoteBooks = async (): Promise<boolean> => {
  let actor = NotesActor();
  let notes = await actor.getUserNotes();
  if (!notes) {
    return false;
  }
  return notes.length > 0;
};

export const CreateNoteBook = async (name: string): Promise<NoteBook | null> => {
  _createState.value = 0;

  let actor = NotesActor();
  let payinfo = await actor.preNewNoteBook(name);
  // console.log(payinfo);
  if (!payinfo) {
    return null;
  }

  try {
    let height = await TransferICP(payinfo.to.toString(), payinfo.amount, {
      memo: payinfo.id,
    });
    // let height = 0n;
    _createState.value = 1;

    let info = await actor.newNoteBook(payinfo.id, height);
    if (info?.length <= 0) {
      return null;
    }
    _createState.value = 2;
    // console.log(info)
    let note = info[0];
    if (!note) {
      return null;
    }
    let notebook = new NoteBook(note.name, note.canisterId);
    // DepositCycles
    await DepositCycles(note.canisterId, DEFAULT_CYCLES_ICP);
    _notebooks.push(notebook);
    LoadingNoteBook(_notebooks[_notebooks.length - 1]);
    _createState.value = 3;
    return notebook;
  } catch (e) {
    // _createState.value = 2;
    console.log(e);
  }
  return null;
};

export const ImportNoteBook = () => {};

export const ChangeNoteBookName = async (name: string): Promise<boolean> => {
  let notebook = GetNoteBook(_curnotebook.getID());
  if (notebook.getCanisterID().isAnonymous()) {
    return false;
  }

  let ret = await notebook.changeName(name);
  if (!ret) {
    return false;
  }

  let canisterId = notebook.getCanisterID();
  let actor = NotesActor();
  ret = await actor.setNoteBookName(canisterId, name);

  // sync notebook status
  SetCurNoteBook(notebook.getID());
  return ret;
};

export const ChangeNoteBookOwner = async (owner: Principal): Promise<boolean> => {
  let notebook = GetCurNoteBook();
  if (notebook.getCanisterID().isAnonymous()) {
    return false;
  }

  let ret = await notebook.changeOwner(owner);
  if (!ret) {
    return false;
  }

  let canisterId = notebook.getCanisterID();
  let actor = NotesActor();
  ret = await actor.setNoteBookOwner(canisterId, owner);
  if (ret) {
    let idx = _notebooks.findIndex((note) => {
      return note.getID() == notebook.getID();
    });
    _notebooks.splice(idx, 1);
  }
  return ret;
};

export const ChangeNoteBookController = async (owner: Principal[]): Promise<boolean> => {
  let notebook = GetCurNoteBook();
  if (notebook.getCanisterID().isAnonymous()) {
    return false;
  }
  if (!notebook.canControll) {
    return false;
  }
  let canisterId = notebook.getCanisterID();
  let actor = NotesActor();
  let ret = await actor.setNoteBookController(canisterId, owner);
  if (ret) {
    notebook.canControll = false;
  }
  return ret;
};

export const GetNoteBookStatus = async (cid: string): Promise<boolean> => {
  let idx = _notebooks.findIndex((v: NoteBook, idx: number): boolean => {
    return v.getID() == cid;
  });
  if (idx < 0) {
    return false;
  }
  let note = _notebooks[idx];
  if (!note.canControll) {
    return false;
  }

  let actor = NotesActor();
  let ret = await actor.getNoteStatus(Principal.fromText(cid));
  if (!ret || ret.length <= 0) {
    return false;
  }
  let status = ret[0];
  if (!status) {
    return false;
  }
  let hash = status.module_hash.length ? toHexString(new Uint8Array(status.module_hash[0])) : '';
  note.loading = false;
  note.setStatus({
    cycles: status.cycles,
    memory_size: status.memory_size,
    controllers: status.settings.controllers,
    module_hash: hash,
  });
  _notebooks.splice(idx, 1, note);
  if (note.getID() == _curnotebook.getID()) {
    // sync notebook status
    SetCurNoteBook(note.getID());
  }
  return true;
};

export const LoadingAllNoteBooks = () => {
  // LoadIcpCycleRate().then(() => {
  // }).catch((e)=>{
  //   console.log('LoadIcpCycleRate', e)
  // })
  _notebooks.forEach((note) => {
    LoadingNoteBook(note);
  });
};

const LoadingNoteBook = (note: NoteBook) => {
  if (note.canControll) {
    GetNoteBookStatus(note.getID())
      .then((res: boolean) => {
        // console.log('GetNoteBookStatus', res, note.getID())
        if (res) {
          note.loading = false;
        }
      })
      .catch((e) => {
        console.log(note.getID(), 'GetNoteBookStatus', e);
      });
  } else {
    note.loading = false;
  }

  note
    .getNoteList('', 1, 2, 'TimeDesc')
    .then(() => {
      // console.log('getNoteList', note.getID())
    })
    .catch((e) => {
      console.log(note.getID(), 'GetNoteList', e);
    });

  note
    .loadNoteStat()
    .then(() => {
      // console.log('loadNoteStat', note.getID())
    })
    .catch((e) => {
      console.log(note.getID(), 'LoadNoteStatByID', e);
    });
};

const toHexString = (bytes: Uint8Array) => {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
};

export const HumanMemorySize = (size: bigint): string => {
  if (size < BigInt(1024)) {
    return Number(size) + 'B';
  } else if (size < BigInt(1024) ** BigInt(2)) {
    return (Number(size / BigInt(1024)) / 1024).toFixed(2) + 'M';
  }
  return Number(size / BigInt(1024) ** BigInt(2)) + 'M';
};

export const HumanCycle = (cycle: bigint): string => {
  if (cycle < BigInt(1000)) {
    return Number(cycle) + 'B';
  } else if (cycle < BigInt(1000) ** BigInt(2)) {
    return (Number(cycle / BigInt(1000)) / 1000).toFixed(2) + 'M';
  } else if (cycle < BigInt(1000 ** 3)) {
    return (Number(cycle / BigInt(1000 ** 2)) / 1000).toFixed(2) + 'G';
  }
  return (Number(cycle / BigInt(1000 ** 3)) / 1000).toFixed(2) + 'T';
};
