import {
  EMAIL_DISPLAY,
  LOGO_SQUARE_URL,
  SUPPORT_PHONE_DISPLAY,
} from '@/lib/products'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalBusiness',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}${LOGO_SQUARE_URL}`,
        image: `${SITE_URL}${LOGO_SQUARE_URL}`,
        description: SITE_DESCRIPTION,
        telephone: SUPPORT_PHONE_DISPLAY.replace(/\s/g, ''),
        email: EMAIL_DISPLAY,
        areaServed: [
          { '@type': 'Country', name: 'Kenya' },
          { '@type': 'Country', name: 'Uganda' },
          { '@type': 'Country', name: 'Tanzania' },
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KE',
          addressLocality: 'Nairobi',
        },
        sameAs: ['https://www.facebook.com/profile.php?id=61590708625873'],
        knowsAbout: [
          'Laboratory equipment',
          'Hematology analysers',
          'Chemistry analysers',
          'Microscopes',
          'Autoclaves',
          'Hospital medical equipment',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-KE',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
