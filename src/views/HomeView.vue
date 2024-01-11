<script setup lang="ts">
import Map from '@/components/Map.vue';
import LeftSideBar from '../components/LeftSideBar.vue'
import NavBar from '../components/NavBar.vue';
</script>

<template>
  
  <NavBar/>
  <main class="flex">

    <LeftSideBar/>

    <div class="felx flex-row w-full bg-black">
      <Map/>
    </div>
  </main>
</template>

<style scoped>
@import '@/style.css';
</style>
