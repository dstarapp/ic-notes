// import { Principal } from '@dfinity/principal';
import { NotesIdentity } from './identity';
import RosettaApi from './rosetta';
import { get_account_id } from './util';
import { SendArgs, NotifyCanisterArgs } from './ic/ledger.int';
import { createActor } from './ic/ledger';
import { validateAccountId, validatePrincipalId } from './ic/constant';
import { Principal } from '@dfinity/principal';
import { AccountIdentifier, SubAccount } from './ic/account';
import { GetCycleActor } from './ic/cycle';
import { GetNoteBooks } from './notes/notes';
import axios from 'axios';

const rosettaApi = new RosettaApi();
var _balance: number = 0.0;
var _icp2sdr: number = 1.0;
var _sdr2usd: number = 1.4;
// var ledgerActor: ActorSubclass<LedgerService> | null = null;

const GetLedgerActor = () => {
  return createActor({
    agentOptions: {
      identity: NotesIdentity.getIdentity(),
    },
  });
};

export const InitWallet = async () => {
  await LoadBalance();
};

export const LoadBalance = async (): Promise<number> => {
  let principal = NotesIdentity.getIdentity()?.getPrincipal();
  if (!principal) {
    return 0.0;
  }
  let address = get_account_id(principal.toString());
  let balance = await rosettaApi.getAccountBalance(address);
  _balance = Number(balance) / 10 ** 8;
  return _balance;
};

export const GetBalance = (): number => {
  return _balance;
};

export const GetAddress = (): string => {
  let principal = NotesIdentity.getIdentity()?.getPrincipal();
  if (!principal) {
    return '';
  }
  return get_account_id(principal.toString());
};

export interface SendOpts {
  fee?: bigint;
  memo?: bigint;
  from_subaccount?: number;
}

// 100_000_000
export const TransferICP = async (addr: string, amount: bigint, opts: SendOpts): Promise<bigint> => {
  const defaultArgs = {
    fee: BigInt(10_000),
    memo: BigInt(0),
  };
  let ledgerActor = GetLedgerActor();
  if (ledgerActor == null) {
    throw new Error('ledgerActor is null');
  }
  if (!validatePrincipalId(addr)) {
    if (!validateAccountId(addr)) {
      throw new Error('Invalid principal id or address id');
    }
  } else {
    addr = get_account_id(addr);
  }

  let args: SendArgs = {
    to: addr, //Should be an address
    amount: { e8s: amount },
    fee: { e8s: opts?.fee || defaultArgs.fee },
    memo: opts?.memo ? opts.memo : defaultArgs.memo,
    from_subaccount: [],
    created_at_time: [],
  };

  let height = await ledgerActor.send_dfx(args);
  return BigInt(height);
};

export const LoadTransaction = async () => {
  let principal = NotesIdentity.getIdentity()?.getPrincipal();
  if (!principal) {
    return [];
  }

  let address = get_account_id(principal.toString());
  const transactions = await rosettaApi.getTransactionsByAccount(address);
  if (!transactions) {
    return [];
  }
  transactions.sort((a, b) => {
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
  return transactions;
};

const CYCLE_MINTER_CANISTER_ID: string = 'rkp4c-7iaaa-aaaaa-aaaca-cai';
const MEMO_TOP_UP_CANISTER: bigint = BigInt(1347768404);

export const DepositCycles = async (canisterId: Principal, icpAmount: bigint): Promise<boolean> => {
  let cycle_canister_id = Principal.fromText(CYCLE_MINTER_CANISTER_ID);
  let sub = SubAccount.fromPrincipal(canisterId);
  let to = AccountIdentifier.fromPrincipal(cycle_canister_id, sub);
  let ledgerActor = GetLedgerActor();

  let height = await TransferICP(to.toHex(), icpAmount, {
    memo: MEMO_TOP_UP_CANISTER, // TPUP
  });
  let args: NotifyCanisterArgs = {
    max_fee: { e8s: BigInt(10_000) },
    to_canister: cycle_canister_id,
    from_subaccount: [],
    to_subaccount: [Array.from(sub.toUint8Array())],
    block_height: height,
  };
  await ledgerActor?.notify_dfx(args);
  return true;
};

export const GetIcpCycleRate = (): number => {
  return _icp2sdr;
};

export const LoadIcpCycleRate = async (): Promise<number> => {
  let actor = GetCycleActor();
  let fee = await actor.get_icp_xdr_conversion_rate();
  console.log(fee.data.xdr_permyriad_per_icp);
  let b = Number(fee.data.xdr_permyriad_per_icp) / 10 ** 4;
  // 1 ICP => x SDR
  // 1T cycle => 1 SDR
  console.log('1ICP => SDR', b);
  _icp2sdr = b;
  return b;
};

export const CheckCycleAddress = (addr: string): boolean => {
  let notes = GetNoteBooks();
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    if (note.getCanisterID().isAnonymous()) {
      continue;
    }
    let cycle_canister_id = Principal.fromText(CYCLE_MINTER_CANISTER_ID);
    let sub = SubAccount.fromPrincipal(note.getCanisterID());
    let to = AccountIdentifier.fromPrincipal(cycle_canister_id, sub);

    if (to.toHex() == addr) {
      return true;
    }
  }
  return false;
};

export const CheckNotesFeeAddress = (addr: string): boolean => {
  return addr == '6d9470ab185fde2d69caa02dc196800f81114f9715244246642b5666d88ab63d';
};

export const GetSdr2Usd = (): number => {
  return _sdr2usd;
};

export const LoadSdr2Usd = (): Promise<number> => {
  return axios
    .get('https://free.currconv.com/api/v7/convert', {
      params: {
        q: 'XDR_USD',
        compact: 'ultra',
        apiKey: '030d102097853a2a8384',
      },
    })
    .then((resp) => {
      _sdr2usd = Number(resp.data.XDR_USD);
      console.log('1SDR => USD', _sdr2usd);
      return _sdr2usd;
    })
    .catch((err) => {
      // console.log(err);
      return _sdr2usd;
    });
};
