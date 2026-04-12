import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate, formatDateTime, formatNumber, formatTime } from '../i18n/format'

const LANGUAGE_TO_LOCALE: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
}

function resolveLocale(language: string): string {
  if (LANGUAGE_TO_LOCALE[language]) return LANGUAGE_TO_LOCALE[language]
  // Fall back to the base language code if the user picked a regional variant
  // we don't explicitly map (e.g. "en-GB" -> "en-GB", "pt-BR" -> "pt-BR").
  const base = language.split('-')[0]
  return LANGUAGE_TO_LOCALE[base] ?? language
}

export function useFormat() {
  const { i18n } = useTranslation()
  const locale = resolveLocale(i18n.language)

  const formatDateLocalized = useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions) =>
      formatDate(date, locale, options),
    [locale],
  )

  const formatDateTimeLocalized = useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions) =>
      formatDateTime(date, locale, options),
    [locale],
  )

  const formatTimeLocalized = useCallback(
    (date: Date) => formatTime(date, locale),
    [locale],
  )

  const formatNumberLocalized = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, locale, options),
    [locale],
  )

  return {
    locale,
    formatDate: formatDateLocalized,
    formatDateTime: formatDateTimeLocalized,
    formatTime: formatTimeLocalized,
    formatNumber: formatNumberLocalized,
  }
}
