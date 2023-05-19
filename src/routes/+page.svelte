<script>
import { Connection, PublicKey } from '@solana/web3.js'
import moment from 'moment';

// Set the wallet address to check
let walletAddressInit = '';

let apiSolana = 'https://api.mainnet-beta.solana.com/'

// Set the program ID to filter for
const programId = new PublicKey('TESTWCwvEv2idx6eZVQrFFdvEJqGHfVA1soApk2NFKQ');
//const programId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Set the maximum number of signatures to retrieve in each batch
const batchSize = 20;



let isFinished = false;
let transactionsByDay = new Map();
let promise = Promise.resolve(new Map());
async function handleClick() {

		await getData();
 
}

async function getTransactions(connection, signatures) {
  const promises = [];
  for (const signature of signatures) {
    promises.push(connection.getParsedConfirmedTransaction(signature));
  }
  return Promise.all(promises);
}





async function getData() {
    
    let walletStr = walletAddressInit;
    console.log("wa : "+walletStr);
    if(walletStr === ''){
        transactionsByDay.set('2023-05-01',0);
        return transactionsByDay;
    }
  // Set the wallet address to check
  const walletAddress = new PublicKey(walletStr);


  const connection = new Connection(apiSolana);

  let lastDate = '2100-04-14';
  let lastSignature = null;
  let lastBlockTime = 0;

  while (lastDate > '2023-04-25' && !isFinished) {
    let signatures = null;
    // Retrieve all transactions for the wallet
    if (lastSignature === null) {
      signatures = await connection.getConfirmedSignaturesForAddress2(
        walletAddress,
        { limit: 100 }
      );
    } else {
      console.log('get signature before ' + lastSignature)
      signatures = await connection.getConfirmedSignaturesForAddress2(
        walletAddress,
        { limit: 100, before: lastSignature }
      );
    }


    const transactionCount = signatures.length;
    console.log(`Total number of transactions: ${transactionCount}`);

    // Retrieve transactions in batches of 20
    let startIndex = 0;
    let endIndex = Math.min(batchSize, transactionCount);

    const str_sign = signatures.map(sign => sign.signature);
    lastSignature = str_sign[endIndex];
    if (signatures.length === 0) { isFinished = true }
    while (startIndex < transactionCount) {
      console.log('retrieve transaction from %d to %d', startIndex, endIndex);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const transactions = await getTransactions(connection, str_sign.slice(startIndex, endIndex));

      if (lastBlockTime === 0) {
        lastBlockTime = transactions[0].blockTime;
        lastSignature = transactions[0].signature;
      }
      transactions.forEach(a => {
        if (a.blockTime < lastBlockTime) {

          lastBlockTime = a.blockTime;
          lastSignature = a.transaction.signatures[0];
        }
      })

      const filteredTransactions = transactions.filter(({ transaction }) => transaction.message.instructions.some(i => i.programId.equals(programId)));

      filteredTransactions.forEach((transaction) => {
        const timestamp = transaction.slot * 4000 + 1230768000000; // Convert slot to Unix timestamp in milliseconds
        //const date = new Date(timestamp).toLocaleDateString();
        const date = moment.unix(transaction.blockTime).format("YYYY-MM-DD");
        if (date < lastDate) {
          lastDate = date;
        }
        if (transactionsByDay.has(date)) {
          transactionsByDay.set(date, transactionsByDay.get(date) + 1);
        } else {
          transactionsByDay.set(date, 1);
        }
      });
      console.log('fount %d filtered trx over %d transactions', filteredTransactions.length, transactions.length);
      startIndex += batchSize;
      endIndex = Math.min(startIndex + batchSize, transactionCount);
      transactionsByDay = new Map(transactionsByDay);
    }
    console.log('Transactions by day:');
    console.log(transactionsByDay)
    
    

  }

  return transactionsByDay;
}

</script>

<h1>Still building</h1>
<p>Visit <a href="https://romeguild.com/">ROME GUILD</a> </p>
<p>Solana RPC endpoint : <input bind:value={apiSolana} size="50"></p>
<p>Hey Put you Escape Velocity wallet address here and shout PROCESS button</p>
<input bind:value={walletAddressInit} size="50">
<button on:click={getData}> PROCESS </button>
<p> 
</p>  

{#each [...transactionsByDay] as [key, value]}
  <li>day : {key} you did : {value} moves on escape velocity</li>
{/each}
