import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const publicKey = new PublicKey("uTo6DVXrSoopNvfBfofWrfc4umXyV6kKGTeWj71JFwd");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const balanceInLamport = await connection.getBalance(publicKey);
const balanceInSOL = balanceInLamport / LAMPORTS_PER_SOL;

console.log(
    `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`,
  );