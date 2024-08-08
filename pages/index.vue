<template>
  <div class="flex flex-col items-stretch flex-grow">
    <PageHeader title="Books">
      <template #trailing>
        <UButton class="relative">
          <input
            type="file"
            accept="application/epub+zip,application/epub,application/zip"
            className="absolute inset-0 cursor-pointer opacity-0"
            @change="openFiles"
          >
          Open EPUB
        </UButton> 
      </template>
    </PageHeader>

    <UContainer
      as="main"
      :ui="{ base: 'w-full', padding: 'py-6', constrained: '' }"
    >
      <ul class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-stretch items-stretch">
        <li v-for="book in books" :key="book.name">
          <UCard :ui="{ body: { base: 'space-y-4' } }">
            <img
              v-if="bookCovers.has(book.id)"
              :src="bookCovers.get(book.id)"
              class="object-cover rounded-md"
              alt="Cover"
            >

            <div class="space-y-2">
              <div>{{ book.metadata.title }}</div>
              <div class="text-xs text-stone-400 text-ellipsis">{{ book.name }}</div>
              <UButton label="Read" block @click="openBook(book)" />
            </div>
          </UCard>
        </li>
      </ul>
    </UContainer>

    <UModal v-model="isReaderOpen" :fullscreen="true">
      <PageHeader
        class="sticky top-0"
        :title="bookName || 'Reader'"
        :is-show-menu-toggle="false"
      >
        <template #trailing>
          <UButton
            class="relative"
            icon="i-heroicons-x-mark"
            variant="ghost"
            @click="isReaderOpen = false"
          />
        </template>
      </PageHeader>
      <div class="relative flex-grow">
        <div
          ref="renditionEl"
          class="w-full h-full mx-auto font-serif"
        />

        <div
          :class="[
            'absolute',
            'inset-0',
            'flex',
            'justify-between',
            'items-center',
            'lg:p-2',
            'pointer-events-none',
            'opacity-0 lg:opacity-100',
          ]"
        >
          <UButton
            class="pointer-events-auto"
            icon="i-heroicons-chevron-left"
            variant="soft"
            size="sm"
            :ui="{ base: 'h-full lg:h-auto' }"
            @click="prevPage"
          />
          <UButton
            class="pointer-events-auto"
            icon="i-heroicons-chevron-right"
            variant="soft"
            size="sm"
            :ui="{ base: 'h-full lg:h-auto' }"
            @click="nextPage"
          />
        </div>
      </div>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import { v4 as uuidV4 } from "uuid";
import ePub, { type Rendition, type NavItem } from "epubjs";
import type { PackagingMetadataObject } from "epubjs/types/packaging";

const isReaderOpen = ref(false);
const bookName = ref("");

const renditionEl = ref<HTMLElement | null>(null);

interface Book {
  id: string;
  name: string;
  size: number;
  metadata: PackagingMetadataObject;
  createdAt: number;
}

const books = ref<Book[]>([]);
const bookFiles = ref(new Map());
const bookCovers = ref(new Map());

const rendition = ref<Rendition>();
const navItems = ref<NavItem[]>([]);

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

async function openBook(book: Book) {
  const file = bookFiles.value.get(book.id);
  const epub = ePub(file);
  isReaderOpen.value = true;
  bookName.value = book.metadata.title;

  await nextTick();

  if (renditionEl.value) {
    navItems.value = [];
    rendition.value?.destroy();
    rendition.value = epub.renderTo(renditionEl.value, {
      width: "100%",
      height: "100%",
    });
    rendition.value.themes.default({
      body: {
        color: "#333",
      },
    });
    rendition.value.display();
  }

  const nav = await epub.loaded.navigation;
  navItems.value = nav.toc;
}

function nextPage() {
  rendition.value?.next();
}

function prevPage() {
  rendition.value?.prev();
}
</script>
