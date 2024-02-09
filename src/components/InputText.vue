<template>
    <input :value="value" :type="type || 'text'"
        :class="{ dirty: meta.dirty, valid: meta.touched && meta.valid, invalid: meta.touched && !meta.valid }"
        @change="handleChange" @blur="handleBlur" class="input-control" :placeholder="placeholder || ''"/>
    <p class="error-text" v-if="errorMessage">
        {{ errorMessage }}
    </p>
</template>
  
<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
    name: String,
    type: String,
    placeholder: String,
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { handleChange, value, handleBlur, errorMessage, meta } = useField(() => props.name, undefined);
</script>
  
<style scoped>
@import '@/style.css';

input.valid {
    border-color: #41b883;
}

input.invalid {
    border-color: #e74c3c;
}

input.dirty::after {
  content: '*';
  color: cadetblue;
}
</style>
  