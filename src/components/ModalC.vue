<script setup>
import { computed, ref } from 'vue'
import { string } from 'yup'
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


// const props = defineProps({
//     size: undefined,
// })

// const getModalSize = (size) => {
//   console.log('size', size)
//   if (size) {
//     return `modal-${size}`
//   } else {
//     return 'modal-md'
//   }
// }

// console.log('modalSize', getModalSize.value)

</script>

<template>
  <Teleport to="body">
    <transition v-if="isModalVisible" name="fade">
      <div class="z-[9999999] absolute bottom-0 right-auto h-auto w-full" v-if="isModalVisible">
        <div class="flex justify-center items-center h-screen relative">
          <div @click="onToggle" class="absolute top-0 left-0 h-auto w-full bg-black opacity-70 inset-0 z-0"></div>
          <div class="absolute mx-auto my-auto w-full h-auto p-3 rounded-xl shadow-lg bg-[#1F1F1F] z-[6] modal-xl">
            <div class="flex justify-between border-b border-neutral-800">
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