import { useEffect } from 'react'
import styles from './AdBanner.module.css'

interface AdBannerProps {
  adSlot: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdBanner({ adSlot }: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // 개발 환경 등에서 초기화 실패 시 무시
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9478132403157565"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
