import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './nft.did';
import { _SERVICE as NFTService } from './nft.int';

/**
 * Mora Planet NFT canister ID
 */
export const PLANET_NFT_CANISTER_ID = 'slzze-ciaaa-aaaah-aa7ra-cai';
/**
 *
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<LedgerService>}
 */
export const createActor = (options) => {
  const agent = new HttpAgent({ ...{ host: 'https://boundary.ic0.app/' }, ...options?.agentOptions });

  // Fetch root key for certificate validation during development
  if (process.env.NODE_ENV !== 'production') {
    agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  let canisterId = PLANET_NFT_CANISTER_ID;
  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor<NFTService>(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};
