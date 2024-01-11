import { ref } from 'vue'

const useNewsItems = (initialUrl = '') => {
	const fetchedNewsItems = ref([])
	const url = ref(initialUrl)
	const count = ref(0)

	async function getNewsItems() {
		try {
			const apiResponse = await fetch(url.value, {
				headers: {
					'X-Api-Key': import.meta.env.VITE_NEWS_API_KEY
				}
			})
			const data = await apiResponse.json()
			fetchedNewsItems.value = data.articles
			count.value = data.totalResults
		} catch (error) {

		}
	}

	return {
		fetchedNewsItems,
		getNewsItems
	}
}

export default useNewsItems