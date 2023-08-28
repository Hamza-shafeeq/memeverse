const TronWeb = require("tronweb");
require("dotenv").config();
// const ITRC20ABI = require("./ITRC20.json");

const walletAddress = 'TEPSrSYPDSQ7yXpMFPq91Fb1QEWpMkRGfn';
const tokenContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const toAccountAddress = process.env.PRIVATE_KEY; // Main Wallet For Funds

const listenForTokenTransfers = async () => {
  const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: '7314730a1e40084fdccd5621d4cc37edf49684eeb3307256dd67a17c37eb1b59',
  });

  const tokenContract = await tronWeb.contract().at(tokenContractAddress);

 
//   console.log('here'   )
  tokenContract
    .Transfer()
    .watch((error, event) => {
      if (error) {
        console.error("Error watching Transfer event:", error);
        return;
      }
    //   console.log("Event Object:", event);

      // Extract values based on event object structure
      
      const from = event.result.from;
      const to = event.result.to;
      const value =event.result.value;
      
      console.log("Token Transfer Received:");
      console.log("From:", from);
      console.log("To:", to);
      console.log("Value:", value);

// console.log(' now here now')

      // Transfer Tokens to Another Account
    //   tokenContract
    //     .transfer(toAccountAddress, value.toString())
    //     .send({ shouldPollResponse: true })
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((error) => {
    //       console.error("Error transferring tokens:", error);
    //     });
    })
    .catch((error) => {
      console.error("Error setting up event listener:", error);
    });
};

listenForTokenTransfers().catch((error) => {
  console.error("Error in listenForTokenTransfers:", error);
});
