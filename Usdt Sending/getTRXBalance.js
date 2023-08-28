const TronWeb = require('tronweb');

// Create a new instance of TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io', // or any other TRON full node API URL
});

// Address to check the balance for
const address = 'TVREhnec6Xf4dwVcoe7HBVXN1qNTn9rmUm';

async function getTRXBalance() {
  try {
    // Get the account balance using the tronWeb instance
    const balance = await tronWeb.trx.getBalance(address);

    // Convert from sun (smallest TRX unit) to TRX
    const trxBalance = tronWeb.fromSun(balance);

    console.log('TRX Balance:', trxBalance);
  } catch (error) {
    console.error('Error fetching TRX balance:', error);
  }
}

getTRXBalance();
g