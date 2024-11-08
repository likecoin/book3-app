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

    <AppPageBody
      :class="['flex', { 'justify-center': sortedBooks.length > 5 }]"
    >
      <ul
        :class="[
          'grid',

          'grid-cols-2',
          'md:grid-cols-3',
          'xl:grid-cols-4',
          '2xl:grid-cols-5',

          'gap-4',
          'justify-stretch',
          'items-stretch',

          'w-full',
          'max-w-screen-xl',
        ]"
      >
        <li v-for="book in sortedBooks" :key="book.name">
          <UCard
            class="group"
            :ui="{
              body: { padding: 'sm:px-4' },
              footer: { base: 'flex items-center gap-2', padding: 'sm:px-4' },
            }"
          >
            <div
              :class="[
                'flex',
                'items-center',
                'justify-center',

                'h-[120px] md:h-[200px]',

                'cursor-pointer',
              ]"
              @click="openBook(book)"
            >
              <img
                v-if="bookCovers.has(book.id)"
                :class="[
                  'max-h-full',

                  'object-contain',

                  'rounded-md',
                  'shadow-xl',
                  'group-hover:scale-105',
                  'transition-transform',
                ]"
                :src="bookCovers.get(book.id)"
                alt="Cover"
              />
            </div>

            <div
              class="mt-4 text-center truncate"
              :title="book.metadata.title"
              v-text="book.metadata.title"
            />
            <div
              class="mt-1 text-xs text-stone-400 text-center truncate"
              :title="book.name"
              v-text="book.name"
            />

            <template #footer>
              <UButton
                :label="$t('books_page_item_read_button_label')"
                variant="outline"
                icon="i-heroicons-book-open"
                block
                :ui="{ block: 'w-auto grow' }"
                @click="openBook(book)"
              />

              <UButton
                icon="i-heroicons-trash"
                variant="outline"
                @click="deleteBook(book)"
              />
            </template>
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

const { $db } = useNuxtApp();
const i18n = useI18n();

const books = ref<Book[]>([]);
const bookFiles = ref(new Map<string, File>());
const bookCovers = ref(new Map<string, string>());

const sortedBooks = computed(() => [...books.value].reverse());

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

    const book: Book = {
      id,
      name: file.name || `${metadata.title}.epub`,
      size: file.size,
      metadata,
      createdAt: Date.now(),
    };
    books.value.push(book);
    bookFiles.value.set(id, file);

    await Promise.all([
      $db.books.add(book),
      $db.bookFiles.add({ id, file: file }),
      epub.coverUrl().then(async (url) => {
        if (url) {
          const dataURL = await toDataUrl(url);
          bookCovers.value.set(id, dataURL);
          return $db.bookCovers.add({ id, url: dataURL });
        }
        return undefined;
      }),
    ]);
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

async function deleteBook(book: Book) {
  if (!window.confirm(i18n.t("books_page_item_delete_confirm_message"))) {
    return;
  }

  books.value = books.value.filter((b) => b.id !== book.id);
  bookFiles.value.delete(book.id);
  bookCovers.value.delete(book.id);
  await Promise.all([
    $db.books.delete(book.id),
    $db.bookFiles.delete(book.id),
    $db.bookCovers.delete(book.id),
  ]);
}

async function restoreBooksFromDb() {
  try {
    const dbResults = await Promise.all([
      $db.books.toArray(),
      $db.bookFiles.toArray(),
      $db.bookCovers.toArray(),
    ]);
    books.value = dbResults[0];
    dbResults[1].forEach((bookFile) => {
      bookFiles.value.set(bookFile.id, bookFile.file);
    });
    dbResults[2].forEach((bookCover) => {
      bookCovers.value.set(bookCover.id, bookCover.url);
    });
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await restoreBooksFromDb();
});
</script>
