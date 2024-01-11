<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  ariaLabelledby: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="hidden p-4 rounded-lg bg-white-50 dark:bg-gray-800" :id="id" role="tabpanel"
    :aria-labelledby="ariaLabelledby">
    <slot name="otherContent"></slot>
    <slot name="newsFeed"></slot>
  </div>
</template>