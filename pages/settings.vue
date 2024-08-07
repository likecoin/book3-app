<template>
  <div class="flex flex-col items-stretch flex-grow">
    <header
      class="flex justify-start gap-4 px-10 py-4 border-b border-gray-200 dark:border-gray-800"
    >
      <h1 class="font-bold text-xl">Settings</h1>
    </header>

    <main class="px-10 py-4">
      <pre>{{ result?.data }}</pre>
    </main>
  </div>
</template>

<script setup lang="ts">
const result = await useFetch("/api/users/settings");
</script>
