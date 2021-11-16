<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <nav class="flex-auto ">
      <router-link to="billing" class="p-4">Billing</router-link>
      <router-link to="tech-support">Tech Support</router-link>
    </nav>

    <router-view />
    <Footer />
    <div class="mt-5 mx-auto text-center opacity-25 text-sm">
      [Default Layout]
    </div>
  </main>
</template>
