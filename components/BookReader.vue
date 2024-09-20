<template>
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
</template>

<script setup lang="ts">
import ePub, {
  type Rendition as RenditionBase,
  type NavItem,
  type Location,
} from "epubjs";

import type { Book } from "~/types";

const props = defineProps<{
  book: Book | null;
  file: File | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

interface Rendition extends RenditionBase {
  manager?: {
    container: HTMLElement;
  };
}

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

const isReaderOpen = computed({
  get: () => !!props.book && !!props.file,
  set: (value) => {
    if (!value) {
      emit("close");
    }
  },
});
const bookName = computed(() => props.book?.metadata.title || "");
const renditionEl = ref<HTMLElement | null>(null);

async function openBook() {
  const book = props.book;
  const file = props.file;
  if (!book || !file) {
    return;
  }

  const data = await file.arrayBuffer();
  const epub = ePub(data);

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

onMounted(openBook);

watch(isReaderOpen, openBook);
</script>
