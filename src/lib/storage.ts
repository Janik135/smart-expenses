import { BlobServiceClient } from "@azure/storage-blob";
import { loadConfig } from "./config";

export function getReceiptsContainer() {
  const { storageConnectionString, receiptsContainer } = loadConfig();
  return BlobServiceClient.fromConnectionString(storageConnectionString).getContainerClient(
    receiptsContainer,
  );
}
