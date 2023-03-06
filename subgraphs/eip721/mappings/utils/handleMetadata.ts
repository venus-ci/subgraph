import { TokenMetadata } from "../../generated/schema";
import { Bytes, dataSource, json, log } from "@graphprotocol/graph-ts";

export function handleMetadata(content: Bytes): void {
  let tokenMetadata = new TokenMetadata(dataSource.stringParam());
  const valueJson = json.try_fromBytes(content);
  if (valueJson.isOk) {
    const value = valueJson.value.toObject();

    if (value) {
      const image = value.get("image");
      const name = value.get("name");
      const description = value.get("description");
      const externalURL = value.get("external_url");

      if (name) {
        tokenMetadata.name = name.toString();
      }
      if (image) {
        tokenMetadata.image = image.toString();
      }
      if (externalURL) {
        tokenMetadata.externalURL = externalURL.toString();
      }
      if (description) {
        tokenMetadata.description = description.toString();
      }
      tokenMetadata.save();
      log.debug("in handleMetadata success fetch from ipfs {}...", [tokenMetadata.id]);
    }
  }
}
