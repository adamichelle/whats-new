<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  ariaDescribedby: {
    type: String,
    default: ''
  },
  elementId: {
    type: String,
    required: true
  },
  elementName: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [Boolean, Array],
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const checked = ref(false)

watchEffect(() => {
  if(typeof props.modelValue === 'boolean') {
    checked.value = props.modelValue
  } else {
    checked.value = props.modelValue.includes(props.elementName)
  }
})

const handleCheckboxToggle = (e) => {
  emit('update:modelValue', e.target.checked ? [...props.modelValue, e.target.name] : props.modelValue.filter(v => v !== e.target.name))
}
</script>

<template>
  <div class="flex">
    <div class="flex items-center h-5">
      <input 
        v-if="typeof modelValue === 'boolean'" 
        :id="elementId" type="checkbox"
        v-model="checked" 
        :aria-describedby="ariaDescribedby" 
        :name="elementName"
        autocomplete="off"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
      <input v-else :checked="checked" :id="elementId" type="checkbox" :aria-describedby="ariaDescribedby" :name="elementName"
        autocomplete="off"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        @change="handleCheckboxToggle">
    </div>
    <div class="ms-2 text-sm">
      <label :for="elementId" class="text-sm font-medium text-gray-900 dark:text-gray-300">{{ label }}</label>
      <p :id="ariaDescribedby" class="text-xs font-normal text-gray-500 dark:text-gray-300">
        <slot name="helperText" />
      </p>
    </div>
  </div>
</template>