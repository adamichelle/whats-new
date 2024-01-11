<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import {
  initModals
} from 'flowbite'
import NewsItem from './NewsItem.vue'
import FeedCustomizationModal from './FeedCustomizationModal.vue'
import useNewsItems from '../composables/useNewsItems'
import { APPLICATION_TABS, CUSTOMIZATIONS_STORAGE_KEY } from '../constants/general'
import { parse } from '../utils/dynamic-string-parser'
import { checkForStorageAvailability } from '../utils/detect-web-storage-availability'

const props = defineProps({
  retrieveCustomCuratedContent: {
    type: Boolean,
    default: false
  },
  defaultSettings: {
    type: Object,
    required: true
  },
  tab: {
    type: Object,
    required: true
  },
  url: {
    type: String,
    required: true
  }
})

const isLocalStorageAvailable = checkForStorageAvailability('localStorage')

/** 
 * This variable contains testing data that mimics the API values.
 * TODO: Remove this variable after setting up your API Key to retrieve data from the API */
const testNewsItemsData = [
  {
    source: {
      id: 'techcrunch',
      name: 'TechCrunch'
    },
    author: 'Brian Heater',
    title: 'Apple has halted Watch Series 9 and Ultra 2 online sales | TechCrunch',
    description: 'As promised, Apple has officially removed the Apple Watch Series 9 and Apple Watch Ultra 2 from its online shop.',
    url: 'https://techcrunch.com/2023/12/21/apple-has-halted-watch-series-9-and-ultra-2-online-sales/',
    urlToImage: 'https://techcrunch.com/wp-content/uploads/2023/09/Apple-Watch-Ultra-2-01.jpg?w=1200',
    publishedAt: '2023-12-21T21:51:58Z',
    content: 'As promised, Apple has officially removed the Watch Series 9 from its online shop. Word on the surprise move arrived earlier this week, when the company confirmed that an on-going patent dispute has … [+2690 chars]'
  },
  {
    source: {
      id: 'techcrunch',
      name: 'TechCrunch'
    },
    author: 'Brian Heater',
    title: 'Apple has halted Watch Series 9 and Ultra 2 online sales | TechCrunch',
    description: 'As promised, Apple has officially removed the Apple Watch Series 9 and Apple Watch Ultra 2 from its online shop.',
    url: 'https://techcrunch.com/2023/12/21/apple-has-halted-watch-series-9-and-ultra-2-online-sales/',
    urlToImage: 'https://techcrunch.com/wp-content/uploads/2023/09/Apple-Watch-Ultra-2-01.jpg?w=1200',
    publishedAt: '2023-12-21T21:51:58Z',
    content: 'As promised, Apple has officially removed the Watch Series 9 from its online shop. Word on the surprise move arrived earlier this week, when the company confirmed that an on-going patent dispute has … [+2690 chars]'
  }
]

const newsItems = ref([])
const showEmptyCuratedContentMessage = ref(false)

const substringsToReplace = {}
const requestUrl = ref('')

const getCustomizedTabNewsItems = () => {
  const definedCustomizations = isLocalStorageAvailable &&
    !!localStorage.getItem(CUSTOMIZATIONS_STORAGE_KEY) &&
    JSON.parse(localStorage.getItem(CUSTOMIZATIONS_STORAGE_KEY))

  if (definedCustomizations) {
    const { endpoint, ...otherCustomizations } = definedCustomizations
    let additionalParametersArray = []
    for (const [key, value] of Object.entries(otherCustomizations)) {
      additionalParametersArray.push(`${key}=${value}`)
    }

    substringsToReplace[props.tab.apiCallParameters[0]] = endpoint
    substringsToReplace[props.tab.apiCallParameters[1]] = additionalParametersArray.join('&')
    requestUrl.value = parse(props.url, substringsToReplace)

    /** TODO: Remove the the line below after setting up your API KEY and delete this comment */
    newsItems.value = [
      {
        source: {
          id: 'buzzfeed',
          name: 'Buzzfeed'
        },
        author: 'Melanie Aman',
        title: '37 Beauty Products Under $25 That Don\'t Skimp On Results',
        description: 'A heavy serving of getting more than you pay for ...don\'t mind if we do.View Entire Post ›',
        url: 'https://www.buzzfeed.com/melanie_aman/beauty-products-under-25-that-dont-skimp-on-results',
        urlToImage: 'https://img.buzzfeed.com/buzzfeed-static/static/2023-12/11/20/enhanced/46ff3dce9b4d/original-451-1702327901-3.jpg?crop=4205:2208;0,0%26downsize=1250:*',
        publishedAt: '2023-12-24T09:00:03Z',
        content: 'Psst! Bio-Oil contains retinol, which accelerates skin turnover but can make you more sensitive to the sun so don\'t forget your sunscreen!\r\nPromising review: \'I was skeptical of how amazing the revie… [+689 chars]'
      },
      {
        source: {
          id: 'hacker-news',
          name: 'Hacker News'
        },
        author: 'lesbaker',
        title: 'Deep cloning objects in JavaScript | Hacker News',
        description: null,
        url: 'https://news.ycombinator.com/item?id=38728435',
        urlToImage: null,
        publishedAt: '2023-12-24T05:47:01Z',
        content: 'There\'s a lot of reasoning for it, mostly summarized by \'this.abc and this.#abc are not the same fields\'.The goal of #-private properties in JS is to have total runtime isolation, so that there\'s no … [+738 chars]'
      }
    ]

    /** TODO: Uncomment after setting up your API KEY */
    // const { fetchedNewsItems, getNewsItems } = useNewsItems(requestUrl)
    // nextTick(async () => {
    //   await getNewsItems()
    //   newsItems.value = fetchedNewsItems.value
    // })
  }
}

