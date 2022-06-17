import { Principal } from '@dfinity/principal';
import { reactive } from 'vue';
import { AesDecrypt, AesEncrypt } from '../../aes';
import { NotesIdentity } from '../../identity';
import { GetCurNoteBook } from '../notes';
import { createActor } from './notebook';

export const NoteBookActor = (canisterId: Principal) => {
  return createActor(canisterId, {
    agentOptions: {
      identity: NotesIdentity.getIdentity(),
    },
  });
};

export interface SimpleNote {
  title: string;
  ntype: string;
  content: string;
  tags: string[];
  like?: boolean;
  createTime?: number;
  updateTime?: number;
  topTime?: number;
  version?: number;
  id?: number;
}

export interface SimpleStat {
  noteCount: number;
  boxCount: number;
}

export interface NoteBookStatus {
  cycles: bigint;
  memory_size: bigint;
  module_hash: string;
  controllers: Principal[];
}

export const NTYPE_NOTE = 'Note';
export const NTYPE_BOXITEM = 'BoxItem';

export class NoteBook {
  public name: string;
  public canControll: boolean;
  public loading: boolean;
  public loadingNote: boolean;
  public loadingStat: boolean;
  public lastNotes: SimpleNote[];
  public stat: SimpleStat;
  protected canisterID?: Principal;
  protected status?: NoteBookStatus;

  public static newEmpty(): NoteBook {
    return new NoteBook('', Principal.anonymous());
  }

  public constructor(name: string, canisterID: Principal) {
    this.canisterID = canisterID;
    this.name = name;
    this.canControll = true;
    this.loading = true;
    this.loadingNote = true;
    this.loadingStat = true;
    this.stat = { noteCount: 0, boxCount: 0 };
    this.lastNotes = [];
  }

  public getID(): string {
    return this.canisterID ? this.canisterID.toString() : '';
  }

  public getCanisterID(): Principal {
    return this.canisterID ? this.canisterID : Principal.anonymous();
  }

  public setStatus(status: NoteBookStatus) {
    this.status = status;
  }

  public setCanControl(val: boolean) {
    this.canControll = val;
  }

  public async getNoteList(ntype: string, page: number, size: number, sort: string): Promise<SimpleNote[]> {
    let notes: SimpleNote[] = [];
    let optType: any = [];
    if (ntype != '') {
      optType = [{ [ntype]: null }];
    }
    let noteActor = NoteBookActor(this.getCanisterID());
    let rets = await noteActor.getNoteList(optType, BigInt(page), BigInt(size), { [sort]: null });
    rets.forEach((val) => {
      let note = {
        id: Number(val.id),
        title: val.title ? AesDecrypt(val.title) : '',
        tags: val.tags ? AesDecrypt(val.tags).split(',') : [],
        ntype: '',
        like: val.like ? true : false,
        createTime: Number(val.createTime / BigInt(1_000_000)),
        updateTime: Number(val.updateTime / BigInt(1_000_000)),
        topTime: Number(val.topTime / BigInt(1_000_000)),
        version: Number(val.version),
      } as SimpleNote;

      if (val.ntype.hasOwnProperty(NTYPE_BOXITEM)) {
        note.ntype = NTYPE_BOXITEM;
      } else {
        note.ntype = NTYPE_NOTE;
      }
      notes.push(note);
    });
    if (page == 1) {
      this.loadingNote = false;
      this.lastNotes.length = 0;
      this.lastNotes.push(...notes.slice(0, 2));
    }
    return notes;
  }

  public async getNoteData(id: number): Promise<string> {
    let noteActor = NoteBookActor(this.getCanisterID());
    let ret = await noteActor.getNoteData(BigInt(id));
    if (!ret || ret.length <= 0) {
      return '';
    }
    return AesDecrypt(ret);
  }

  public async createNote(note: SimpleNote): Promise<number> {
    let noteActor = NoteBookActor(this.getCanisterID());
    let meta = {
      id: 0,
      title: AesEncrypt(note.title),
      tags: note.tags.length > 0 ? AesEncrypt(note.tags.join(',')) : '',
      ntype: { [note.ntype]: null },
      like: false,
      createTime: 0,
      updateTime: 0,
      topTime: 0,
      version: 0,
    };
    let ret = await noteActor.createNote(meta, AesEncrypt(note.content));
    console.log('createNote', ret);

    if (note.ntype == NTYPE_BOXITEM) {
      this.stat.boxCount += 1;
    } else {
      this.stat.noteCount += 1;
    }

    note.id = Number(ret);
    note.updateTime = note.createTime = new Date().getTime();
    note.version = 1;

    this.lastNotes.unshift(note);
    let notes = this.lastNotes.slice(0, 2);
    this.lastNotes.length = 0;
    this.lastNotes.push(...notes);
    return note.id;
  }

