import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

function Meta({
  title = "MySite",
  description = "Welcome to MySite",
  keywords = "ecommerce, shop, online store",
  image = "/favicon.jpg",
  url,
  children,
}) {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const fullTitle = `${title} | Le-Souk`;

  return (
    <Helmet key={location.pathname}>
      {/* Title & Description */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Favicon */}
      <link rel="icon" href={image} type="image/jpg" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {children}
    </Helmet>
  );
}

export default Meta;
