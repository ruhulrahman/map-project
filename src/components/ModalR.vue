<script setup>
import { ref } from 'vue'
const isModalVisible = ref(false)

const onToggle = () => {
  isModalVisible.value = !isModalVisible.value
}

defineExpose({
  onToggle
})

</script>

<template>
  
  <transition v-if="isModalVisible" name="fade">
    <div class="z-[9999999] absolute right-[15px] top-[90px] h-auto w-[350px] transition-all duration-200" v-if="isModalVisible">
      <div class="flex justify-center items-center h-auto relative transition-all duration-200">
        <div class="w-full max-w-lg h-auto p-3 rounded-xl shadow-lg bg-[#1F1F1F] z-[6] transition-all duration-200">
          <div class="flex justify-between border-b border-neutral-800 ">
            <div class="flex flex-col">
              <slot name="header"></slot>
            </div>
            <div class="flex flex-col">
                <font-awesome-icon @click="onToggle" class=" hover:bg-[#2A2A2A] w-[20px] h-[20px] p-2 rounded-full cursor-pointer" :icon="['fas', 'xmark']" />
            </div>
          </div>
          <div class="h-auto max-h-[520px] overflow-y-auto no-scrollbar">
            <slot></slot>  
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<style scoped>
@import '@/style.css';

:deep() {
  --vs-controls-color: #F3F4F6;
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
  --vs-font-size: 13px;
  --vs-line-height: 2;
}

.style-chooser .vs__search::placeholder {
  color: #394066 !important;
  font-size: 12px !important;
}
</style>