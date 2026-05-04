import { Helmet } from 'react-helmet-async'

interface PageSeoProps {
  title?: string
  description?: string
  noIndex?: boolean
}

const BASE_TITLE = 'meet·time'
const BASE_DESCRIPTION = '모두가 되는 시간을 찾아드려요. 방을 만들고 참여자들의 가능한 시간대를 한눈에 확인하세요.'

export default function PageSeo({ title, description, noIndex = false }: PageSeoProps) {
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? BASE_DESCRIPTION} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}
