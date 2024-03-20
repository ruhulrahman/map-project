<script setup>
import { ref } from 'vue'
const isModalVisible = ref(false)

const onToggle = () => {
  isModalVisible.value = !isModalVisible.value
}

const show = () => {
  isModalVisible.value = true
}

const hide = () => {
  isModalVisible.value = false
}

defineExpose({
  onToggle, show, hide
})

</script>

<template>
    <div class="z-[9999999] absolute right-[15px] top-[90px] shadow-lg bg-[#1F1F1F] rounded-xl p-3 transition-all duration-1000 ease-in-out" :class="isModalVisible ? 'h-auto w-[450px]' : 'h-0 w-0'" v-show="isModalVisible">
      <div class="flex justify-center items-center relative transition-all duration-1000 ease-in-out">
        <div class="w-full transition-all duration-1000 ease-in-out">
          <div class="flex justify-between border-b border-neutral-800">
            <slot name="header"></slot>
            <font-awesome-icon @click="onToggle" class=" hover:bg-[#2A2A2A] w-[20px] h-[20px] p-2 rounded-full cursor-pointer" :icon="['fas', 'xmark']" />
          </div>
          <div class="max-h-[520px] overflow-y-auto no-scrollbar">
            <slot></slot>  
          </div>
        </div>
      </div>
    </div>
</template>


<style scoped>
@import '@/style.css';

:deep() {
  --vs-controls-color: #a1a1a1;
  --vs-border-color: #52525B;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #F3F4F6;
  --vs-dropdown-option-color: #F3F4F6;

  --vs-selected-bg: #344560;
  --vs-selected-color: #F3F4F6;

  --vs-search-input-color: #F3F4F6;

  --vs-dropdown-option--active-bg: #344560;
  --vs-dropdown-option--active-color: #F3F4F6;

  --vs-search-input-placeholder-color: #71717A;
  --vs-font-size: 14px;
  --vs-line-height: 2;
}

.style-chooser .vs__search::placeholder {
  color: #394066 !important;
  font-size: 12px !important;
}
</style>