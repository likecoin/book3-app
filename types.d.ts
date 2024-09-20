import type { PackagingMetadataObject } from "epubjs/types/packaging";

export interface Book {
  id: string;
  name: string;
  size: number;
  metadata: PackagingMetadataObject;
  createdAt: number;
}

export interface EpubView {
  window: Window;
  settings: {
    direction: "ltr" | "rtl";
  };
}