  public async updateNote(note: SimpleNote): Promise<boolean> {
    let noteActor = NoteBookActor(this.getCanisterID());
    let meta = {
      id: note.id,
      title: AesEncrypt(note.title),
      tags: note.tags.length > 0 ? AesEncrypt(note.tags.join(',')) : '',
      ntype: { [note.ntype]: null },
      like: note.like ? true : false,
      createTime: 0,
      updateTime: 0,
      topTime: note.topTime ? note.topTime : 0,
      version: 0,
    };
    let ret = await noteActor.createNote(meta, AesEncrypt(note.content));
    console.log('updateNote', ret);

    note.updateTime = new Date().getTime();
    note.version = note.version ? note.version + 1 : 0;
    // _notes.unshift(note);
    // let idx = _notes.findIndex((v, idx) => {
    //   return v.id == note.id
    // })
    // if (idx !== -1) {
    //   _notes.splice(idx, 1);
    //   _notes.unshift(note);
    // }
    return true;
  }

  public async deleteNote(id: number, ntype: string): Promise<boolean> {
    let noteActor = NoteBookActor(this.getCanisterID());
    let ret = await noteActor.deleteNote(BigInt(id));
    if (!ret) {
      return false;
    }
    // let note = _notes[idx];
    if (ntype == NTYPE_BOXITEM) {
      this.stat.boxCount -= 1;
    } else {
      this.stat.noteCount -= 1;
    }
    // _notes.splice(idx, 1);
    return true;
  }

  public async topingNote(id: number, toping: boolean): Promise<boolean> {
    // let note = _notes.find((v) => {
    //   return v.id == id;
    // });

    // if (!note) {
    //   return false;
    // }
    let noteActor = NoteBookActor(this.getCanisterID());
    let ret = await noteActor.toppingNote(BigInt(id), toping);
    if (!ret) {
      return false;
    }
    // note.topTime = toping ? new Date().getTime() : 0;
    // _notes.sort(sortNotes);
    return true;
  }

  public async likeNote(id: number, like: boolean): Promise<boolean> {
    // let note = _notes.find((v) => {
    //   return v.id == id;
    // });

    // if (!note) {
    //   return false;
    // }
    let noteActor = NoteBookActor(this.getCanisterID());
    let ret = await noteActor.likeNote(BigInt(id), like);
    if (!ret) {
      return false;
    }
    // note.like = like;
    return true;
  }

  public async changeName(name: string): Promise<boolean> {
    let noteActor = NoteBookActor(this.getCanisterID());
    let ret = await noteActor.changeName(name);
    if (ret) {
      this.name = name;
    }
    return ret;
  }

  public async changeOwner(owner: Principal): Promise<boolean> {
    if (this.stat.noteCount > 0 || this.stat.boxCount > 0) {
      return false;
    }
    let noteActor = NoteBookActor(this.getCanisterID());
    let ret = await noteActor.changeOwner(owner);
    return ret;
  }

  public async loadNoteStat(): Promise<SimpleStat> {
    let noteActor = NoteBookActor(this.getCanisterID());
    let stat = await noteActor.statNotes();

    this.loadingStat = false;
    this.stat.noteCount = Number(stat.noteCount);
    this.stat.boxCount = Number(stat.boxCount);
    return this.stat;
  }
}

var _notes: SimpleNote[] = reactive([]);
var _page: number = 1;
var _size: number = 30;
var _curnote: SimpleNote = reactive({ title: '', ntype: '', content: '', tags: [] });
var _curbox: SimpleNote = reactive({ title: '', ntype: '', content: '', tags: [] });

export const LoadNoteStat = async (): Promise<boolean> => {
  let curbook = GetCurNoteBook();
  if (curbook.getCanisterID().isAnonymous()) {
    return false;
  }
  await curbook.loadNoteStat();
  return true;
};

export const GetShowNotes = () => {
  return _notes;
};

export const LoadNotes = async (force: boolean = false, ntype: string, sort: string): Promise<boolean> => {
  let curbook = GetCurNoteBook();
  if (curbook.getCanisterID().isAnonymous()) {
    return false;
  }

  if (force) {
    _page = 1;
    _notes.length = 0;
  } else {
    _page += 1;
  }

  let notes = await curbook.getNoteList(ntype, _page, _size, sort);
  notes.forEach((note) => {
    let idx = _notes.findIndex((v) => {
      return v.id == note.id;
    });
    if (idx !== -1) {
      _notes.splice(idx, 1, note);
    } else {
      _notes.push(note);
    }
  });
  return true;
};

