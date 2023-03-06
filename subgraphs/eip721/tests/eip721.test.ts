import { describe, test, createMockedFunction } from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { createTransferEvent } from "./util";
import { handleTransfer } from "../mappings/index";

describe("Describe entity assertions", () => {
  test("Should create a new Blockchain entity", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000000");
    let to = Address.fromString("0xd78E8ec02505f7261A47Ed1E9B1E91374da5b6Dd");
    let tokenId = BigInt.fromI32(1);
    let newTransferEvent = createTransferEvent(from, to, tokenId);
    createMockedFunction(newTransferEvent.address, "name", "name():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("Some name")]);

    createMockedFunction(newTransferEvent.address, "symbol", "symbol():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("Some symbol")]);

    createMockedFunction(newTransferEvent.address, "tokenURI", "tokenURI(uint256):(string)")
      .withArgs([ethereum.Value.fromUnsignedBigInt(tokenId)])
      .returns([ethereum.Value.fromString("QmWJrqBfg2Nqa6woFufrmuF2aDZUa1hktcQQHcgExmtbAb")]);

    handleTransfer(newTransferEvent);
  });

  test("it should be able to support ipfs prefix", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000000");
    let to = Address.fromString("0xd78E8ec02505f7261A47Ed1E9B1E91374da5b6Dd");
    let tokenId = BigInt.fromI32(1);
    let newTransferEvent = createTransferEvent(from, to, tokenId);
    createMockedFunction(newTransferEvent.address, "name", "name():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("Some name")]);

    createMockedFunction(newTransferEvent.address, "symbol", "symbol():(string)")
      .withArgs([])
      .returns([ethereum.Value.fromString("Some symbol")]);

    createMockedFunction(newTransferEvent.address, "tokenURI", "tokenURI(uint256):(string)")
      .withArgs([ethereum.Value.fromUnsignedBigInt(tokenId)])
      .returns([ethereum.Value.fromString("ipfs://QmQAv4epUqZyfKTMut1RkviZPzj4k9re9FMKhQKFsibqcH/24")]);

    handleTransfer(newTransferEvent);
  });
});
