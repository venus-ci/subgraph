import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/EIP721/EIP721";

export function createTransferEvent(from: Address, to: Address, tokenId: BigInt): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent());

  transferEvent.parameters = new Array();

  transferEvent.address = Address.fromString("0xf3a8159a867991e2aa2db6867cf1232253a1592f");
  transferEvent.parameters.push(new ethereum.EventParam("from", ethereum.Value.fromAddress(from)));
  transferEvent.parameters.push(new ethereum.EventParam("to", ethereum.Value.fromAddress(to)));
  transferEvent.parameters.push(new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(tokenId)));

  transferEvent.parameters.push(new ethereum.EventParam("from", ethereum.Value.fromAddress(from)));

  return transferEvent;
}
