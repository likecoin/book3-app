<template>
  <div class="flex flex-col items-stretch flex-grow">
    <AppPageHeader :title="$t('books_page_header_title')">
      <template #trailing>
        <UButton class="relative">
          <input
            type="file"
            accept="application/epub+zip,application/epub,application/zip"
            className="absolute inset-0 cursor-pointer opacity-0"
            @change="openFiles"
          />
          {{ $t("books_page_header_open_epub_button_label") }}
        </UButton>
      </template>
    </AppPageHeader>

    <AppPageBody>
      <ul
        class="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 justify-stretch items-stretch"
      >
        <li v-for="book in books" :key="book.name">
          <UCard :ui="{ body: { base: 'space-y-4' } }">
            <img
              v-if="bookCovers.has(book.id)"
              :src="bookCovers.get(book.id)"
              class="object-cover rounded-md"
              alt="Cover"
            />

            <div class="space-y-2">
              <div>{{ book.metadata.title }}</div>
              <div class="text-xs text-stone-400 text-ellipsis">
                {{ book.name }}
              </div>
              <UButton
                :label="$t('books_page_item_read_button_label')"
                block
                @click="openBook(book)"
              />
            </div>
          </UCard>
        </li>
      </ul>
    </AppPageBody>

    <BookReader :book="openedBook" :file="openedBookFile" @close="closeBook" />
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidV4 } from "uuid";
import ePub from "epubjs";

import type { Book } from "~/types";

const books = ref<Book[]>([]);
const bookFiles = ref(new Map<string, File>());
const bookCovers = ref(new Map<string, string>());

const openedBook = ref<Book | null>(null);
const openedBookFile = ref<File | null>(null);

function readBlob(callback: (reader: FileReader) => void) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });
    callback(reader);
  });
}

async function toDataUrl(url: string) {
  const res = await fetch(url);
  const buffer = await res.blob();
  return readBlob((r) => r.readAsDataURL(buffer));
}

async function openFiles(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  for (const file of files) {
    if (!["application/epub+zip", "application/epub"].includes(file.type)) {
      console.error(`Unsupported file type: ${file.type}`);
      continue;
    }

    // Convert file to ePub
    const data = await file.arrayBuffer();
    const epub = ePub(data);

    const metadata = await epub.loaded.metadata;

    const id = uuidV4();
    books.value.push({
      id,
      name: file.name || `${metadata.title}.epub`,
      size: file.size,
      metadata,
      createdAt: Date.now(),
    });

    bookFiles.value.set(id, file);

    const coverURL = await epub.coverUrl();
    if (coverURL) {
      bookCovers.value.set(id, await toDataUrl(coverURL));
    }
  }
}

function openBook(book: Book) {
  const file = bookFiles.value.get(book.id);
  if (file) {
    openedBook.value = book;
    openedBookFile.value = file;
  }
}

function closeBook() {
  openedBook.value = null;
  openedBookFile.value = null;
}
</script>
