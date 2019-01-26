// GenerateUsername finds a unique username from a person's first and last name
function GenerateUsername(firstName, lastName, num=0) {

    // initialize hex
    var username = firstName.toLowerCase() + "-" + lastName.toLowerCase();
    if (num > 0) {
        username = username + num.toString();
    }

    UsernameExists(username).then(exists => {
        if (exists) {
            return GenerateUsername(firstName, lastName, num=num+1);
        }
        else {
            return username
        }
    })

}

// takes from, to, privateKey, amtSatoshi
// outputs txHash or error
function BuildBitcoinTransaction(from, to, privateKey, amtBTC) {
    return new Promise((resolve, reject) => {

      GetBalance(from).then((balanceSatoshi) => {

          if (amtBTC < balanceSatoshi*0.00000001) {
              bitcoinTransaction.sendTransaction({
                  from: from,
                  to: to,
                  privKeyWIF: privateKey,
                  // TODO: figure out better way of converting to BTC
                  btc: amtBTC,
                  fee: 'hour',
                  dryrun: true,
                  network: "mainnet",
                  // feesProvider: bitcoinTransaction.providers.fees.mainnet.earn,
                  // utxoProvider: bitcoinTransaction.providers.utxo.mainnet.blockchain,
              }).then(txHex => {
                  const tx = bitcoin.Transaction.fromHex(txhex);
                  const txid = tx.getId();
                  resolve({
                    txid: txid,
                    txhex: txhex,
                  });
              }).catch(error => {
                  reject(error);
              });
          } else {
              reject('Error: not enough btc.');
          }
      }).catch(error => {
          reject(error);
      });
  })
}
