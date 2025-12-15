import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = '∞7 — Цифровые Визитки',
  description = 'Создайте премиальную цифровую визитку с QR-кодом, аналитикой и реферальной программой за минуты',
  keywords = 'цифровая визитка, qr код, визитка онлайн, электронная визитка, бизнес визитка',
  image = 'https://cdn.poehali.dev/projects/666a7962-8495-4155-b108-1b12b4677071/files/8ec97e6a-6455-4354-ad55-f52d74d1d2e3.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
}: SEOProps) => {
  const fullTitle = title.includes('∞7') ? title : `${title} | ∞7`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="∞7 — Цифровые Визитки" />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
