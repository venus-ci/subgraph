import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { Blockchain, Collection, Owner, Token, Transaction } from "../generated/schema";
import { TransferBatch, TransferSingle, URI } from "../generated/EIP1155/EIP1155";
import { toBigDecimal } from "../../../helpers/utils";
import { fetchName, fetchSymbol, fetchURI } from "./utils/eip1155";

export function handleTransferBatch(event: TransferBatch): void {
  let blockchain = Blockchain.load("ETH");
  if (blockchain === null) {
    // Blockchain
    blockchain = new Blockchain("ETH");
    blockchain.totalCollections = BigInt.zero();
    blockchain.totalTokens = BigInt.zero();
    blockchain.totalTransactions = BigInt.zero();
    blockchain.save();
  }
  blockchain.totalTransactions = blockchain.totalTransactions.plus(BigInt.fromI32(1));
  blockchain.save();

  let from = Owner.load(event.params._from.toHex());
  if (from === null) {
    // Owner - as Sender
    from = new Owner(event.params._from.toHex());
    from.totalTokens = BigInt.zero();
    from.totalTokensMinted = BigInt.zero();
    from.totalTransactions = BigInt.zero();
    from.block = event.block.number;
    from.createdAt = event.block.timestamp;
    from.updatedAt = event.block.timestamp;
    from.save();
  }
  from.totalTokens = event.params._from.equals(Address.zero())
    ? from.totalTokens
    : from.totalTokens.minus(BigInt.fromI32(1));
  from.totalTransactions = from.totalTransactions.plus(BigInt.fromI32(1));
  from.updatedAt = event.block.timestamp;
  from.save();

  let to = Owner.load(event.params._to.toHex());
  if (to === null) {
    // Owner - as Receiver
    to = new Owner(event.params._to.toHex());
    to.totalTokens = BigInt.zero();
    to.totalTokensMinted = BigInt.zero();
    to.totalTransactions = BigInt.zero();
    to.block = event.block.number;
    to.createdAt = event.block.timestamp;
    to.updatedAt = event.block.timestamp;
    to.save();
  }
  to.totalTokens = to.totalTokens.plus(BigInt.fromI32(1));
  to.totalTransactions = to.totalTransactions.plus(BigInt.fromI32(1));
  to.updatedAt = event.block.timestamp;
  to.save();

  let collection = Collection.load(event.address.toHex());
  if (collection === null) {
    // Collection
    collection = new Collection(event.address.toHex());
    collection.name = fetchName(event.address);
    collection.symbol = fetchSymbol(event.address);
    collection.totalTokens = BigInt.zero();
    collection.totalTransactions = BigInt.zero();
    collection.block = event.block.number;
    collection.createdAt = event.block.timestamp;
    collection.updatedAt = event.block.timestamp;
    collection.owner = to.id;
    collection.blockNumLog = event.block.number
      .toBigDecimal()
      .plus(BigDecimal.fromString(event.logIndex.toString()).div(BigDecimal.fromString("1000000000")));

    collection.save();

    // Blockchain
    blockchain.totalCollections = blockchain.totalCollections.plus(BigInt.fromI32(1));
    blockchain.save();
  }
  collection.totalTransactions = collection.totalTransactions.plus(BigInt.fromI32(1));
  collection.updatedAt = event.block.timestamp;
  collection.blockNumLog = event.block.number
    .toBigDecimal()
    .plus(BigDecimal.fromString(event.logIndex.toString()).div(BigDecimal.fromString("1000000000")));
  collection.save();

  const ids = event.params._ids;
  for (let i = 0; i < ids.length; i++) {
    let token = Token.load(event.address.toHex() + "-" + ids[i].toString());
    if (token === null) {
      // Token
      token = new Token(event.address.toHex() + "-" + ids[i].toString());
      token.collection = collection.id;
      token.tokenID = ids[i];
      token.minter = to.id;
      token.owner = to.id;
      token.burned = false;
      token.tokenURI = fetchURI(event.address, ids[i]);
      token.totalTransactions = BigInt.zero();
      token.block = event.block.number;
      token.createdAt = event.block.timestamp;
      token.updatedAt = event.block.timestamp;
      token.blockNumLog = event.block.number
        .toBigDecimal()
        .plus(BigDecimal.fromString(event.logIndex.toString()).div(BigDecimal.fromString("1000000000")));

      token.save();

      // Owner - as Receiver
      to.totalTokensMinted = to.totalTokensMinted.plus(BigInt.fromI32(1));
      to.save();

      // Collection
      collection.totalTokens = collection.totalTokens.plus(BigInt.fromI32(1));
      collection.save();

      // Blockchain
      blockchain.totalTokens = blockchain.totalTokens.plus(BigInt.fromI32(1));
      blockchain.save();
    }
    token.owner = to.id;
    token.burned = event.params._to.equals(Address.zero());
    token.totalTransactions = token.totalTransactions.plus(BigInt.fromI32(1));
    token.blockNumLog = event.block.number
      .toBigDecimal()
      .plus(BigDecimal.fromString(event.logIndex.toString()).div(BigDecimal.fromString("1000000000")));

    token.updatedAt = event.block.timestamp;
    token.save();

    // Transaction
    const transaction = new Transaction(event.transaction.hash.toHex() + "-" + ids[i].toString());
    transaction.hash = event.transaction.hash;
    transaction.from = from.id;
    transaction.to = to.id;
    transaction.collection = collection.id;
    transaction.token = token.id;
    transaction.type = "Batch";
    transaction.gasLimit = event.transaction.gasLimit;
    transaction.gasPrice = toBigDecimal(event.transaction.gasPrice, 9);
    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.save();
  }
}

