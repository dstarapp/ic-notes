import { Actor, HttpAgent } from '@dfinity/agent';
import idlFactory from './ledger.did';
export const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
import { LedgerService } from './ledger.int';
/**
 *
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<LedgerService>}
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

  let canisterId = LEDGER_CANISTER_ID;
  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor<LedgerService>(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};
