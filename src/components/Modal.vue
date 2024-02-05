
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
  
  <transition v-if="isModalVisible" name="fade">
    <div class="z-[9999999] absolute right-auto h-screen w-full" v-if="isModalVisible">
      <div @click="onToggle" class="absolute bg-black opacity-70 inset-0 z-0"></div>
      <div class="w-full m-h-[150px] max-w-lg p-3 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>


<style scoped>
@import '@/style.css';
</style>