export const NoteBookFactory = ({ IDL }) => {
  const Principal = IDL.Principal;
  const NoteType = IDL.Variant({ 'Note': IDL.Null, 'BoxItem': IDL.Null });
  const MetaNote = IDL.Record({
    'id': IDL.Nat,
    'updateTime': IDL.Int,
    'title': IDL.Text,
    'like': IDL.Bool,
    'tags': IDL.Text,
    'createTime': IDL.Int,
    'version': IDL.Nat,
    'ntype': NoteType,
    'topTime': IDL.Int,
  });
  const NoteSort = IDL.Variant({
    'Like': IDL.Null,
    'TimeAsc': IDL.Null,
    'TimeDesc': IDL.Null,
  });
  const NoteStat = IDL.Record({ 'noteCount': IDL.Nat, 'boxCount': IDL.Nat });
  const NoteBook = IDL.Service({
    'changeName': IDL.Func([IDL.Text], [IDL.Bool], []),
    'changeOwner': IDL.Func([Principal], [IDL.Bool], []),
    'createNote': IDL.Func([MetaNote, IDL.Text], [IDL.Nat], []),
    'deleteNote': IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getNoteData': IDL.Func([IDL.Nat], [IDL.Text], ['query']),
    'getNoteList': IDL.Func(
      [IDL.Opt(NoteType), IDL.Nat, IDL.Nat, NoteSort],
      [IDL.Vec(MetaNote)],
      ['query'],
    ),
    'likeNote': IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
    'statNotes': IDL.Func([], [NoteStat], ['query']),
    'toppingNote': IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  });
  return NoteBook;
};
export const init = ({ IDL }) => { return [IDL.Principal, IDL.Text]; };
