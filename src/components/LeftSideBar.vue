
<script setup>
import { ref } from 'vue'
const hideLeftSidebar = ref(false)

const toggleLeftSidebar = () => {
  hideLeftSidebar.value = !hideLeftSidebar.value
}

const array = [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2]

</script>

<template>
  <div class="absolute left-0 bg-[#1F1F1F]"
    :class="hideLeftSidebar ? 'w-0 transition-all duration-200' : 'w-[300px] transition-all duration-200'">
    <div class="flex flex-row h-full">
      <div v-if="hideLeftSidebar" @click="toggleLeftSidebar"
        class="absolute top-1/2 hover:scale-110 duration-300 right-[-23px] bg-[#1F1F1F] bg-opacity-[0.7] hover:bg-neutral-800 cursor-pointer z-[5] py-3 px-2 rounded-r-lg">
        <font-awesome-icon :icon="['fas', 'caret-right']" />
      </div>

      <div v-if="!hideLeftSidebar" class="flex flex-row w-full  h-screen px-2 overflow-y-auto">

        <div @click="toggleLeftSidebar"
          class="absolute top-1/2 right-[-23px] hover:scale-110 duration-300  bg-neutral-900 bg-opacity-[0.7] hover:bg-neutral-800 cursor-pointer z-[5] py-3 px-2 rounded-r-lg">
          <font-awesome-icon :icon="['fas', 'caret-left']" />
        </div>

        <div class="flex flex-row w-full h-full">
          <div class="flex flex-col w-full h-full gap-3">
            <div class="flex flex-row mt-[10px]">
              <!-- <button class="w-full btn btn-primary bg-green-700 border-none">+ Add New </button> -->

              <button class="btn w-full bg-gradient-to-r from-gray-600 to-gray-900 hover:from-gray-900 hover:to-gray-700 text-gray-300 hover:-translate-y-[1px] duration-300">
                + Add New
              </button>
            </div>

            <div class="flex flex-row justify-start items-center pt-3 text-white"
              style="border-top: 1px solid rgb(60, 60, 60);">
              <div class="flex flex-col">
                <font-awesome-icon :icon="['fas', 'angle-up']" />
              </div>
              <div class="flex flex-col ml-4">
                <p>Drive Projects</p>
              </div>
            </div>

            <div class="flex flex-col gap-3 pb-[85px]">

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

              <div class="btn-create" v-for="(item, index) in array" :key="index">
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
  </div>
</template>

<style scoped>@import '@/style.css';</style>