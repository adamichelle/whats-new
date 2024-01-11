<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
import * as relativeTime from 'dayjs/plugin/relativeTime'

import SelectDropdown from './SelectDropdown.vue'
import CheckboxInput from './CheckboxInput.vue'
import TextInput from './TextInput.vue'
import FeedArticleDurationInput from './FeedArticleDurationInput.vue'
import SourcesToggleTokens from './SourcesToggleTokens.vue'
import categories from '../constants/categories'
import countries from '../constants/countries'
import { 
  ENDPOINTS,
  SORTING_ORDERS,
  SOURCES_RETRIEVAL_PARAMETERS,
  CUSTOMIZATIONS_STORAGE_KEY, 
  APP_DEFAULTS_STORAGE_KEY,
  APPLICATION_TABS 
} from '../constants/general'
import languages from '../constants/languages'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const props = defineProps({
  defaultAppSettings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['saveCustomizations'])

const defaultAPISortingOrder = computed(() => SORTING_ORDERS.find((order) => order.isDefault))
const categoriesDropdownOptions = computed(() => categories.map((category) => ({ text: category.slice(0, 1).toUpperCase() + category.slice(1), value: category })))
const countriesDropdownOptions = computed(() => countries.map((country) => ({ text: country.name, value: country.countryCode })))
const languagesDropdownOptions = computed(() => languages.map((language) => ({ text: language.name, value: language.languageCode })))
const endpointsDropdownOptions = computed(() => ENDPOINTS.map((endpoint) => ({ text: endpoint.endpointName, value: endpoint.endpointValue })))
const sortingOrdersDropdownOptions = computed(() => SORTING_ORDERS.map((order) => ({ text: order.name, value: order.sortingOrderValue })))

const initialCustomizationsObject = ref({
  endpoint: null,
  country: '',
  language: '',
  from: '',
  sources: '',
  sortBy: defaultAPISortingOrder.value.sortingOrderValue,
  q: '',
  domains: '',
  excludeDomains: ''
})
const currentCustomizations = localStorage.getItem(CUSTOMIZATIONS_STORAGE_KEY) && JSON.parse(localStorage.getItem(CUSTOMIZATIONS_STORAGE_KEY))
const customizations = ref(initialCustomizationsObject.value)

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
const selectedEndpoint = ref(null)
const selectedSorting = ref(defaultAPISortingOrder.value.sortingOrderValue)
const enteredQuery = ref('')
const includeDomains = ref('')
const excludeDomains = ref('')
const selectedSourcesRetrievalParameters = ref(null)


watchEffect(() => {
  customizations.value.country == props.defaultAppSettings.country
  customizations.value.language == props.defaultAppSettings.language
  customizations.value.from == props.defaultAppSettings.publicationDate
  customizations.value.sources == props.defaultAppSettings.sources.join(',')
  selectedCategory.value = customizations.value.category || props.defaultAppSettings.category
  selectedCountry.value = customizations.value.country || props.defaultAppSettings.country
  selectedLanguage.value = customizations.value.language || props.defaultAppSettings.language
  selectedDurationNumber.value = !!customizations.value.from ? dayjs(customizations.from).fromNow(true).split(' ')[0] : props.defaultAppSettings.publishedXTimeAgo.number
  selectedDurationUnit.value = !!customizations.value.from ? dayjs(customizations.from).fromNow(true).split(' ')[1] : props.defaultAppSettings.publishedXTimeAgo.duration
  selectedSources.value = !!customizations.value.sources ? customizations.value.sources?.split(',') : props.defaultAppSettings.sources
  selectedEndpoint.value = customizations.value.endpoint
  selectedSorting.value = customizations.value.sortBy
  enteredQuery.value = customizations.value.q || ''
  includeDomains.value = customizations.value.domains || ''
  excludeDomains.value = customizations.value.excludeDomains || ''
  selectedSourcesRetrievalParameters.value = props.defaultAppSettings.sourcesRetrievalParameters
})

const wereChangesMade = computed(() => !!selectedEndpoint.value && selectedEndpoint.value !== props.defaultAppSettings.endpoint)

onMounted(() => {
  if (!!currentCustomizations) {
    customizations.value = currentCustomizations
  }
})

const handleSave = () => {
  const customizations = computed(() => ({
    endpoint: selectedEndpoint.value,
    language: selectedLanguage.value,
    sources: selectedSources.value.join(','),
    ...(selectedEndpoint.value === ENDPOINTS[1].endpointValue && { category: selectedCategory.value }),
    ...(selectedEndpoint.value === ENDPOINTS[1].endpointValue && { country: selectedCountry.value }),
    ...(selectedEndpoint.value === ENDPOINTS[0].endpointValue && { from: selectedPublicationDate.value }),
    ...(selectedEndpoint.value === ENDPOINTS[0].endpointValue && { sortBy: selectedSorting.value }),
    ...(selectedEndpoint.value === ENDPOINTS[0].endpointValue && enteredQuery.value.length > 0 && { q: enteredQuery.value }),
    ...(selectedEndpoint.value === ENDPOINTS[0].endpointValue && includeDomains.value.length > 0 && { domains: includeDomains.value }),
    ...(selectedEndpoint.value === ENDPOINTS[0].endpointValue && excludeDomains.value.length > 0 && { excludeDomains: excludeDomains.value })
  }))

  localStorage.setItem(CUSTOMIZATIONS_STORAGE_KEY, JSON.stringify(customizations.value))
  const currentAppDefaults = localStorage.getItem(APP_DEFAULTS_STORAGE_KEY) && JSON.parse(localStorage.getItem(APP_DEFAULTS_STORAGE_KEY))
  if (!!currentAppDefaults) {
    const modifiedAppDefaults = {
      ...props.defaultAppSettings,
      activeTabName: APPLICATION_TABS[2].name
    }
    localStorage.setItem(APP_DEFAULTS_STORAGE_KEY, JSON.stringify(modifiedAppDefaults))
  }
  emit('saveCustomizations')
}

const handleReset = () => {
  localStorage.removeItem(CUSTOMIZATIONS_STORAGE_KEY)
  const currentAppDefaults = localStorage.getItem(APP_DEFAULTS_STORAGE_KEY) && JSON.parse(localStorage.getItem(APP_DEFAULTS_STORAGE_KEY))
  if (!!currentAppDefaults) {
    const modifiedAppDefaults = {
      ...props.defaultAppSettings,
      activeTabName: APPLICATION_TABS[0].name
    }
    localStorage.setItem(APP_DEFAULTS_STORAGE_KEY, JSON.stringify(modifiedAppDefaults))
  }
}
</script>

<template>
  <div id="feed-customization-modal" tabindex="-1" aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Customize your feed
          </h3>
          <button type="button"
            class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="feed-customization-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <div class="mb-5">
            <h4 class="text-lg font-semibold mb-3">Feed preferences</h4>

            <form class="space-y-4" action="#">
              <SelectDropdown element-id="endpoint" label="Endpoint" :options="endpointsDropdownOptions"
                v-model="selectedEndpoint" />

              <div class="space-y-4" role="group" aria-labelledby="additional-parameters-label">
                <p class="text-md font-semibold mb-3" id="additional-parameters-label">Additional parameters</p>

                <SelectDropdown element-id="country" label="Country" :options="countriesDropdownOptions"
                  v-model="selectedCountry" />

                <SelectDropdown element-id="language" label="Language" :options="languagesDropdownOptions"
                  v-model="selectedLanguage" />

                <SelectDropdown element-id="category" label="Category" :options="categoriesDropdownOptions"
                  v-model="selectedCategory" />

                <FeedArticleDurationInput v-if="selectedEndpoint === ENDPOINTS[0].endpointValue"
                  :default-duration-settings="defaultAppSettings.publishedXTimeAgo"
                  v-model:number="selectedDurationNumber" v-model:duration="selectedDurationUnit" />

                <TextInput v-if="selectedEndpoint === ENDPOINTS[0].endpointValue" v-model="enteredQuery"
                  element-id="entered-query" aria-describedby="entered-query-explanation">
                  Keywords or phrases to search for in the article title and body
                  <template #helperText>
                    <p id="entered-query-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">It can be a
                      simple keyword, phrase or an advanced search query. Visit the <a
                        href="https://newsapi.org/docs/endpoints/everything"
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline">NewsAPI documentation</a> and
                      read the information under
                    <pre class="inline"><code>q</code></pre> to learn more about building advanced search queries.</p>
                  </template>
                </TextInput>

                <TextInput v-if="selectedEndpoint === ENDPOINTS[0].endpointValue" v-model="includeDomains"
                  element-id="include-domains" aria-describedby="include-domains-explanation">
                  Domains to retrieve news from
                  <template #helperText>
                    <p id="include-domains-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter
                      a comma-seperated string of domains to which you want to restrict the search. For example:
                      bbc.co.uk, techcrunch.com, engadget.com</p>
                  </template>
                </TextInput>

                <TextInput v-if="selectedEndpoint === ENDPOINTS[0].endpointValue" v-model="excludeDomains"
                  element-id="exclude-domains" aria-describedby="exclude-domains-explanation">
                  Domains to <strong>exclude</strong> when retrieving news
                  <template #helperText>
                    <p id="exclude-domains-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter
                      a comma-seperated string of domains that you want to remove from the results. For example:
                      bbc.co.uk, techcrunch.com, engadget.com</p>
                  </template>
                </TextInput>

                <SelectDropdown v-if="selectedEndpoint === ENDPOINTS[0].endpointValue" element-id="sorting-order"
                  label="Sorting order" :options="sortingOrdersDropdownOptions" v-model="selectedSorting" />

                <div role="group" aria-labelledby="explore-section-sources-criteria">
                  <p id="explore-section-sources-criteria"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sources retrieval parameters</p>

                  <div class="flex flex-wrap gap-x-3">
                    <CheckboxInput v-for="parameter in SOURCES_RETRIEVAL_PARAMETERS"
                      :element-id="`sources-retrieval-checkbox-${parameter.value}`" :label="parameter.parameterName"
                      :element-name="parameter.value" :aria-describedby="`${parameter.value}-parameter-description`"
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
                    v-model="selectedSources"
                    :get-sources-based-on="selectedSourcesRetrievalParameters" />
                </Suspense>
              </div>

              <button type="button"
                class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                :class="{ 'cursor-not-allowed': !wereChangesMade }" :disabled="!wereChangesMade"
                @click.prevent="handleSave">Save</button>
            </form>
          </div>

          <div class="mt-10">
            <h4 class="text-lg font-semibold mb-3">Remove customizations</h4>
            <div>
              <p class="mb-4">By removing customizations, you will lose access to the customizations you have made.
                It will reset the <strong>Curated for me</strong> tab to a blank state.</p>
              <button type="button"
                class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                @click="handleReset">Remove customizations</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>