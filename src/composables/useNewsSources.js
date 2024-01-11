import { computed, ref } from 'vue'
import { parse } from '../utils/dynamic-string-parser'

const useNewsSources = (initQueryString = '') => {
  const newsSources = ref([])
  const queryString = ref(initQueryString)

  const baseUrl = computed(() => `https://newsapi.org/v2/top-headlines/sources${queryString.value.length > 0 ? '?' + queryString.value : ''}`)

  async function getNewsSources() {
    try {
      const apiResponse = await fetch(baseUrl.value, {
        headers: {
          'X-Api-Key': import.meta.env.VITE_NEWS_API_KEY
        }
      })
      const data = await apiResponse.json()
      newsSources.value = data.sources
    } catch (error) {

    }
  }

  return {
    newsSources,
    getNewsSources
  }
}

export default useNewsSources