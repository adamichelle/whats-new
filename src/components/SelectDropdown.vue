<script setup>
import { ref } from 'vue'

const props = defineProps({
  allowEmptyOption: {
    type: Boolean,
    default: false
  },
  elementId: {
    type: String,
    required: true
  },
  emptyOptionText: {
    type: String,
    default: 'Select an option'
  },
  hasLabelElement: {
    type: Boolean,
    default: true
  },
  label: {
    types: String,
    default: 'Select an option'
  },
  options: {
    type: Array,
    default: () => ([])
  },
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <label v-if="hasLabelElement" :for="elementId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
  <select
    :aria-label="!hasLabelElement ? label : undefined"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    :id="elementId"
    :value="modelValue"
    autocomplete="off"
    @change="handleChange"
    >
    <option v-if="allowEmptyOption || options.length === 0">{{ emptyOptionText }}</option>
    <option 
      v-for="option in options"
      :key="`${ elementId }-${ option.value }`"
      :id="`${ elementId }-${ option.value }`"
      
      :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>