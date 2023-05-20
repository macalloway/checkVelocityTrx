import { c as create_ssr_component, d as add_attribute, f as each, e as escape } from "../../chunks/index2.js";
import { PublicKey } from "@solana/web3.js";
import "moment";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let walletAddressInit = "";
  let apiSolana = "";
  new PublicKey("TESTWCwvEv2idx6eZVQrFFdvEJqGHfVA1soApk2NFKQ");
  let transactionsByDay = /* @__PURE__ */ new Map();
  Promise.resolve(/* @__PURE__ */ new Map());
  return `<h1>Get your Escape Velocity moves transactions per day</h1>
<p>This project is just for me a way to learn and study how to interact directly with solana blockchain. It also helps me to learn how to build front app with svelte.</p>
<p>Using Free accounts to interact with solana blockchain (via RPC services) is quite slow and permits only a very limited number of interactions</p>
<p>That s why this service will ask you to create an account to a RPC provider and fill it here to use this service nothing is store you can check source code here : <a href="https://github.com/macalloway/checkVelocityTrx">Source code</a>. Anyone is welcome to participate</p>
<p>To use this service correctly you need to create an account to a Solana RPC provider, please vistit this one as i got good results to make this program work : <a href="https://www.quicknode.com/login">quinode RPC provider</a></p>
<p>Solana RPC endpoint it shouldbe something like : https://small-alien-lambo.solana-mainnet.discover.quiknode.pro/46554654646464564654654 you can find it here : <a href="https://www.quicknode.com/endpoints">https://www.quicknode.com/endpoints</a></p>
<p>Please fill here your RPC endpoint : <input size="50"${add_attribute("value", apiSolana, 0)}></p>
<p>Now you can fill your wallet address her<input size="50"${add_attribute("value", walletAddressInit, 0)}>
  <button>PROCESS </button></p>
<p>Remember service is quite slow !
</p>  

${each([...transactionsByDay], ([key, value]) => {
    return `<li>day : ${escape(key)} you did : ${escape(value)} moves on escape velocity</li>`;
  })}`;
});
export {
  Page as default
};
