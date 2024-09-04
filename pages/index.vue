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

    <UModal v-model="isReaderOpen" :fullscreen="true">
      <AppPageHeader
        class="sticky top-0 lg:grid grid-cols-3 items-center"
        :is-show-menu-toggle="false"
      >
        <template #leading>
          <USelect
            v-model="activeNavItemHref"
            icon="i-heroicons-list-bullet"
            :options="navItemOptions"
            placeholder="Table of Contents"
          />
        </template>

        <h1 class="max-lg:hidden text-sm text-center">
          {{ bookName || $t("reader_view_header_title_default") }}
        </h1>

        <template #trailing>
          <div class="relative flex justify-end gap-2">
            <UPopover>
              <UButton icon="i-heroicons-language" variant="ghost" />

              <template #panel>
                <div class="flex gap-2 items-center p-2">
                  <UButton
                    icon="i-heroicons-minus"
                    variant="ghost"
                    @click="decreaseFontSize"
                  />
                  <USelect v-model="fontSize" :options="fontSizeOptions" />
                  <UButton
                    icon="i-heroicons-plus"
                    variant="ghost"
                    @click="increaseFontSize"
                  />
                </div>
              </template>
            </UPopover>
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              @click="isReaderOpen = false"
            />
          </div>
        </template>
      </AppPageHeader>

      <div class="relative flex-grow bg-white">
        <div ref="renditionEl" class="absolute inset-0 lg:inset-6" />

        <div
          :class="[
            'absolute',
            'inset-0',
            'hidden lg:flex',
            'justify-between',
            'items-center',
            'p-2',
            'pointer-events-none',
          ]"
        >
          <UButton
            class="pointer-events-auto"
            icon="i-heroicons-chevron-left"
            variant="soft"
            size="sm"
            :ui="{ base: 'max-lg:w-6 max-lg:h-full' }"
            @click="prevPage"
          />
          <UButton
            class="pointer-events-auto"
            icon="i-heroicons-chevron-right"
            variant="soft"
            size="sm"
            :ui="{ base: 'max-lg:w-6 max-lg:h-full' }"
            @click="nextPage"
          />
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidV4 } from "uuid";
import ePub, {
  type Rendition as RenditionBase,
  type NavItem,
  type Location,
} from "epubjs";
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

interface Rendition extends RenditionBase {
  manager?: {
    container: HTMLElement;
  };
}

const books = ref<Book[]>([]);
const bookFiles = ref(new Map());
const bookCovers = ref(new Map());

const rendition = ref<Rendition>();
const navItems = ref<NavItem[]>([]);
const navItemOptions = computed(() =>
  navItems.value.map((item) => ({
    label: item.label,
    value: item.href,
  })),
);

const activeNavItemHref = ref<string | undefined>();
watch(activeNavItemHref, (href) => {
  if (href) {
    rendition.value?.display(href);
  }
});

const fontSizeOptions = [
  6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72,
];
const fontSize = ref(fontSizeOptions[9]);
watch(fontSize, (size) => {
  rendition.value?.themes.fontSize(`${size}px`);
});

let cleanUpClickListener: (() => void) | undefined;

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
      allowScriptedContent: true,
    });
    rendition.value.themes.default({
      body: {
        color: "#333",
      },
    });
    rendition.value.themes.fontSize(`${fontSize.value}px`);
    rendition.value.display();

    rendition.value.on("rendered", (_: never, view: { window: Window }) => {
      if (cleanUpClickListener) {
        cleanUpClickListener();
      }
      cleanUpClickListener = useEventListener(view.window, "click", (event) => {
        for (const element of event.composedPath() as HTMLElement[]) {
          // NOTE: Ignore clicks on links
          if (element.tagName === "A") {
            return;
          }
        }

        if ("ontouchstart" in window && view.window) {
          const width = rendition.value?.manager?.container.clientWidth || 0;
          const range = width * (1 / 3);
          const x = event.clientX % width; // Normalize x to be within the window
          if (x < range) {
            prevPage();
          } else if (width - x < range) {
            nextPage();
          }
        }
      });
    });

    rendition.value.on("relocated", (location: Location) => {
      const href = location.start.href;
      if (navItems.value.some((item) => item.href === href)) {
        activeNavItemHref.value = href;
      }
    });
  }

  const nav = await epub.loaded.navigation;
  navItems.value = nav.toc.flatMap((item) => {
    if (item.subitems) {
      return [item, ...item.subitems];
    }
    return item;
  });
  activeNavItemHref.value = nav.toc[0]?.href;
}

function nextPage() {
  rendition.value?.next();
}

function prevPage() {
  rendition.value?.prev();
}

function adjustFontSize(size: number) {
  const index = fontSizeOptions.indexOf(fontSize.value);
  fontSize.value = fontSizeOptions[index + size] || fontSize.value;
}

function increaseFontSize() {
  adjustFontSize(+1);
}

function decreaseFontSize() {
  adjustFontSize(-1);
}

useEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      nextPage();
      break;

    case "ArrowLeft":
    case "ArrowUp":
      prevPage();
      break;

    case "Space":
      if (event.shiftKey) {
        prevPage();
      } else {
        nextPage();
      }
      break;

    default:
      break;
  }
});
</script>
