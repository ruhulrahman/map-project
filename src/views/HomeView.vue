<script setup lang="ts">
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';

import { ref } from 'vue'
const hideLeftSidebar = ref(false)

const toggleLeftSidebar = () => {
  hideLeftSidebar.value = !hideLeftSidebar.value
}


</script>

<template>
  <NavBar />
  <main class="flex relative h-fit">

    <LeftSideBar/>

    <div class="felx flex-row w-full bg-black h-fit">
      <Map />
    </div>
  </main>
</template>

<style scoped>
@import '@/style.css';
</style>
