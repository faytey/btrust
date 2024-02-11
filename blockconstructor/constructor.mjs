import { readFileSync } from "fs";

// Function to read mempool CSV file and parse transactions
function readMempoolCSV(filePath) {
  const mempool = {};
  const fileContent = readFileSync(filePath, "utf-8");
  const lines = fileContent.trim().split("\n");
  for (const line of lines) {
    const [txid, fee, weight, parentTxids] = line.split(",");
    const parents = parentTxids ? parentTxids.split(";") : [];
    mempool[txid] = { fee: parseInt(fee), weight: parseInt(weight), parents };
  }
  return mempool;
}

// Function to construct the block
function constructBlock(mempool) {
  const blockWeightLimit = 4000000;
  let blockWeight = 0;
  const blockTransactions = [];

  // Function to check if transaction can be included in block
  function canInclude(txid) {
    if (blockTransactions.includes(txid)) {
      return false;
    }
    for (const parentTxid of mempool[txid].parents) {
      if (!blockTransactions.includes(parentTxid)) {
        return false;
      }
    }
    return true;
  }

  // Select transactions for the block
  const sortedTxids = Object.keys(mempool).sort(
    (a, b) => mempool[b].fee - mempool[a].fee
  );
  for (const txid of sortedTxids) {
    if (
      blockWeight + mempool[txid].weight <= blockWeightLimit &&
      canInclude(txid)
    ) {
      blockTransactions.push(txid);
      blockWeight += mempool[txid].weight;
    }
  }

  return blockTransactions;
}

// Main function
function main() {
  const mempoolFilePath = "./mempool.csv";
  const mempool = readMempoolCSV(mempoolFilePath);
  const blockTransactions = constructBlock(mempool);
  console.log(blockTransactions.join("\n"));
}

main();
