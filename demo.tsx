

  // Withdraw Assets
  const withdrawAsset = async () => {
    try {

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
    } catch (err: any) {
      console.error("Withdraw failed:", err);
    }
  };