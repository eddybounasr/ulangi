/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getApiUrl } from "./getApiUrl"
import { getApiKey } from "./getApiKey"
import { queryStringify } from "./queryStringify"
import { DictionaryEntry } from "@ulangi/ulangi-common/interfaces"

export function romaji(term: string): string {
  const apiUrl = getApiUrl()
  const apiKey = getApiKey()

  const response = UrlFetchApp.fetch(apiUrl + '/get-dictionary-entry?' + queryStringify({
    searchTerm: term,
    searchTermLanguageCode: "ja",
    translatedToLanguageCode: "en"
  }),
  {
    method: "get",
    headers: {
      Authorization: "Bearer " + apiKey
    },
    muteHttpExceptions: true
  })

  if (response.getResponseCode() === 200) {
    const { dictionaryEntry } : { dictionaryEmtru: DictionaryEntry } = JSON.parse(response.getContentText())

    if (typeof dictionaryEntry.romaji !== 'undefined'){
      return dictionaryEntry.romaji.join("\n")
    } else {
      return ''
    }
  }
  else if (response.getResponseCode() === 401) {
    throw new Error("The API key is invalid or expired.")
  }
  else {
    throw new Error(response.getContentText())
  }
}
