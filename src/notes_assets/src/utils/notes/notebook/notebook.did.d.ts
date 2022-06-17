import type { Principal } from '@dfinity/principal';
export interface MetaNote {
  'id' : bigint,
  'updateTime' : bigint,
  'title' : string,
  'like' : boolean,
  'tags' : string,
  'createTime' : bigint,
  'version' : bigint,
  'ntype' : NoteType,
  'topTime' : bigint,
}
export interface NoteBook {
  'changeName' : (arg_0: string) => Promise<boolean>,
  'changeOwner' : (arg_0: Principal) => Promise<boolean>,
  'createNote' : (arg_0: MetaNote, arg_1: string) => Promise<bigint>,
  'deleteNote' : (arg_0: bigint) => Promise<boolean>,
  'getNoteData' : (arg_0: bigint) => Promise<string>,
  'getNoteList' : (
      arg_0: [] | [NoteType],
      arg_1: bigint,
      arg_2: bigint,
      arg_3: NoteSort,
    ) => Promise<Array<MetaNote>>,
  'likeNote' : (arg_0: bigint, arg_1: boolean) => Promise<boolean>,
  'statNotes' : () => Promise<NoteStat>,
  'toppingNote' : (arg_0: bigint, arg_1: boolean) => Promise<boolean>,
}
export type NoteSort = { 'Like' : null } |
  { 'TimeAsc' : null } |
  { 'TimeDesc' : null };
export interface NoteStat { 'noteCount' : bigint, 'boxCount' : bigint }
export type NoteType = { 'Note' : null } |
  { 'BoxItem' : null };
export interface _SERVICE extends NoteBook {}
