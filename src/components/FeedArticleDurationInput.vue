<script setup>
import { ref, watchEffect } from 'vue';
import SelectDropdown from './SelectDropdown.vue';

const props = defineProps({
  defaultDurationSettings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:number', 'update:duration'])

const unitsDropdownOptions = [
  {
    text: 'Days',
    value: 'days'
  },
  {
    text: 'Hours',
    value: 'hours'
  }
]

const chosenNumber = ref(0)
const chosenDuration = ref('')

const handleNumberInputChange = (e) => {
  chosenNumber.value = e.target.value
  emit('update:number', e.target.value)
}
const handleUnitsInputChange = (value) => {
  emit('update:duration', value)
}

watchEffect(() => {
  chosenNumber.value = props.defaultDurationSettings.number
  chosenDuration.value = props.defaultDurationSettings.duration
})
</script>

<template>
  <div role="group" aria-labelledby="feed-article-duration">
    <p id="feed-article-duration" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Retrieve articles
      published in the past</p>
    <div class="flex flex-row gap-x-2">
      <input type="number" id="number-input" min="1"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        :value="chosenNumber" aria-label="Select a number" @input="handleNumberInputChange">
      <SelectDropdown element-id="units" :has-label-element="false" label="Units" :options="unitsDropdownOptions"
        v-model="chosenDuration" @update:model-value="handleUnitsInputChange" />
    </div>
  </div>
</template>