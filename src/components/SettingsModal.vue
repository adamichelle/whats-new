<script setup>
import { computed, onUpdated, ref, watch, watchEffect } from 'vue'
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'

import SelectDropdown from './SelectDropdown.vue'
import FeedArticleDurationInput from './FeedArticleDurationInput.vue'
import CheckboxInput from './CheckboxInput.vue'
import SourcesToggleTokens from './SourcesToggleTokens.vue'
import categories from '../constants/categories'
import countries from '../constants/countries'
import { APP_DEFAULTS_STORAGE_KEY, SOURCES_RETRIEVAL_PARAMETERS } from '../constants/general'
import languages from '../constants/languages'

dayjs.extend(duration)

const props = defineProps({
  defaultSettings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['saveSettings', 'resetToInitialDefaults'])

const countriesDropdownOptions = computed(() => countries.map((country) => ({ text: country.name, value: country.countryCode })))
const languagesDropdownOptions = computed(() => languages.map((language) => ({ text: language.name, value: language.languageCode })))
const categoriesDropdownOptions = computed(() => categories.map((category) => ({ text: category.slice(0, 1).toUpperCase() + category.slice(1), value: category })))

const selectedCategory = ref(null)
const selectedCountry = ref(null)
const selectedLanguage = ref(null)
const selectedDurationNumber = ref(0)
const selectedDurationUnit = ref('days')
const selectedSources = ref(null)
const selectedPublicationDate = computed(() => (
  dayjs().subtract(
    dayjs.duration({ [selectedDurationUnit.value]: selectedDurationNumber.value })
  ).format('YYYY-MM-DD')
))

const selectedSourcesRetrievalParameters = ref(null)

watchEffect(() => {
  selectedCategory.value = props.defaultSettings.category
  selectedCountry.value = props.defaultSettings.country
  selectedLanguage.value = props.defaultSettings.language
  selectedDurationNumber.value = props.defaultSettings.publishedXTimeAgo.number
  selectedDurationUnit.value = props.defaultSettings.publishedXTimeAgo.duration
  selectedSources.value = props.defaultSettings.sources
  selectedSourcesRetrievalParameters.value = props.defaultSettings.sourcesRetrievalParameters
})

const wereChangesMade = computed(() => 
  (!!selectedCategory.value && selectedCategory.value !== props.defaultSettings.category) ||
  (!!selectedCountry.value && selectedCountry.value !== props.defaultSettings.country) ||
  (!!selectedLanguage.value && selectedLanguage.value !== props.defaultSettings.language) ||
  (!!selectedDurationNumber.value && selectedDurationNumber.value !== props.defaultSettings.publishedXTimeAgo.number) ||
  (!!selectedDurationUnit.value && selectedDurationUnit.value !== props.defaultSettings.publishedXTimeAgo.duration) ||
  (!!selectedSources.value
    && selectedSources.value.length !== 0
    && selectedSources.value.length !== props.defaultSettings.sources.length
    && !selectedSources.value.every((source, index) => source === props.defaultSettings.sources[index])
  ) ||
  (!!selectedSourcesRetrievalParameters.value
    && selectedSourcesRetrievalParameters.value.length !== 0
    && selectedSourcesRetrievalParameters.value.length !== props.defaultSettings.sourcesRetrievalParameters.length
    && !selectedSourcesRetrievalParameters.value.every((srp, index) => srp === props.defaultSettings.sourcesRetrievalParameters[index])
  )
)

const handleSave = () => {
  const changes = computed(() => ({
    activeTabName: props.defaultSettings.activeTabName,
    country: selectedCountry.value,
    language: selectedLanguage.value,
    category: selectedCategory.value,
    publicationDate: selectedPublicationDate.value,
    publishedXTimeAgo: {
      number: selectedDurationNumber.value,
      duration: selectedDurationUnit.value
    },
    sourcesRetrievalParameters: selectedSourcesRetrievalParameters.value,
    sources: selectedSources.value
  }))

  localStorage.setItem(APP_DEFAULTS_STORAGE_KEY, JSON.stringify(changes.value))
  emit('saveSettings', changes.value)
}

const handleReset = () => {
  localStorage.removeItem(APP_DEFAULTS_STORAGE_KEY)
  emit('resetToInitialDefaults')
}

const onModalClose = () => {
  selectedCategory.value = props.defaultSettings.category
  selectedCountry.value = props.defaultSettings.country
  selectedLanguage.value = props.defaultSettings.language
  selectedDurationNumber.value = props.defaultSettings.publishedXTimeAgo.number
  selectedDurationUnit.value = props.defaultSettings.publishedXTimeAgo.duration
  selectedSources.value = props.defaultSettings.sources
  selectedSourcesRetrievalParameters.value = props.defaultSettings.sourcesRetrievalParameters
}
</script>

<template>
  <div id="settings-modal" tabindex="-1" aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            App Settings
          </h3>
          <button type="button"
            class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="settings-modal" @click="onModalClose">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <div class="mb-5">
            <h4 class="text-lg font-semibold mb-3">Feed settings</h4>

            <form class="space-y-4" action="#">
              <SelectDropdown element-id="countries" label="Country" :options="countriesDropdownOptions"
                v-model="selectedCountry" />
              <SelectDropdown element-id="languages" label="Language" :options="languagesDropdownOptions"
                v-model="selectedLanguage" />
              <SelectDropdown element-id="categories" label="Category" :options="categoriesDropdownOptions"
                v-model="selectedCategory" />
              <FeedArticleDurationInput :default-duration-settings="defaultSettings.publishedXTimeAgo"
                v-model:number="selectedDurationNumber" v-model:duration="selectedDurationUnit" />

              <h5 class="text-md font-semibold mb-1">Explore section news sources</h5>
              <div role="group" aria-labelledby="explore-section-sources-criteria">
                <p id="explore-section-sources-criteria"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sources retrieval parameters</p>

                <div class="flex flex-wrap gap-x-3">
                  <CheckboxInput v-for="parameter in SOURCES_RETRIEVAL_PARAMETERS" :element-id="parameter.value"
                    :label="parameter.parameterName" :element-name="parameter.value"
                    :aria-describedby="`${parameter.value}-parameter-description`"
                    v-model="selectedSourcesRetrievalParameters">
                    <template #helperText>
                      {{ parameter.description }}
                    </template>
                  </CheckboxInput>
                </div>
              </div>

              <Suspense>
                <SourcesToggleTokens
                  :default-category="selectedCategory"
                  :default-country="selectedCountry" 
                  :default-language="selectedLanguage"
                  :get-sources-based-on="selectedSourcesRetrievalParameters"
                  v-model="selectedSources" />
              </Suspense>
              <button type="button"
                class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                :class="{ 'cursor-not-allowed': !wereChangesMade }" :disabled="!wereChangesMade"
                @click.prevent="handleSave">Save</button>
            </form>
          </div>

          <div class="mt-10">
            <h4 class="text-lg font-semibold mb-3">Reset settings to initial defaults</h4>
            <div>
              <p class="mb-4">By resetting the default settings, you will lose access to the values you have set.
                It will reset the active tab, language, country and category settings.</p>
              <button type="button"
                class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                @click="handleReset">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>