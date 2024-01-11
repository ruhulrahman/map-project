
<script setup lang="ts">
import { ref } from 'vue'
const hideLeftSidebar = ref(false)

const toggleLeftSidebar = () => {
  hideLeftSidebar.value = !hideLeftSidebar.value
}

</script>

<template>
  <div class="flex flex-row h-svh relative" :class="hideLeftSidebar ? 'w-0 transition-all duration-200' : 'w-[300px] transition-all duration-200'">
    <div v-if="hideLeftSidebar" @click="toggleLeftSidebar" class="absolute top-1/2 hover:scale-110 duration-300 right-[-23px] bg-neutral-900 hover:bg-neutral-800 cursor-pointer z-[5] py-3 px-2 rounded-r-lg">
      <font-awesome-icon :icon="['fas', 'caret-right']" />
    </div>

    <div v-if="!hideLeftSidebar" class="flex flex-row w-full bg-neutral-900 py-1 px-2 pt-3 relative">

      <div @click="toggleLeftSidebar" class="absolute top-1/2 right-[-23px] hover:scale-110 duration-300  bg-neutral-900 hover:bg-neutral-800 cursor-pointer z-[5] py-3 px-2 rounded-r-lg">
        <font-awesome-icon :icon="['fas', 'caret-left']" />
      </div>

      <div class="flex flex-row w-full">
        <div class="flex flex-col w-full gap-3">
          <div class="flex flex-row">
            <button class="w-full btn btn-primary">+ New </button>
          </div>

          <div class="flex flex-row justify-start items-center pt-3 text-gray-300"
            style="border-top: 1px solid rgb(60, 60, 60);">
            <div class="flex flex-col">
              <font-awesome-icon :icon="['fas', 'angle-up']" />
            </div>
            <div class="flex flex-col ml-4">
              <p>Drive Projects</p>
            </div>
          </div>

          <div class="flex flex-col gap-3">

            <div class="btn-create">
              <div class="flex-none p-3">
                <font-awesome-icon :icon="['fab', 'google-drive']" />
              </div>
              <div class="flex-1">
                <h6>Untitled</h6>
                <p>Dec 16, 2023</p>
              </div>
              <div class="flex-none p-3">
                <font-awesome-icon :icon="['fas', 'eye-slash']" />
              </div>
            </div>

            <div class="btn-create">
              <div class="flex-none p-3">
                <font-awesome-icon :icon="['fab', 'google-drive']" />
              </div>
              <div class="flex-1">
                <h6>Untitled</h6>
                <p>Dec 16, 2023</p>
              </div>
              <div class="flex-none p-3">
                <font-awesome-icon :icon="['fas', 'eye-slash']" />
              </div>
            </div>

            <div class="btn-create">
              <div class="flex-none p-3">
                <font-awesome-icon :icon="['fab', 'google-drive']" />
              </div>
              <div class="flex-1">
                <h6>Untitled</h6>
                <p>Dec 16, 2023</p>
              </div>
              <div class="flex-none p-3">
                <font-awesome-icon :icon="['fas', 'eye-slash']" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/style.css';
</style>