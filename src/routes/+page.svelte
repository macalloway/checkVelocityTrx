<script>
	import { Connection, PublicKey } from '@solana/web3.js';
	import moment from 'moment';
	import { construct_svelte_component_dev } from 'svelte/internal';

	// Set the wallet address to check
	let walletAddressInit = '';

	let apiSolana = '';

	const maxPastDate = '2023-05-11';
  let isLoading = false;

	// Set the program ID to filter for
	const programId = new PublicKey('TESTWCwvEv2idx6eZVQrFFdvEJqGHfVA1soApk2NFKQ');
	//const programId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

	// Set the maximum number of signatures to retrieve in each batch
	const batchSize = 15;

	let isFinished = false;
	let transactionsByDay = new Map();
	let promise = Promise.resolve(new Map());
	async function handleClick() {
    isLoading = true;
    await getData();
    isLoading = false;
	}

	async function getTransactions(connection, signatures) {
		/*const promises = [];
    for (const signature of signatures) {
      promises.push(connection.getParsedTransaction(signature,{ maxSupportedTransactionVersion: 0 }));
    }
    return Promise.all(promises);*/

		const transactions = await connection.getParsedTransactions(signatures, {
			maxSupportedTransactionVersion: 0,
			encoding: 'jsonParsed',
			commitment: 'confirmed'
		});
		return transactions.flatMap((txs) => txs);
	}

	async function getData() {
    transactionsByDay = new Map();
		let walletStr = walletAddressInit;
		console.log('wa : ' + walletStr);
		if (walletStr === '') {
			transactionsByDay.set('2023-05-11', 0);
			return transactionsByDay;
		}
		// Set the wallet address to check
		const walletAddress = new PublicKey(walletStr);

		const connection = new Connection(apiSolana);

		let lastDate = '2100-05-14';
		let lastSignature = null;
		let lastBlockTime = 0;

		while (lastDate >= maxPastDate && !isFinished) {
			let signatures = null;
			// Retrieve all transactions for the wallet
			if (lastSignature === null) {
				signatures = await connection.getConfirmedSignaturesForAddress2(walletAddress, {
					limit: 200
				});
			} else {
				console.log('get signature before ' + lastSignature);
				signatures = await connection.getConfirmedSignaturesForAddress2(walletAddress, {
					limit: 200,
					before: lastSignature
				});
			}

			const transactionCount = signatures.length;
			console.log(`Total number of transactions: ${transactionCount}`);

			// Retrieve transactions in batches of 20
			let startIndex = 0;
			let endIndex = Math.min(batchSize, transactionCount);

			const str_sign = signatures.map((sign) => sign.signature);
			lastSignature = str_sign[endIndex];
			if (signatures.length === 0) {
				isFinished = true;
			}
			while (startIndex < transactionCount) {
				console.log('retrieve transaction from %d to %d', startIndex, endIndex);
				await new Promise((resolve) => setTimeout(resolve, 1200));
				const transactions = await getTransactions(
					connection,
					str_sign.slice(startIndex, endIndex)
				);

				if (lastBlockTime === 0) {
					lastBlockTime = transactions[0].blockTime;
					lastSignature = transactions[0].signature;
				}
				transactions.forEach((a) => {
					if (a.blockTime < lastBlockTime) {
						lastBlockTime = a.blockTime;
						lastSignature = a.transaction.signatures[0];
					}
				});
				lastDate = moment.unix(lastBlockTime).format('YYYY-MM-DD');
				console.log(lastDate);
				const filteredTransactions = transactions.filter(({ transaction }) =>
					transaction.message.instructions.some((i) => i.programId.equals(programId))
				);
				filteredTransactions.forEach((transaction) => {
					const timestamp = transaction.slot * 4000 + 1230768000000; // Convert slot to Unix timestamp in milliseconds
					const date = moment.unix(transaction.blockTime).format('YYYY-MM-DD');

					// check if log contains goToWarp call
					let containsWrap = transaction.meta.logMessages.some((m) => m.includes('GoToWarp'));

					if (containsWrap) {
						if (transactionsByDay.has(date)) {
							transactionsByDay.set(date, transactionsByDay.get(date) + 1);
						} else {
							transactionsByDay.set(date, 1);
						}
					}
				});
				console.log(
					'fount %d filtered trx over %d transactions',
					filteredTransactions.length,
					transactions.length
				);
				startIndex += batchSize;
				endIndex = Math.min(startIndex + batchSize, transactionCount);
				transactionsByDay = new Map(transactionsByDay);
			}
			console.log('Transactions by day:');
			console.log(transactionsByDay);
		}

		return transactionsByDay;
	}
</script>

<h1>Get your Escape Velocity moves transactions per day</h1>
<p>
	This project is just for me a way to learn and study how to interact directly with solana
	blockchain. It also helps me to learn how to build front app with svelte.
</p>
<p>
	Using Free accounts to interact with solana blockchain (via RPC services) is quite slow and
	permits only a very limited number of interactions
</p>
<p>
	That s why this service will ask you to create an account to a RPC provider and fill it here to
	use this service nothing is store you can check source code here : <a
		href="https://github.com/macalloway/checkVelocityTrx">Source code</a
	>. Anyone is welcome to participate
</p>
<p>
	To use this service correctly you need to create an account (Free should be enough) to a Solana
	RPC provider, please vistit this one as i got good results to make this program work : <a
		href="https://www.quicknode.com/login">quinode RPC provider</a>
</p>
<p class="instruc">  Page 1 : Here select Endpoint -> create an Endpoint -> Solana -> Mainet Beta.
 <br/>Page 2 : No add on needed
 <br/>Page 3 : Select Discover offer
</p>
<p>
	Solana RPC endpoint it shouldbe something like :
	https://small-alien-lambo.solana-mainnet.discover.quiknode.pro/46554654646464564654654 you can
	find it here : <a href="https://www.quicknode.com/endpoints"
		>https://www.quicknode.com/endpoints</a
	>
</p>
<p >Please fill here your RPC endpoint : <input bind:value={apiSolana} size="50" /></p>
<p>
	Now you can fill your wallet address here : <input bind:value={walletAddressInit} size="50" />
	<button on:click={handleClick}> PROCESS </button>
</p>
<p>
	Remember service is quite slow ! It do not display data before Never Alone campaign : {maxPastDate}
</p>

{#if isLoading}
  <div class="spinner"></div>
{/if}
<ol class="counter">
{#each [...transactionsByDay] as [key, value]}
	{#if key >= maxPastDate}
		<li><div class="result">day : {key} you did : {value} moves on escape velocity</div></li>
	{/if}
{/each}
</ol>

<style>
  ol {
    list-style-type: decimal;
  }

  li { 
    padding-left: 16px; 
  }
  .result {
    font-size: 110%;
  }

  p.instruc {

padding:1em 1em 1em 5em;
}

.spinner {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
