
<script setup lang="ts">

</script>
<template>
  <header>
    <div class="flex flex-row p-2">
      <nav class="text-white flex flex-row gap-8 text-[13px] px-2">
        <RouterLink to="/" class="text-green-500">File</RouterLink>
        <RouterLink to="/about">View</RouterLink>
        <RouterLink to="/about">Add</RouterLink>
        <RouterLink to="/about">Tools</RouterLink>
        <RouterLink to="/about">Help</RouterLink>
      </nav>
    </div>

    <div class="flex flex-row w-full shadow-xl px-3 pb-2">
      
      <div class="flex flex-row w-[280px] rounded-3xl bg-neutral-800 py-1 px-4 items-center">
        <font-awesome-icon icon="fa-magnifying-glass" />
        <input type="text" class="ml-2" placeholder="Search for ...">
      </div>

      <div class="flex flex-col w-[280px] py-1 px-4">
        <div class="flex">
          <div class="flex gap-4 pr-5" style="border-right: 2px solid rgb(60, 60, 60);">
            <font-awesome-icon :icon="['fas', 'location-dot']" />
            <font-awesome-icon :icon="['fas', 'road']" />
          </div>

          <div class="flex-initial pl-5">
            <font-awesome-icon :icon="['fas', 'ruler-horizontal']" />
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>
@import '@/style.css';
</style>