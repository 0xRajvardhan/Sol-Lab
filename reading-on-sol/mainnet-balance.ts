import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const suppliedKey = process.argv[2];

if (!suppliedKey) {
  console.error("❌ Provide a public key or .sol domain to check the balance of!");
  process.exit(1);
}

function isValidSolAddress(address: string): boolean {
  try {
    const publicKey = new PublicKey(address);
    return PublicKey.isOnCurve(publicKey.toBytes());
  } catch {
    return false;
  }
}

async function resolveDomainToPublicKey(domain: string): Promise<PublicKey> {
  try {
    // Handle .sol domains
    if (domain.endsWith('.sol')) {
      const { pubkey } = await getDomainKey(domain);
      const owner = await NameRegistryState.retrieve(connection, pubkey);
      return owner.owner;
    }
    throw new Error("Unsupported domain format");
  } catch (error) {
    throw new Error(`Failed to resolve domain: ${error.message}`);
  }
}

async function getBalanceInSol(key: string) {
  let publicKey: PublicKey;
  
  if (key.endsWith('.sol')) {
    publicKey = await resolveDomainToPublicKey(key);
    console.log(`Resolved ${key} to address: ${publicKey.toString()}`);
  } else if (isValidSolAddress(key)) {
    publicKey = new PublicKey(key);
  } else {
    throw new Error("Invalid public key or domain!");
  }
  
  const balanceInLamports = await connection.getBalance(publicKey);
  return {
    publicKey: publicKey.toString(),
    balance: balanceInLamports / LAMPORTS_PER_SOL
  };
}

(async () => {
  try {
    const result = await getBalanceInSol(suppliedKey);
    console.log(`✅ Finished! The balance for ${suppliedKey} (${result.publicKey}) is ${result.balance} SOL.`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
})();