if (props.tab.id === APPLICATION_TABS[2].id && props.retrieveCustomCuratedContent) {
  // get news items for customized tab
  getCustomizedTabNewsItems()
} else if (props.tab.id === APPLICATION_TABS[2].id && !props.retrieveCustomCuratedContent) {
  showEmptyCuratedContentMessage.value = !showEmptyCuratedContentMessage.value
} else {
  // get news items for other tabs
  /** Format the api url with the needed parameters */
  for (const key of props.tab.apiCallParameters) {
    substringsToReplace[key] = props.defaultSettings[key]
  }
  requestUrl.value = parse(props.url, substringsToReplace)

  // TODO: Remove the the line below after setting up your API KEY and delete this comment
  newsItems.value = testNewsItemsData

  /** TODO: Uncomment after setting up your API KEY */
  // const { fetchedNewsItems, getNewsItems } = useNewsItems(requestUrl)
  // nextTick(async () => {
  //   await getNewsItems()
  //   newsItems.value = fetchedNewsItems.value
  // })
}

const handleCustomizationsSave = (customizationsMade) => {
  getCustomizedTabNewsItems()
}

onMounted(() => {
  initModals()
})
</script>

<template>
  <div v-if="newsItems.length > 0">
    <button v-if="tab.id === APPLICATION_TABS[2].id && retrieveCustomCuratedContent && isLocalStorageAvailable"
      type="button" data-modal-target="feed-customization-modal" data-modal-toggle="feed-customization-modal"
      class="float-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
      Modify Customizations
    </button>
    <div class="flex flex-wrap lg:flex-row md:justify-center lg:gap-x-8 gap-y-8 clear-right">
      <NewsItem v-for="(newsItem, index) in newsItems" :key="`${newsItem.publishedAt}-${index}`" :newsItem="newsItem" />
    </div>
  </div>
  <div v-else-if="showEmptyCuratedContentMessage" class="flex flex-col items-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="w-40 w-40 md:w-52 md:h-52 lg:w-60 lg:h-60">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>

    <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Curate what you want to see!
    </h2>
    <p class="mb-3 md:mb-6 lg:mb-10 text-gray-500 dark:text-gray-400">It is looking a little lonely in here. {{
      isLocalStorageAvailable ? 'Let\'s set up some data to get the news items you want to see.'
      : 'Unfortunately, your browser does not support this feature.' }}
    </p>

    <button v-if="isLocalStorageAvailable" type="button" data-modal-target="feed-customization-modal"
      data-modal-toggle="feed-customization-modal"
      class="justify-self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
      Set up custom feed
    </button>
  </div>
  <div v-else> Ooops! There is nothing to show.</div>

  <Teleport to="#modalTarget">
    <FeedCustomizationModal v-if="isLocalStorageAvailable && (showEmptyCuratedContentMessage || (retrieveCustomCuratedContent && newsItems.length > 0 && tab.id === APPLICATION_TABS[2].id))" :default-app-settings="defaultSettings"
      @save-customizations="handleCustomizationsSave" />
  </Teleport>
</template>