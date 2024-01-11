export const APPLICATION_TABS = [
  {
    name: 'Headlines',
    id: 'headlines-tab',
    target: '#headlines',
    ariaControls: 'headlines',
    apiCallURL: 'https://newsapi.org/v2/top-headlines?country={country}&category={category}',
    apiCallParameters: ['category', 'country']
  },
  {
    name: 'Explore',
    id: 'explore-tab',
    target: '#explore',
    ariaControls: 'explore',
    apiCallURL: 'https://newsapi.org/v2/everything?sources={sources}&language={language}&from={publicationDate}&sortBy=popularity',
    apiCallParameters: ['sources', 'language', 'publicationDate']
  },
  {
    name: 'Curated for me',
    id: 'curated-for-me-tab',
    target: '#curatedForMe',
    ariaControls: 'curatedForMe',
    apiCallURL: 'https://newsapi.org/v2/{endpoint}?{additional_query_parameters}',
    apiCallParameters: ['endpoint', 'additional_query_parameters']
  }
]

export const SOURCES_RETRIEVAL_PARAMETERS = [
  {
    parameterName: 'Category',
    value: 'category',
    description: 'Get sources that display news of default category'
  },
  {
    parameterName: 'Country',
    value: 'country',
    description: 'Get sources that display news in a specific country'
  },
  {
    parameterName: 'Language',
    value: 'language',
    description: 'Get sources that display news in a specific language'
  }
]

export const INITIAL_SETUP_INFORMATION = {
  activeTabName: APPLICATION_TABS[0].name,
  country: 'Canada',
  language: 'English',
  category: 'Technology',
  sourcesRetrievalParameters: [SOURCES_RETRIEVAL_PARAMETERS[2].value],
  sources: ['techcrunch', 'hacker-news', 'bloomberg', 'buzzfeed', 'entertainment-weekly', 'mashable'],
  publishedXTimeAgo: {
    number: '2',
    duration: 'days'
  }
}

export const ENDPOINTS = [
  {
    endpointName: 'Everything',
    endpointValue: 'everything'
  },
  {
    endpointName: 'Top headlines',
    endpointValue: 'top-headlines'
  }
]

export const SORTING_ORDERS = [
  {
    name: 'Relevance to keyword / phrase',
    sortingOrderValue: 'relevancy',
    isDefault: false
  },
  {
    name: 'Popular sources',
    sortingOrderValue: 'popularity',
    isDefault: false
  },
  {
    name: 'Newest first',
    sortingOrderValue: 'publishedAt',
    isDefault: true
  }
]

export const APP_DEFAULTS_STORAGE_KEY = 'appDefaults'
export const CUSTOMIZATIONS_STORAGE_KEY = 'customizations'