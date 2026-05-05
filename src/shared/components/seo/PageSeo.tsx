import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface PageSeoProps {
  title?: string
  noIndex?: boolean
  isHome?: boolean
}

const BASE_TITLE = 'meet·time'
const SITE_URL = 'https://meet.chuseok22.com'

export default function PageSeo({ title, noIndex = false, isHome = false }: PageSeoProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('ko') ? 'ko' : 'en'
  const description = t('seo.baseDescription')
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'meet·time',
    url: SITE_URL,
    description,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    inLanguage: lang === 'ko' ? 'ko-KR' : 'en',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={t('seo.ogDescription')} />
      <meta property="og:locale" content={lang === 'ko' ? 'ko_KR' : 'en_US'} />
      <meta property="og:locale:alternate" content={lang === 'ko' ? 'en_US' : 'ko_KR'} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {isHome && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
