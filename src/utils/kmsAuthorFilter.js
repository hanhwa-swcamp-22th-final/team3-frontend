const EXCLUDED_KMS_AUTHORS = new Set(['Batch-Test-Worker', '최상위관리자'])

export function isVisibleKmsAuthor(authorName) {
  return !EXCLUDED_KMS_AUTHORS.has(authorName ?? '')
}

export function filterVisibleKmsAuthors(items, getAuthorName) {
  return items.filter((item) => isVisibleKmsAuthor(getAuthorName(item)))
}
