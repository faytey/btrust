const bitcoin = require("bitcoinjs-lib");

// Task 1: Generate redeem script
function generateRedeemScript(preImage) {
  const OP_SHA256 = "0xa8";
  const opEqual = "0x87";
  const lockHex = Buffer.from(preImage, "hex");
  const sha256Op = bitcoin.script.OP_SHA256;
  const equalOp = bitcoin.script.opEqual;
  const redeemScript = bitcoin.script.compile([sha256Op, lockHex, equalOp]);
  return redeemScript.toString("hex");
}

// Task 2: Derive address from redeem script
function deriveAddress(redeemScript) {
  const scriptPubKey = bitcoin.script.scriptHash.output.encode(
    bitcoin.crypto.hash160(Buffer.from(redeemScript, "hex"))
  );
  const address = bitcoin.address.fromOutputScript(scriptPubKey);
  return address;
}

// Task 3: Construct a transaction sending Bitcoins to the address
function constructTransaction(network, fromAddress, toAddress, amount) {
  const keyPair = bitcoin.ECPair.makeRandom({ network });
  const tx = new bitcoin.TransactionBuilder(network);
  tx.addInput(fromAddress, 0); // Assume the first output of fromAddress is being spent
  tx.addOutput(toAddress, amount);
  tx.sign(0, keyPair);
  return tx.build().toHex();
}

// Task 4: Construct a transaction spending from the previous transaction
function constructSpendingTransaction(
  network,
  fromTxHex,
  redeemScript,
  amount,
  toAddress
) {
  const fromTx = bitcoin.Transaction.fromHex(fromTxHex);
  const keyPair = bitcoin.ECPair.makeRandom({ network });
  const tx = new bitcoin.TransactionBuilder(network);

  // Add input from the previous transaction
  tx.addInput(fromTx, 0);

  // Add outputs
  tx.addOutput(toAddress, amount);

  // Sign input with redeem script
  const redeemScriptSig = bitcoin.script.witnessPubKeyHash.output.encode(
    bitcoin.crypto.hash160(redeemScript)
  );
  tx.sign(0, keyPair, redeemScriptSig, null, amount);

  return tx.build().toHex();
}

// Example usage:
const preImage = "427472757374204275696c64657273"; // Hex encoding of "Btrust Builders"
const redeemScript = generateRedeemScript(preImage);
const address = deriveAddress(redeemScript);
console.log("Redeem Script:", redeemScript);
console.log("Derived Address:", address);

// Construct a transaction sending Bitcoins to the address
const network = bitcoin.networks.testnet; // Change to bitcoin.networks.bitcoin for mainnet
const fromAddress = "your_previous_transaction_address"; // Replace with the actual address
const toAddress = address;
const amountToSend = 10000; // Satoshis
const transactionHex = constructTransaction(
  network,
  fromAddress,
  toAddress,
  amountToSend
);
console.log("Transaction Hex:", transactionHex);

// Construct a spending transaction
const spendingAmount = 5000; // Satoshis
const changeAddress = "your_change_address"; // Replace with the actual address
const spendingTransactionHex = constructSpendingTransaction(
  network,
  transactionHex,
  redeemScript,
  spendingAmount,
  changeAddress
);
console.log("Spending Transaction Hex:", spendingTransactionHex);
