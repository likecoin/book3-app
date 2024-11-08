import Dexie, { type EntityTable } from "dexie";

import type { Book } from "../types";

class Book3AppDatabase extends Dexie {
  books!: EntityTable<Book, "id">;
  bookCovers!: EntityTable<{ id: string; url: string }, "id">;
  bookFiles!: EntityTable<{ id: string; file: File }, "id">;

  constructor() {
    super("Book3AppDatabase");

    this.version(1).stores({
      books: "id, name, size, metadata, createAt",
      bookCovers: "id, url",
      bookFiles: "id, file",
    });
  }
}

export default defineNuxtPlugin(() => {
  const db = new Book3AppDatabase();
  return {
    provide: { db },
  };
});
