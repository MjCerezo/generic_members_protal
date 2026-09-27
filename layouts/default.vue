<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Global Header -->
    <header class="bg-white px-4 md:px-10 py-4 md:py-6 flex justify-between items-center border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div class="flex items-center gap-4">
        <img :src="$config.public.clientLogo" :alt="`${$config.public.clientName} Logo`" class="h-8 md:h-12 w-auto object-contain" />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="p-8 text-center bg-slate-50 border-t border-slate-100">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
        &copy; 2026 {{ $config.public.clientName }}. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
// Default layout logic
</script>
