import { NotesIdentity } from './identity';
import { Principal } from '@dfinity/principal';
import { createActor, PLANET_NFT_CANISTER_ID } from './ic/nft';

import { ab2str, get_account_id, to32bits } from './util';

export interface NFTDetails {
  index: bigint;
  canister: string;
  id?: string;
  name?: string;
  url: string;
  metadata: any;
  standard: string;
  collection?: string;
  owner?: string;
}

const PlanetNFTActor = () => {
  return createActor({
    agentOptions: {
      identity: NotesIdentity.getIdentity(),
    },
  });
};

export const GetMyPlanetNFT = async (): Promise<NFTDetails[]> => {
  let actor = PlanetNFTActor();
  let identity = NotesIdentity.getIdentity();
  if (!identity) {
    return [];
  }

  const from = get_account_id(identity.getPrincipal().toString());
  let ret = await actor.tokens_ext(from);
  if (!ret) {
    return [];
  }
  if ('err' in ret) {
    return [];
  }
  const tokens = ret.ok || [];
  return tokens.map((token) => {
    const metadata = token[2];
    const tokenIndex = token[0];

    return serializeTokenData(metadata, getTokenIdentifier(PLANET_NFT_CANISTER_ID, tokenIndex), tokenIndex);
  });
};

export const TransferPlanetNFT = async (to: Principal, tokenIndex: number): Promise<Boolean> => {
  let agent = NotesIdentity.getIdentity();
  if (!agent) {
    return false;
  }
  const tokenIdentifier = getTokenIdentifier(PLANET_NFT_CANISTER_ID, tokenIndex);
  const from = agent.getPrincipal();
  const dummyMemmo = new Array(32).fill(0);

  let actor = PlanetNFTActor();
  const transferResult = await actor.transfer({
    to: { principal: to },
    from: { principal: from },
    token: tokenIdentifier,
    amount: BigInt(1),
    memo: dummyMemmo,
    notify: false,
    subaccount: [],
    // fee: BigInt(0),
  });
  if ('err' in transferResult) {
    console.log(`${Object.keys(transferResult.err)[0]}: ${Object.values(transferResult.err)[0]}`);
    return false;
  }
  return true;
};

const getTokenIdentifier = (canister: string, index: number): string => {
  const padding = Buffer.from('\x0Atid');
  const array = new Uint8Array([...padding, ...Principal.fromText(canister).toUint8Array(), ...to32bits(index)]);
  return Principal.fromUint8Array(array).toText();
};

const extImageUrl = (canisterId, index, tokenIdentifier) => {
  return `https://${canisterId}.raw.ic0.app/?type=thumbnail&tokenid=${tokenIdentifier}`;
};

// async details(tokenIndex: number): Promise<NFTDetails> {
//   const tokenIdentifier = getTokenIdentifier(this.canisterId, tokenIndex);
//   const metadataResult = await this.actor.metadata(tokenIdentifier);

//   if ('err' in metadataResult)
//     throw new Error(
//       `${Object.keys(metadataResult.err)[0]}: ${
//         Object.values(metadataResult.err)[0]
//       }`
//     );

//   const { metadata = {} } = 'nonfungible' in metadataResult.ok ? metadataResult.ok.nonfungible : {} ;

//   return this.serializeTokenData(metadata, tokenIdentifier, tokenIndex);
// }

const serializeTokenData = (metadata: any, tokenIdentifier: string, tokenIndex: number): NFTDetails => {
  let data: any = metadata.length ? metadata[0] : undefined;
  if (data) {
    data = JSON.parse(ab2str(Uint8Array.from(data)));
  }
  return {
    id: tokenIdentifier,
    index: BigInt(tokenIndex),
    canister: PLANET_NFT_CANISTER_ID,
    metadata: data,
    url: extImageUrl(PLANET_NFT_CANISTER_ID, tokenIndex, tokenIdentifier),
    standard: 'EXT',
  };
};
