const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
// const fullNode = new HttpProvider("http://192.168.1.162:8090");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "";              //user pvt keys
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);


const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

const receipientAddress = "";                     //user wallet address
const sendingAmount = '<amount>' * (10 **6)           //replace '<amount>' with the actual amount which users wants to send 
async function main() {
    const {
        abi
    } = await tronWeb.trx.getContract(CONTRACT);
    // console.log(JSON.stringify(abi));

    const contract = tronWeb.contract(abi.entrys, CONTRACT);

    const resp = await contract.methods.transfer(receipientAddress, sendingAmount).send();
    console.log("transfer:", resp);
}

main().then(() => {
        console.log("ok");
    })
    .catch((err) => {
        console.log("error:", err);
    });
