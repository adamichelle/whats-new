<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  elementId: {
    type: String,
    required: true
  },
  elementName: {
    type: String,
    required: true
  },
  modelValue: {
    type: Array,
    default: []
  }
})

const emit = defineEmits(['update:modelValue'])

const checked = ref(false)

watchEffect(() => {
  checked.value = props.modelValue.includes(props.elementName)
})

const handleCheckboxToggle = (e) => {
  emit('update:modelValue', e.target.checked ? [...props.modelValue, e.target.name] : props.modelValue.filter(v => v !== e.target.name))
}
</script>

<template>
  <div class="w-auto min-h-10 relative pill-styled-checkbox" :aria-checked="checked">
    <input :checked="checked" type="checkbox" :id="elementId" :name="elementName" class="pill-styled-checkbox__input"
      @change="handleCheckboxToggle">
    <label :for="elementId" class="pill-styled-checkbox__label">
      <slot />
    </label>
  </div>
</template>