import { NotesIdentity } from "./identity";

export const GetLocalAutoSave = () : number => {
  let ts = localStorage.getItem('_auto_save')
  if (!ts) {
    return 20;
  }
  return parseInt(ts);
}
export const SetLocalAutoSave = (ts : number)  => {
  localStorage.setItem('_auto_save', ts + '')
}

export const LoadLocalKeyDB = () : any[] =>{
  let dbtext = localStorage.getItem('_dnt_db');
  if (dbtext) {
    let data = JSON.parse(dbtext);
    return data;
  }
  return [];
}

export const UpdateCurrentLocalKey = (key) => {
  let identity = NotesIdentity.getIdentity()
  if (!identity) {
    return false;
  }
  let pid = identity.getPrincipal().toString()
  var db = LoadLocalKeyDB();
  let idx = db.findIndex((val, idx) => {
    return val.pid == pid;
  })
  if (idx == -1) {
    db.push({...{'pid': pid}, ...key})
  } else {
    let newKey = db[idx];
    db.splice(idx, 1, {...newKey, ...key});
  }

  let data = JSON.stringify(db)
  localStorage.setItem('_dnt_db', data);
}

export const GetCurrentLocalKey = ()=> {
  let identity = NotesIdentity.getIdentity()
  if (!identity) {
    return null;
  }
  let db = LoadLocalKeyDB();
  if (!db) {
    return null;
  }
  let pid = identity.getPrincipal().toString();
  let key = db.find((val, idx) => {
    return val.pid == pid;
  })
  return key ? key : null;
}

export const DeleteCurrentLocalKey = () : boolean => {
  let identity = NotesIdentity.getIdentity()
  if (!identity) {
    return false;
  }
  let pid = identity.getPrincipal().toString()
  var db = LoadLocalKeyDB();
  let idx = db.findIndex((val, idx) => {
    return val.pid == pid;
  })
  if (idx !== -1) {
    db.splice(idx, 1);
  }
  let data = JSON.stringify(db)
  localStorage.setItem('_dnt_db', data);
  return true;
}

export const FixSingleKeyDB = () => {
  let identity = NotesIdentity.getIdentity()
  if (!identity) {
    return null;
  }
  let db = localStorage.getItem('_dnt_db');
  let pk = localStorage.getItem('_dnt_pk');
  if (!pk || db) {
    return;
  }

  console.log('FixSingleKeyDB')
  let ak = localStorage.getItem('_dnt_ak');
  let ok = localStorage.getItem('_dnt_ok');
  let backup = localStorage.getItem('_dnt_backup');
  let data = {
    pk: '',
    pvk: '',
    mm: '',
    alias: '',
    ak: ak ? ak : '',
    ok: ok ? 1 : 0,
    bk: backup ? 1 : 0,
  }
  if (pk) {
    let dnt = JSON.parse(pk)
    data.mm = dnt.mm;
    data.pk = dnt.pk;
    data.pvk = dnt.pvk;
    data.alias = dnt.alias;
  }

  UpdateCurrentLocalKey(data);

  localStorage.removeItem('_dnt_ak');
  localStorage.removeItem('_dnt_pk');
  localStorage.removeItem('_dnt_ok');
  localStorage.removeItem('_dnt_backup');
}