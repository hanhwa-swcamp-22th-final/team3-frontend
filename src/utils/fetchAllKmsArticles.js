const DEFAULT_PAGE_SIZE = 100
const MAX_PAGE_COUNT = 50

export default async function fetchAllKmsArticles(getArticles, params = {}) {
  const pageSize = Math.max(1, Number(params.size ?? DEFAULT_PAGE_SIZE))
  const articles = []

  for (let page = 0; page < MAX_PAGE_COUNT; page += 1) {
    const response = await getArticles({
      ...params,
      page,
      size: pageSize,
    })
    const batch = response?.data?.data ?? []

    if (!Array.isArray(batch) || batch.length === 0) {
      break
    }

    articles.push(...batch)

    if (batch.length < pageSize) {
      break
    }
  }

  return articles
}
