<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import useNewsSources from '../composables/useNewsSources'
import { SOURCES_RETRIEVAL_PARAMETERS } from '../constants/general'
import PillStyledCheckbox from './PillStyledCheckbox.vue'

const props = defineProps({
  defaultCategory: {
    type: String,
    required: true
  },
  defaultCountry: {
    type: String,
    required: true
  },
  defaultLanguage: {
    type: String,
    required: true
  },
  getSourcesBasedOn: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const sourcesRetrievalParameters = ref([])
const queryStringArray = ref([])
const queryString = computed(() => queryStringArray.value.join('&'))

/** Test data for experimenting. TODO: Remove after setting up your API KEY */
const newsSources = ref([
  {
    id: 'abc-news',
    name: 'ABC News'
  },
  {
    id: 'techcrunch',
    name: 'Tech crunch'
  },
  {
    id: 'bbc',
    name: 'BBC News'
  },
  {
    id: 'buzzfeed',
    name: 'Buzz Feed'
  }
])

const checkedSources = ref([])

watch(checkedSources, (newCheckedSources) => {
  emit('update:modelValue', newCheckedSources)
})

watch(sourcesRetrievalParameters, async (newParams) => {
  queryStringArray.value = newParams.map((parameter) => {
    const retrievalParamDetails = SOURCES_RETRIEVAL_PARAMETERS.find((srp) => srp.value === parameter)
    const parameterValue = props[`default${retrievalParamDetails.parameterName}`]
    return `${parameter}=${parameterValue}`
  })

  /** TODO: Uncomment after setting up your API KEY */
  // const { newsSources: apiNewsSources, getNewsSources } = useNewsSources(queryString.value)
  // await getNewsSources()
  // newsSources.value = apiNewsSources.value
})

watchEffect(() => {
  checkedSources.value = props.modelValue
  sourcesRetrievalParameters.value = props.getSourcesBasedOn
})
</script>

<template>
  <div class="" role="group" aria-labelledby="sources-toggle-tokens-label">
    <p id="sources-toggle-tokens-label" class="block mb-5 text-sm font-medium text-gray-900 dark:text-white">
      Select or deselect a source
    </p>
    <div class="flex flex-row flex-wrap gap-x-3 gap-y-3">
      <PillStyledCheckbox v-for="source in newsSources" v-model="checkedSources" :element-id="source.id"
        :element-name="source.id" :key="source.id">
        {{ source.name }}
      </PillStyledCheckbox>
    </div>
  </div>
</template>