export function handleTransferSingle(event: TransferSingle): void {
  let blockchain = Blockchain.load("ETH");
  if (blockchain === null) {
    // Blockchain
    blockchain = new Blockchain("ETH");
    blockchain.totalCollections = BigInt.zero();
    blockchain.totalTokens = BigInt.zero();
    blockchain.totalTransactions = BigInt.zero();
    blockchain.save();
  }
  blockchain.totalTransactions = blockchain.totalTransactions.plus(BigInt.fromI32(1));
  blockchain.save();

  let from = Owner.load(event.params._from.toHex());
  if (from === null) {
    // Owner - as Sender
    from = new Owner(event.params._from.toHex());
    from.totalTokens = BigInt.zero();
    from.totalTokensMinted = BigInt.zero();
    from.totalTransactions = BigInt.zero();
    from.block = event.block.number;
    from.createdAt = event.block.timestamp;
    from.updatedAt = event.block.timestamp;
    from.save();
  }
  from.totalTokens = event.params._from.equals(Address.zero())
    ? from.totalTokens
    : from.totalTokens.minus(BigInt.fromI32(1));
  from.totalTransactions = from.totalTransactions.plus(BigInt.fromI32(1));
  from.updatedAt = event.block.timestamp;
  from.save();

  let to = Owner.load(event.params._to.toHex());
  if (to === null) {
    // Owner - as Receiver
    to = new Owner(event.params._to.toHex());
    to.totalTokens = BigInt.zero();
    to.totalTokensMinted = BigInt.zero();
    to.totalTransactions = BigInt.zero();
    to.block = event.block.number;
    to.createdAt = event.block.timestamp;
    to.updatedAt = event.block.timestamp;
    to.save();
  }
  to.totalTokens = to.totalTokens.plus(BigInt.fromI32(1));
  to.totalTransactions = to.totalTransactions.plus(BigInt.fromI32(1));
  to.updatedAt = event.block.timestamp;
  to.save();

  let collection = Collection.load(event.address.toHex());
  if (collection === null) {
    // Collection
    collection = new Collection(event.address.toHex());
    collection.name = fetchName(event.address);
    collection.symbol = fetchSymbol(event.address);
    collection.totalTokens = BigInt.zero();
    collection.totalTransactions = BigInt.zero();
    collection.block = event.block.number;
    collection.createdAt = event.block.timestamp;
    collection.updatedAt = event.block.timestamp;
    collection.owner = to.id;
    collection.blockNumLog = event.block.number
      .toBigDecimal()
      .plus(BigDecimal.fromString(event.logIndex.toString()).div(BigDecimal.fromString("1000000000")));

    collection.save();

    // Blockchain
    blockchain.totalCollections = blockchain.totalCollections.plus(BigInt.fromI32(1));
    blockchain.save();
  }
  collection.totalTransactions = collection.totalTransactions.plus(BigInt.fromI32(1));
  collection.updatedAt = event.block.timestamp;
  collection.blockNumLog = event.block.number
    .toBigDecimal()
    .plus(BigDecimal.fromString(event.logIndex.toString()).div(BigDecimal.fromString("1000000000")));

  collection.save();

  let token = Token.load(event.address.toHex() + "-" + event.params._id.toString());
  if (token === null) {
    // Token
    token = new Token(event.address.toHex() + "-" + event.params._id.toString());
    token.collection = collection.id;
    token.tokenID = event.params._id;
    token.tokenURI = fetchURI(event.address, event.params._id);
    token.minter = to.id;
    token.owner = to.id;
    token.burned = false;
    token.totalTransactions = BigInt.zero();
    token.block = event.block.number;
    token.createdAt = event.block.timestamp;
    token.updatedAt = event.block.timestamp;
    token.blockNumLog = event.block.number
      .toBigDecimal()
      .plus(BigDecimal.fromString(event.logIndex.toString()).div(BigDecimal.fromString("1000000000")));

    token.save();

    // Owner - as Receiver
    to.totalTokensMinted = to.totalTokensMinted.plus(BigInt.fromI32(1));
    to.save();

    // Collection
    collection.totalTokens = collection.totalTokens.plus(BigInt.fromI32(1));
    collection.save();

    // Blockchain
    blockchain.totalTokens = blockchain.totalTokens.plus(BigInt.fromI32(1));
    blockchain.save();
  }
  token.owner = to.id;
  token.burned = event.params._to.equals(Address.zero());
  token.totalTransactions = token.totalTransactions.plus(BigInt.fromI32(1));
  token.blockNumLog = event.block.number
    .toBigDecimal()
    .plus(BigDecimal.fromString(event.logIndex.toString()).div(BigDecimal.fromString("1000000000")));
  token.updatedAt = event.block.timestamp;
  token.save();

  // Transaction
  const transaction = new Transaction(event.transaction.hash.toHex());
  transaction.hash = event.transaction.hash;
  transaction.from = from.id;
  transaction.to = to.id;
  transaction.collection = collection.id;
  transaction.token = token.id;
  transaction.type = "Single";
  transaction.gasLimit = event.transaction.gasLimit;
  transaction.gasPrice = toBigDecimal(event.transaction.gasPrice, 9);
  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.save();
}

export function handleURI(event: URI): void {
  const token = Token.load(event.address.toHex() + "-" + event.params._id.toString());
  if (token !== null) {
    token.tokenURI = event.params._value;
    token.save();
  } else {
    log.warning("Tried to update tokenURI of a non-existing token --- collection {} - {}", [
      event.address.toHex(),
      event.params._id.toString(),
    ]);
  }
}
