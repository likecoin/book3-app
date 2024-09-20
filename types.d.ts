import type { PackagingMetadataObject } from "epubjs/types/packaging";

export interface Book {
  id: string;
  name: string;
  size: number;
  metadata: PackagingMetadataObject;
  createdAt: number;
}
