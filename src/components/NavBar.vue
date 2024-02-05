
<script setup>
import { ref } from 'vue';

const showMenubar = ref(true);

const toggleMenubar = () => {
  showMenubar.value = !showMenubar.value;
}

</script>

<template>
  <header class="z-[7] shadow-down">
    <div v-if="showMenubar" class="flex flex-row px-2 py-1">
      <nav class="text-white flex flex-row gap-8 text-[13px] px-2">
        <RouterLink to="/" class="text-green-500">File</RouterLink>
        <RouterLink to="/about">View</RouterLink>
        <RouterLink to="/about">Add</RouterLink>
        <RouterLink to="/about">Tools</RouterLink>
        <RouterLink to="/about">Help</RouterLink>
      </nav>
    </div>

    <div class="flex flex-row w-full shadow-xl px-3 py-2">

      <div class="flex flex-row w-[280px] rounded-3xl bg-neutral-800 py-1 px-4 items-center">
        <font-awesome-icon icon="fa-magnifying-glass" />
        <input type="text" class="ml-2" placeholder="Search for ...">
      </div>

      <div class="flex flex-col w-full py-1 px-4">
        <div class="flex">
          <div class="flex gap-4 pr-5" style="border-right: 2px solid rgb(60, 60, 60);">
            <button v-tippy="{ content: 'Map Location', placement: 'left', arrow: true, animation: 'fade', }" class="btn border-none bg-[#80808033]"><font-awesome-icon :icon="['fas', 'location-dot']" /></button>
            <button content="Draw Map Line" v-tippy class="btn border-none bg-[#80808033]">
              <font-awesome-icon :icon="['fas', 'draw-polygon']" />
            </button>
          </div>

          <div class="flex-initial pl-5">
            <button v-tippy="'Map Measurement'" class="btn border-none bg-[#80808033]"><font-awesome-icon
                :icon="['fas', 'ruler-horizontal']" /></button>
            <button v-if="showMenubar" @click="toggleMenubar()" v-tippy="'Hide the menubar'" class="btn border-none hover:bg-[#80808033] ml-2 text-cyan-200 hover:text-cyan-400">
              <font-awesome-icon :icon="['fas', 'angle-up']" />
            </button>
            <button @click="toggleMenubar()" v-else v-tippy="{ content: 'Show the menubar', placement: 'right', animation: 'fade', }" class="btn border-none hover:bg-[#80808033] ml-2 text-cyan-200 hover:text-cyan-400">
              <font-awesome-icon  :icon="['fas', 'angle-down']" />
            </button>
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>
@import '@/style.css';
</style>