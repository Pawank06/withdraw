/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ethers } from "ethers";
import { controllerContractAbi } from "./controllerabi";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [proxyAddress, setProxyAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [salt, setSalt] = useState("");
  const [signature, setSignature] = useState("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const controllerAddress = "0x54d02DcB38B76A67dC9368D8457D1F384B865c70";

  const getBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(parseFloat(balanceEth).toFixed(4)));
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed!");

      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      await getBalance(accounts[0]);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  // Withdraw Assets
  const withdrawAsset = async () => {
    try {
      setTransactionHash(null);
      setErrorMessage(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const controllerContract = new ethers.Contract(
        controllerAddress,
        controllerContractAbi,
        signer
      );

      const formattedSalt = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));

      const result = await controllerContract.withdrawAsset(
        proxyAddress, //parameters[0]
        tokenAddress, //parameters[1]
        amount,     //parameters[2]
        recipient,  //parameters[3]
        expiresAt,  //parameters[4]
        formattedSalt, // salt
        signature    // parameters[6]
      );

      console.log("Withdraw Transaction Sent:", result);
      setTransactionHash(result.hash);
    } catch (err: any) {
      console.error("Withdraw failed:", err);
      setErrorMessage(err.reason || err.message || "Transaction failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Base Sepolia Wallet</h1>

        {!account ? (
          <div className="flex justify-center">
            <button
              onClick={connectWallet}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-center">
              <p className="font-medium">Account: <span className="text-gray-600">{account}</span></p>
              <p className="font-medium">Balance: <span className="text-green-500">{balance} ETH</span></p>
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="mb-3 font-semibold text-2xl text-red-600 text-center">
                Make sure you are executing the signature using its parameter values.
                </h1>

                <label className="block text-sm font-medium text-gray-700">Proxy Address **<span className="text-lg font-medium text-green-600">parameters[0]</span>**</label>
                <input
                  type="text"
                  value={proxyAddress}
                  onChange={(e) => setProxyAddress(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Enter Proxy Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Token Address **<span className="text-lg font-medium text-green-600">parameters[1]</span>**</label>
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Enter Token Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount **<span className="text-lg font-medium text-green-600">parameters[2]</span>**</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Address **<span className="text-lg font-medium text-green-600">parameters[3]</span>**</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Enter Recipient Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expires At (Timestamp) **<span className="text-lg font-medium text-green-600">parameters[4]</span>**</label>
                <input
                  type="text"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Expiry Timestamp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Salt (Base64) **<span className="text-lg font-medium text-green-600">salt</span>**</label>
                <input
                  type="text"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Enter Salt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Signature **<span className="text-lg font-medium text-green-600">parameters[6]</span>**</label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Enter Signature"
                />
              </div>
            </div>

            <button
              onClick={withdrawAsset}
              className="mt-6 w-full bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition"
            >
              Withdraw
            </button>

            {/* Success Message */}
            {transactionHash && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                <p>Transaction Successful!</p>
                <p>
                  <a
                    href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Transaction
                  </a>
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                <p>Error: {errorMessage}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
