<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  initModals,
  initTabs
} from 'flowbite'
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'

import NewsItems from './components/NewsItems.vue'
import SettingsModal from './components/SettingsModal.vue'
import TabContent from './components/TabContent.vue'
import categories from './constants/categories'
import { APPLICATION_TABS, INITIAL_SETUP_INFORMATION, APP_DEFAULTS_STORAGE_KEY, CUSTOMIZATIONS_STORAGE_KEY } from './constants/general'
import countries from './constants/countries'
import languages from './constants/languages'
import { checkForStorageAvailability } from './utils/detect-web-storage-availability'

dayjs.extend(duration)

const isLocalStorageAvailable = checkForStorageAvailability('localStorage')

const appDefaultCountryInformation = countries.find((country) => country.name === INITIAL_SETUP_INFORMATION.country)
const appDefaultLanguageInformation = languages.find((language) => language.name === INITIAL_SETUP_INFORMATION.language)
const appDefaultCategoryInformation = categories.find((category) => category === INITIAL_SETUP_INFORMATION.category.toLowerCase())
const appDefaultPublicationDate = dayjs().subtract(
  dayjs.duration({ [INITIAL_SETUP_INFORMATION.publishedXTimeAgo.duration]: INITIAL_SETUP_INFORMATION.publishedXTimeAgo.number })
).format('YYYY-MM-DD')

const initialAppDefaults = {
  activeTabName: INITIAL_SETUP_INFORMATION.activeTabName,
  country: appDefaultCountryInformation.countryCode,
  language: appDefaultLanguageInformation.languageCode,
  category: appDefaultCategoryInformation,
  publicationDate: appDefaultPublicationDate,
  publishedXTimeAgo: {
    number: INITIAL_SETUP_INFORMATION.publishedXTimeAgo.number,
    duration: INITIAL_SETUP_INFORMATION.publishedXTimeAgo.duration
  },
  sourcesRetrievalParameters: INITIAL_SETUP_INFORMATION.sourcesRetrievalParameters,
  sources: INITIAL_SETUP_INFORMATION.sources
}
const initialActiveTab = APPLICATION_TABS.find((tab) => tab.name === initialAppDefaults.activeTabName)

const customCurationEnabled = isLocalStorageAvailable && !!localStorage.getItem(CUSTOMIZATIONS_STORAGE_KEY)
const currentAppDefaults = isLocalStorageAvailable && localStorage.getItem(APP_DEFAULTS_STORAGE_KEY) && JSON.parse(localStorage.getItem(APP_DEFAULTS_STORAGE_KEY))
const currentActiveTabName = customCurationEnabled ? APPLICATION_TABS[2].name : isLocalStorageAvailable && localStorage.getItem(APP_DEFAULTS_STORAGE_KEY) && JSON.parse(localStorage.getItem(APP_DEFAULTS_STORAGE_KEY)).activeTabName

const appDefaults = ref(initialAppDefaults)
const activeTab = ref(initialActiveTab)

const activeTabContentUrl = ref('')

const handleTabClick = (e) => {
  activeTab.value = APPLICATION_TABS.find(tab => tab.id === e.target.id)
}

const handleSaveSettings = (changes) => {
  appDefaults.value = changes
}

const handleResetToInitialDefaults = () => {
  appDefaults.value = initialAppDefaults
}

watch(activeTab, (newTab) => {
  activeTabContentUrl.value = APPLICATION_TABS.find((tab) => tab.id === newTab.id)?.apiCallURL
}, {
  immediate: true
})

onMounted(() => {
  initModals()
  initTabs()

  if (!!currentAppDefaults) {
    appDefaults.value = currentAppDefaults
  }

  if (!!currentActiveTabName) {
    activeTab.value = APPLICATION_TABS.find((tab) => tab.name === currentActiveTabName)
  }
})
</script>

<template>
  <header class="h-32 grid place-content-center">
    <h1 class="text-3xl font-bold text-center align-middle">What's New</h1>
  </header>

  <main class="container mx-auto">
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between">
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center items-center" id="default-tab"
        data-tabs-toggle="#default-tab-content" role="tablist">
        <li v-for="tab in APPLICATION_TABS" :key="tab.id" role="presentation">
          <button class="inline-block p-4 border-b-2 rounded-t-lg" :id="tab.id" :data-tabs-target="tab.target"
            :aria-selected="tab.id === activeTab.id" @click="handleTabClick" type="button" role="tab"
            :aria-controls="tab.ariaControls">
            {{ tab.name }}
          </button>
        </li>
      </ul>

      <!-- Settings Modal toggle -->
      <button v-if="isLocalStorageAvailable" type="button" data-modal-target="settings-modal"
        data-modal-toggle="settings-modal"
        class="self-end mb-0.5 text-gray-900 w-10 h-10 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-full text-sm p-2.5 text-center items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <span class="sr-only">Settings</span>
      </button>

      <Teleport to="#modalTarget">
        <!-- Settings modal -->
        <SettingsModal v-if="isLocalStorageAvailable" :default-settings="appDefaults" @save-settings="handleSaveSettings"
          @reset-to-initial-defaults="handleResetToInitialDefaults" />
      </Teleport>
    </div>
    <div id="default-tab-content">
      <TabContent v-for="tab in APPLICATION_TABS" :id="tab.ariaControls" role="tabpanel" :aria-labelledby="tab.id">
        <template #newsFeed>
          <Suspense>
            <NewsItems v-if="tab.id === activeTab.id" :retrieve-custom-curated-content="customCurationEnabled"
              :url="activeTabContentUrl" :tab="activeTab" :default-settings="appDefaults" />
          </Suspense>
        </template>
      </TabContent>
    </div>
  </main>

  <footer class="p-5">
    <p class="text-center text-sm">News sourced from
      <a href="newsapi.org" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">News API</a>
    </p>
  </footer>
</template>
