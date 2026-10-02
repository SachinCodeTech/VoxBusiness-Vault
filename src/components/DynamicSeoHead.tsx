import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const DynamicSeoHead: React.FC = () => {
  const {
    selectedCity,
    selectedArea,
    filters,
    categories,
    filteredVendors,
    activeTab
  } = useApp();

  useEffect(() => {
    // 1. Resolve Category and Area
    const categoryObj = categories.find((c) => c.id === filters.category);
    const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === filters.subcategory);

    let title = 'Vox Business Vault - Gujarat Local Services Directory';
    let description =
      'Find trusted local services across Gujarat. Direct calling, WhatsApp, verified businesses, permanent QR codes, and zero brokerage.';
    let schemaType = 'WebSite';

    const locationString = selectedArea
      ? `${selectedArea}, ${selectedCity}, Gujarat`
      : `${selectedCity}, Gujarat`;

    if (activeTab === 'categories') {
      title = `All Service Categories in ${locationString} – Vox Business Vault`;
      description = `Browse verified repair, home, beauty, and professional service categories in ${locationString}. Zero brokerage direct connects.`;
    } else if (activeTab === 'map') {
      title = `Interactive Local Map Search in ${locationString} – Vox Business Vault`;
      description = `Locate verified service providers, shops, and technicians on the GPS map in ${locationString}.`;
    } else if (activeTab === 'saved') {
      title = `Saved Local Businesses & Services – Vox Business Vault`;
      description = `Quickly access your bookmarked and favorite verified businesses in Gujarat.`;
    } else if (activeTab === 'portal') {
      title = `Gujarat Business Portal & Vendor Hub – Vox Business Vault`;
      description = `Register and manage your local Gujarat business listing with zero brokerage and digital verified QR codes.`;
    } else if (filters.query.trim()) {
      title = `"${filters.query.trim()}" in ${locationString} – Verified Search | Vox Business Vault`;
      description = `Explore top results for "${filters.query.trim()}" in ${locationString}. Compare ratings, call directly, or chat on WhatsApp.`;
    } else if (categoryObj) {
      const catName = categoryObj.name;
      const subName = subcategoryObj?.name;
      const gujName = categoryObj.gujaratiName;

      if (subName) {
        title = `${subName} (${catName}) in ${locationString} – Verified Services | Vox Business Vault`;
        description = `Find verified ${subName.toLowerCase()} specialists in ${locationString}. Direct phone & WhatsApp connect with zero commission.`;
      } else {
        title = `${catName}s in ${locationString} (${gujName}) – Verified Directory | Vox Business Vault`;
        description = `Find trusted and verified ${catName.toLowerCase()}s in ${locationString}. Fast direct calls, WhatsApp chat, and authentic local ratings.`;
      }
      schemaType = 'ItemList';
    } else {
      title = `Trusted Local Services in ${locationString} – Vox Business Vault`;
      description = `Connect directly with verified local businesses, tapris, salons, and repair technicians in ${locationString}. 100% direct connect.`;
    }

    // 2. Set document title
    document.title = title;

    // Helper to safely set or create meta tag
    const updateMeta = (selector: string, attr: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, attrValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 3. Inject standard SEO meta
    updateMeta('meta[name="description"]', 'name', 'description', description);

    // 4. Inject OpenGraph tags
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    updateMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    updateMeta('meta[property="og:locale"]', 'property', 'og:locale', 'en_IN');

    // 5. Inject Twitter tags
    updateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    // 6. Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    // 7. Dynamic Schema.org JSON-LD Structured Data
    let schemaScript = document.getElementById('vox-seo-jsonld') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'vox-seo-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const structuredData =
      schemaType === 'ItemList' && categoryObj
        ? {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${categoryObj.name} in ${locationString}`,
            description,
            itemListElement: filteredVendors.slice(0, 10).map((v, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              item: {
                '@type': 'LocalBusiness',
                name: v.businessName,
                telephone: v.phone,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: v.address,
                  addressLocality: v.area,
                  addressRegion: v.city,
                  addressCountry: 'IN'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: v.rating,
                  reviewCount: v.reviewCount || 1
                }
              }
            }))
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Vox Business Vault',
            alternateName: 'Gujarat Local Hyperlocal Business Registry',
            url: window.location.origin,
            description,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${window.location.origin}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          };

    schemaScript.textContent = JSON.stringify(structuredData);
  }, [selectedCity, selectedArea, filters, categories, filteredVendors, activeTab]);

  return null;
};
