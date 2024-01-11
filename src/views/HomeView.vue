<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import LeftSideBar from '../components/LeftSideBar.vue'
</script>

<template>
  <main>
    <LeftSideBar/>
    <div class="felx flex-row w-[500px] h-svh bg-white z-[11]">
      <p>Hello world</p>
    </div>
  </main>
</template>

<style scoped>
@import '@/style.css';
</style>
