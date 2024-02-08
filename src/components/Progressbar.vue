<script setup>
defineProps({
  color: {
    type: String,
    required: true
  }
})
</script>

<template>
    <!-- set progressbar -->
    <div class='w-full z-[9999]'>
        <div class='h-1.5 w-full bg-pink-100 overflow-hidden'>
            <div :class="color" class='progress w-full h-full bg-green-500 left-right'></div>
        </div>
    </div>
</template>

<style scoped>
@import '@/style.css';

.progress {
    animation: progress 1s infinite linear;
}

.left-right {
    transform-origin: 0% 50%;
}

@keyframes progress {
    0% {
        transform: translateX(0) scaleX(0);
    }

    40% {
        transform: translateX(0) scaleX(0.4);
    }

    100% {
        transform: translateX(100%) scaleX(0.5);
    }
}</style>