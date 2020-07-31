import { ApiFetch } from '../logic/ApiFetch'
import { useMemo, useEffect } from 'react'
import { makeWikiApiOptions, toBreed } from '../utils'
import { useInstance } from '@objects/hooks'
import { ArticleData, ArticleApiResponse } from '../types'

const articleCache: Record<string, ArticleData> = {}

export const useArticleLink = (breed: string) => {
  const apiOptions = useMemo(
    () =>
      makeWikiApiOptions<ArticleData, ArticleApiResponse>(
        ([search, terms, _, articles]) => ({
          href: articles[0],
          title: terms[0],
        })
      ),
    []
  )
  const [article] = useInstance(ApiFetch, [], apiOptions)

  const load = async () => {
    if (articleCache[breed]) {
      article.update(Promise.resolve(articleCache[breed]))
      return
    }

    const terms = breed.split(' ')

    const possibleTerms = [
      `${breed} dog`,
      `${toBreed(terms.reverse())} dog`,
      `${toBreed(terms.reverse())}`,
      breed,
    ]

    let termCounter = 0

    do {
      await article.fetch(
        `action=opensearch&search=${encodeURIComponent(
          possibleTerms[termCounter++]
        )}&limit=1&namespace=0`
      )
    } while (
      !article.data?.href &&
      !article.error &&
      termCounter < possibleTerms.length
    )

    if (!article.data?.href) {
      article.update(Promise.reject(new Error(`Couldnt find ${breed} on wikipedia`)))
    }

    if (!article.error && article.data) {
      articleCache[breed] = article.data
    }
  }

  useEffect(() => {
    load()
  }, [article, breed])

  return { article }
}
