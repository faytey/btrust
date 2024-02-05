function decodeTransaction(rawTx) {
  // Version
  let version = rawTx.substring(0, 8);
  let marker = parseInt(rawTx.substring(8, 10));
  let flag = parseInt(rawTx.substring(10, 12));
  let offset = 12;
  let input_count = parseInt(rawTx.substring(offset, offset + 2));
  offset += 2;

  // Inputs
  const inputs_arr = [];
  for (let i = 0; i < input_count; i++) {
    // offset += 14 + (i * 82);
    const input = rawTx.substring(offset, offset + 82).toString("hex");
    offset += 82;
    inputs_arr.push(input);
  }

  let output = rawTx.substring(offset, offset + 152);
  let output_count = parseInt(rawTx.substring(offset, offset + 2), 16);
  offset += 2;

  // Outputs
  const Output_arr = [];
  for (let i = 0; i < output_count; i++) {
    let output_amt = rawTx.substring(offset, offset + 16);
    offset += 16;
    let output_length = parseInt(rawTx.substring(offset, offset + 2), 16);
    offset += 2;
    let output_script = rawTx.substring(offset, offset + output_length * 2);
    offset += output_length * 2;
    Output_arr.push({
      output_amt,
      output_script,
    });
  }

  let witness_count = parseInt(rawTx.substring(offset, offset + 2), 16);
  offset += 2;
  let witness_size = parseInt(rawTx.substring(offset, offset + 2), 16);
  offset += 2;
  const witness_arr = [];
  for (let i = 0; i < witness_count; i++) {
    let witness = rawTx.substring(offset, offset + witness_size * 2);
    offset += witness_size * 2;
    witness_arr.push(witness);
  }

  // Lock Time
  let lockTime = parseInt(rawTx.substring(offset, offset + 4), 16);

  console.log("version:", version);
  console.log("marker:", marker);
  console.log("flag:", flag);
  console.log("input_count:", input_count);
  console.log("inputs: ", inputs_arr);
  console.log("output_count:", output_count);
  console.log("Output_arr: ", Output_arr);
  console.log("witness count", witness_count);
  console.log("witness_arr", witness_arr);
  console.log("lockTime:", lockTime);

  return {
    version,
    marker,
    flag,
    input_count,
    inputs_arr,
    output_count,
    Output_arr,
    witness_count,
    witness_arr,
    lockTime,
  };
}

// decodeTransaction(rawTx);
function testDecodeTransaction() {
  const rawTx =
    "020000000001010ccc140e766b5dbc884ea2d780c5e91e4eb77597ae64288a42575228b79e234900000000000000000002bd37060000000000225120245091249f4f29d30820e5f36e1e5d477dc3386144220bd6f35839e94de4b9cae81c00000000000016001416d31d7632aa17b3b316b813c0a3177f5b6150200140838a1f0f1ee607b54abf0a3f55792f6f8d09c3eb7a9fa46cd4976f2137ca2e3f4a901e314e1b827c3332d7e1865ffe1d7ff5f5d7576a9000f354487a09de44cd00000000";

  // Call your decodeTransaction function
  const decoded = decodeTransaction(rawTx);

  // Assert that the decode function works as expected;
  console.assert(
    decoded.version === "02000000",
    `Expected version to be 2, but got ${decoded.version}`
  );
  console.assert(
    decoded.marker === 0,
    `Expected marker to be 0, but got ${decoded.marker}`
  );
  console.assert(
    decoded.flag === 1,
    `Expected flag to be 0, but got ${decoded.flag}`
  );
  console.assert(
    decoded.input_count === 1,
    `Expected num_inputs to be 1, but got ${decoded.input_count}`
  );
  console.assert(
    decoded.inputs_arr.length === decoded.input_count,
    `Expected ${decoded.input_count} inputs, but got ${decoded.inputs_arr.length}`
  );
  console.assert(
    decoded.output_count === 2,
    `Expected num_outputs to be 2, but got ${decoded.output_count}`
  );
  console.assert(
    decoded.Output_arr.length === decoded.output_count,
    `Expected ${decoded.output_count} outputs, but got ${decoded.Output_arr.length}`
  );
  console.assert(
    decoded.witness_count === 1,
    `Expected witness_count to be 1, but got ${decoded.witness_count}`
  );
  console.assert(
    decoded.witness_arr.length === decoded.witness_count,
    `Expected ${decoded.witness_count} witnesses, but got ${decoded.witness_arr.length}`
  );
  console.assert(
    decoded.lockTime === 0,
    `Expected locktime to be 00000000, but got ${decoded.lockTime}`
  );
  console.log("All tests passed!");
}

// Execute the test function
testDecodeTransaction();
