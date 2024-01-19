
<script setup>
import { ref } from 'vue'
const hideLeftSidebar = ref(true)

const toggleRightSidebar = () => {
  hideLeftSidebar.value = !hideLeftSidebar.value
}

defineExpose({
  toggleRightSidebar
})

</script>

<template>
  <div class="absolute top-0 right-0 z-[10] bg-neutral-900 bg-opacity-[0.7] h-full shadow-sm shadow-purple-300"
    :class="hideLeftSidebar ? 'w-0 transition-all duration-200' : 'w-[450px] transition-all duration-200'">
    <div class="flex flex-row">
      <div v-if="hideLeftSidebar" @click="toggleRightSidebar"
        class="absolute top-1/2 hover:scale-110 duration-300 right-[-23px] bg-neutral-900 bg-opacity-[0.7] hover:bg-neutral-800 cursor-pointer z-[5] py-3 px-2 rounded-r-lg">
        <font-awesome-icon :icon="['fas', 'caret-right']" />
      </div>

      <div v-if="!hideLeftSidebar" class="flex flex-row w-full py-1 px-2 pt-3">

        <div class="flex flex-row w-full">
          <div class="flex flex-col w-full gap-3">
            <div class="flex flex-col gap-3">

              <div class="flex p-2 border-b border-gray-600 bg-black  bg-opacity-[0.7] mx-[-8px] mt-[-8px]">
                <font-awesome-icon @click="toggleRightSidebar" class="btn-icon" :icon="['fas', 'times']" />
                <div class="flex-1 pl-2 text-cyan-500">
                  <header>
                    <slot name="header"></slot>
                  </header>
                </div>
              </div>

              <slot></slot>

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