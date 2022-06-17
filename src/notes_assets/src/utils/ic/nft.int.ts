import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
export interface AllowanceRequest {
  token: TokenIdentifier;
  owner: User;
  spender: Principal;
}
export interface ApproveRequest {
  token: TokenIdentifier;
  subaccount: [] | [SubAccount];
  allowance: Balance;
  spender: Principal;
}
export type Balance = bigint;
export interface BalanceRequest {
  token: TokenIdentifier;
  user: User;
}
export type BalanceResponse = { ok: Balance } | { err: CommonError__1 };
export type Balance__1 = bigint;
export type CommonError = { InvalidToken: TokenIdentifier } | { Other: string };
export type CommonError__1 = { InvalidToken: TokenIdentifier } | { Other: string };
export type Extension = string;
export type HeaderField = [string, string];
export interface HttpRequest {
  url: string;
  method: string;
  body: Array<number>;
  headers: Array<HeaderField>;
}
export interface HttpResponse {
  body: Array<number>;
  headers: Array<HeaderField>;
  status_code: number;
}
export interface Listing {
  locked: [] | [Time];
  seller: Principal;
  price: bigint;
}
export type Memo = Array<number>;
export type Metadata =
  | {
      fungible: {
        decimals: number;
        metadata: [] | [Array<number>];
        name: string;
        symbol: string;
      };
    }
  | { nonfungible: { metadata: [] | [Array<number>] } };
export interface MintRequest {
  to: User;
  metadata: [] | [Array<number>];
}
export type Result =
  | {
      ok: Array<[TokenIndex, [] | [Listing], [] | [Array<number>]]>;
    }
  | { err: CommonError };
export type Result_1 = { ok: Array<TokenIndex> } | { err: CommonError };
export type Result_2 = { ok: Balance__1 } | { err: CommonError };
export type Result__1 = { ok: Metadata } | { err: CommonError };
export type Result__1_1 = { ok: AccountIdentifier__1 } | { err: CommonError };
export type Result__1_2 = { ok: Balance__1 } | { err: CommonError };
export type SubAccount = Array<number>;
export type Time = bigint;
export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
export type TokenIndex = number;
export interface TransferRequest {
  to: User;
  token: TokenIdentifier;
  notify: boolean;
  from: User;
  memo: Memo;
  subaccount: [] | [SubAccount];
  amount: Balance;
}
export type TransferResponse =
  | { ok: Balance }
  | {
      err: { CannotNotify: AccountIdentifier } | { InsufficientBalance: null } | { InvalidToken: TokenIdentifier } | { Rejected: null } | { Unauthorized: AccountIdentifier } | { Other: string };
    };
export type User = { principal: Principal } | { address: AccountIdentifier };
export interface _SERVICE {
  acceptCycles: () => Promise<undefined>;
  allowance: (arg_0: AllowanceRequest) => Promise<Result__1_2>;
  approve: (arg_0: ApproveRequest) => Promise<boolean>;
  approveAll: (arg_0: Array<ApproveRequest>) => Promise<Array<TokenIndex>>;
  availableCycles: () => Promise<bigint>;
  balance: (arg_0: BalanceRequest) => Promise<BalanceResponse>;
  batchMintNFT: (arg_0: Array<MintRequest>) => Promise<Array<TokenIndex>>;
  bearer: (arg_0: TokenIdentifier__1) => Promise<Result__1_1>;
  extensions: () => Promise<Array<Extension>>;
  getAllowances: () => Promise<Array<[TokenIndex, Principal]>>;
  getMinter: () => Promise<Principal>;
  getProperties: () => Promise<Array<[string, Array<[string, bigint]>]>>;
  getRegistry: () => Promise<Array<[TokenIndex, AccountIdentifier__1]>>;
  getRootBucketId: () => Promise<[] | [string]>;
  getTokens: () => Promise<Array<[TokenIndex, Metadata]>>;
  getTokensByIds: (arg_0: Array<TokenIndex>) => Promise<Array<[TokenIndex, Metadata]>>;
  getTokensByProperties: (arg_0: Array<[string, Array<string>]>) => Promise<Array<[TokenIndex, Metadata]>>;
  http_request: (arg_0: HttpRequest) => Promise<HttpResponse>;
  initCap: () => Promise<[] | [string]>;
  initproperties: () => Promise<undefined>;
  metadata: (arg_0: TokenIdentifier__1) => Promise<Result__1>;
  mintNFT: (arg_0: MintRequest) => Promise<TokenIndex>;
  setMinter: (arg_0: Principal) => Promise<undefined>;
  supply: (arg_0: TokenIdentifier__1) => Promise<Result_2>;
  tokens: (arg_0: AccountIdentifier__1) => Promise<Result_1>;
  tokens_ext: (arg_0: AccountIdentifier__1) => Promise<Result>;
  transfer: (arg_0: TransferRequest) => Promise<TransferResponse>;
}
