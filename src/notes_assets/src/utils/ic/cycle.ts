import { Actor, HttpAgent } from '@dfinity/agent';
import idlFactory from './cycle.did';
export const CYCLES_CANISTER_ID = 'rkp4c-7iaaa-aaaaa-aaaca-cai';
import _SERVICE from './cycle.int';
/**
 *
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<_SERVICE>}
 */
export const createActor = (options) => {
  const agent = new HttpAgent({ ...{ host: 'https://ic0.app/' }, ...options?.agentOptions });

  // Fetch root key for certificate validation during development
  if (process.env.NODE_ENV !== 'production') {
    agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  let canisterId = CYCLES_CANISTER_ID;
  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};

export const GetCycleActor = () => {
  return createActor(null);
};
