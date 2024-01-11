<script setup>
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import * as updateLocale from 'dayjs/plugin/updateLocale'
import { computed } from 'vue'

import NoImageAvailablePlaceholder from '../assets/no-image-available.png'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: 'a few seconds',
    m: "a minute",
    mm: "%d minutes",
    h: "anh",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})

const props = defineProps({
  newsItem: {
    type: Object,
    default: () => ({})
  },
})

const timeSincePublicationDate = computed(() => dayjs(props.newsItem.publishedAt).fromNow(true))

</script>

<template>
  <a :href="newsItem.url"
    class="flex flex-col bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
    <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
      :src="!!newsItem.urlToImage ? newsItem.urlToImage : NoImageAvailablePlaceholder" alt="">
    <div class="flex flex-col justify-between p-4 leading-normal">
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ newsItem.title }}</h2>
      <p class="mb-3 text-base text-gray-700 dark:text-gray-400">{{ newsItem.description }}</p>
      <p class="text-sm text-gray-700 dark:text-gray-400">{{ newsItem.source.name }} . {{ timeSincePublicationDate }}</p>
    </div>
  </a>
</template>
