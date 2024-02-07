<script setup>
import { ref } from 'vue'
const isModalVisible = ref(true)

const onToggle = () => {
  isModalVisible.value = !isModalVisible.value
}

defineExpose({
  onToggle
})

</script>

<template>
  <Teleport to="body">
    <transition v-if="isModalVisible" name="fade">
      <div class="z-[9999999] absolute bottom-0 right-auto h-screen w-full" v-if="isModalVisible">
        <div class="flex justify-center items-center h-screen relative">
          <div @click="onToggle" class="absolute top-0 left-0 h-screen w-full bg-black opacity-70 inset-0 z-0"></div>
          <div class="absolute mx-auto my-auto w-full max-w-lg h-auto p-3 rounded-xl shadow-lg bg-[#1F1F1F] z-[6]">
            <div class="flex justify-between border-b border-neutral-800 ">
              <div class="flex flex-col">
                <slot name="header"></slot>
              </div>
              <div class="flex flex-col">
                  <font-awesome-icon @click="onToggle" class=" hover:bg-[#2A2A2A] w-[20px] h-[20px] p-2 rounded-full cursor-pointer" :icon="['fas', 'xmark']" />
              </div>
            </div>
            <div class="max-h-[550px] overflow-y-auto no-scrollbar">
              <slot></slot>  
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>


<style scoped>
@import '@/style.css';
</style>