import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const suppliedPublicKey = process.argv[2];

if (!suppliedPublicKey) {
  console.error("❌ Provide a public key to check the balance of!");
  process.exit(1);
}

function isValidSolAddress(suppliedPublicKey: string): boolean {
  try {
    const publicKey = new PublicKey(suppliedPublicKey);
    return PublicKey.isOnCurve(publicKey.toBytes());
  } catch {
    return false;
  }
}

async function getBalanceInSol(suppliedPublicKey: string) {
  if (!isValidSolAddress(suppliedPublicKey)) {
    throw new Error("Invalid public key!");
  }

  const publicKey = new PublicKey(suppliedPublicKey);
  const balanceInLamports = await connection.getBalance(publicKey);
  return balanceInLamports / LAMPORTS_PER_SOL;
}

(async () => {
  try {
    const balance = await getBalanceInSol(suppliedPublicKey);
    console.log(`✅ Finished! The balance for the wallet at address ${suppliedPublicKey} is ${balance} SOL.`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
})();
