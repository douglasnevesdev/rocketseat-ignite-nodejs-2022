import { container } from "tsyringe";

import { IStorageProvider } from './IStorageProvider';

import { S3StorageProvider } from "./implementations/S3StorageProvider";
import { LocalStorageProvider } from "./implementations/LocalStorageProvider";


const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider
}

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  diskStorage[process.env.disk]
);
