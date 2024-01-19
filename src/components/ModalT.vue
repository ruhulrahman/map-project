
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
                  <h6>My name is Ruhul. How are you are you ok?</h6>
                </div>
              </div>

              <div class="flex-1 bg-black bg-opacity-[0.4] rounded-lg p-2 shadow-cyan-sm shadow-sm shadow-purple-300">

                <div class="mb-2 pb-5">
                  <label for="success" class="block mb-2 text-sm font-medium text-purple-300">Your
                    name</label>
                  <input type="text" id="success"
                    class=" text-purple-300 placeholder-purple-500 text-sm rounded-lg block w-full p-2.5 shadow-gray-outset focus:shadow-gray-inset"
                    placeholder="Success input" />
                </div>

                <div class="mb-2 pb-5 ">
                  <label for="success" class="block mb-2 text-sm font-medium text-purple-300">Your
                    name</label>
                  <input type="text" id="success"
                    class=" text-purple-300 placeholder-purple-500 text-sm rounded-lg block w-full p-2.5 shadow-gray-outset focus:shadow-gray-inset"
                    placeholder="Success input" />
                </div>

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