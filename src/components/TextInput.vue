<script setup>
defineProps({
  elementId: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  ariaDescribedby: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>
<template>
  <label :for="elementId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    <slot />
  </label>
  <input type="text" :id="elementId" :aria-describedby="ariaDescribedby" :value="modelValue" @input="handleChange" autocomplete="off"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
  <slot name="helperText" />
</template>