export const CreateNote = async (note: SimpleNote): Promise<number> => {
  let curbook = GetCurNoteBook();
  if (curbook.getCanisterID().isAnonymous()) {
    return 0;
  }

  try {
    let ret = await curbook.createNote(note);
    note.id = Number(ret);
    note.updateTime = note.createTime = new Date().getTime();
    note.version = 1;
    _notes.unshift(note);
    return note.id;
  } catch (e) {
    console.log(e);
  }
  return 0;
};

export const UpdateNote = async (note: SimpleNote): Promise<boolean> => {
  let curbook = GetCurNoteBook();
  if (curbook.getCanisterID().isAnonymous()) {
    return false;
  }

  try {
    let ret = await curbook.updateNote(note);
    if (!ret) {
      return false;
    }
  } catch (e) {
    return false;
  }

  let idx = _notes.findIndex((v, idx) => {
    return v.id == note.id;
  });
  if (idx !== -1) {
    _notes.splice(idx, 1);
    _notes.unshift(note);
  }
  _notes.sort(sortNotes);
  return true;
};

export const DeleteNote = async (id: number): Promise<boolean> => {
  let idx = _notes.findIndex((v) => {
    return v.id == id;
  });
  if (idx == -1) {
    return false;
  }
  let curbook = GetCurNoteBook();
  if (curbook.getCanisterID().isAnonymous()) {
    return false;
  }
  let note = _notes[idx];
  let ret = await curbook.deleteNote(id, note.ntype);
  if (!ret) {
    return false;
  }
  // if (note.ntype == NTYPE_BOXITEM) {
  //   _stat.boxCount -= 1;
  // } else {
  //   _stat.noteCount -= 1;
  // }
  _notes.splice(idx, 1);
  return true;
};

export const TopingNote = async (id: number, toping: boolean): Promise<boolean> => {
  let curbook = GetCurNoteBook();
  if (curbook.getCanisterID().isAnonymous()) {
    return false;
  }
  let note = _notes.find((v) => {
    return v.id == id;
  });

  if (!note) {
    return false;
  }
  let ret = curbook.topingNote(id, toping);
  if (!ret) {
    return false;
  }
  console.log(note.id, toping);
  note.topTime = toping ? new Date().getTime() : 0;
  _notes.sort(sortNotes);
  return true;
};

export const LikeNote = async (id: number, like: boolean): Promise<boolean> => {
  let curbook = GetCurNoteBook();
  if (curbook.getCanisterID().isAnonymous()) {
    return false;
  }
  let note = _notes.find((v) => {
    return v.id == id;
  });

  if (!note) {
    return false;
  }
  let ret = await curbook.likeNote(id, like);
  if (!ret) {
    return false;
  }
  note.like = like;
  return true;
};

export const SetCurNote = (id: number): boolean => {
  if (id == 0) {
    let note = { id: 0, title: '', ntype: '', content: '', tags: [] } as SimpleNote;
    Object.assign(_curnote, { ...{}, ...note });
    return true;
  }
  let note = _notes.find((v) => {
    return v.id == id;
  });
  if (!note) {
    return false;
  }
  if (note && note.id != _curnote.id) {
    Object.assign(_curnote, { ...{}, ...note });
    return true;
  }
  return false;
};

export const GetCurNote = (): SimpleNote => {
  return _curnote;
};

export const GetNoteData = async (id: number): Promise<string> => {
  let curbook = GetCurNoteBook();
  if (curbook.getCanisterID().isAnonymous()) {
    return '';
  }
  return await curbook.getNoteData(id);
};

export const SetCurBox = (id: number): boolean => {
  if (id == 0) {
    let note = { id: 0, title: '', ntype: '', content: '', tags: [] } as SimpleNote;
    Object.assign(_curbox, { ...{}, ...note });
    return true;
  }
  let note = _notes.find((v, idx) => {
    return v.id == id;
  });
  if (!note) {
    return false;
  }
  if (note && note.id != _curbox.id) {
    Object.assign(_curbox, { ...{}, ...note });
    return true;
  }
  return false;
};

export const GetCurBox = (): SimpleNote => {
  return _curbox;
};

const sortNotes = (a: SimpleNote, b: SimpleNote) => {
  let aTop = a.topTime ? a.topTime : 0;
  let bTop = b.topTime ? b.topTime : 0;
  let aTime = a.updateTime ? a.updateTime : 0;
  let bTime = b.updateTime ? b.updateTime : 0;
  if (aTop > 0 && bTop > 0) {
    return compareByTime(aTop, bTop);
  } else if (aTop > 0) {
    return -1;
  } else if (bTop > 0) {
    return 1;
  }

  return compareByTime(aTime, bTime);
};

const compareByTime = (a: number, b: number) => {
  if (a > b) {
    return -1;
  } else if (a == b) {
    return 0;
  }
  return 1;
};