import React, { useEffect } from "react";
import HeroSection from "../../components/Home Components/HomeSwiper/HeroSection";
import Categories from "../../components/Home Components/Categories/Categories";
import Products from "../../components/Home Components/Products/Products";
import { useLanguage } from "../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";
import Offers from "../../components/Home Components/Offers/Offers";
import HomePackages from "../../components/Home Components/Packages/HomePackages";
import WeaklyOffers from "../../components/Home Components/WeaklyOffers/WeaklyOffers";
import Meta from "../../components/Meta/Meta";

const Home = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        <Meta
          title={t("home")}
          description={
            language === "ar"
              ? "تسوق الموضة الفاخرة المستعملة والجديدة في لو سوك. اكتشف أنماطًا فريدة، أضف إلى قائمة الأمنيات، واستمتع بتجربة تسوق سلسة بالعربية والإنجليزية."
              : "Shop luxury pre-owned & new fashion at Le-Souk. Discover unique styles, add to your wishlist, and enjoy a seamless shopping experience in Arabic & English."
          }
          keywords={
            language === "ar"
              ? "موضة فاخرة, مستعمل, تسوق أونلاين, لو سوك, عربي, إنجليزي"
              : "luxury fashion, pre-owned, online shopping, Le-Souk, Arabic, English"
          }
          image="/images/le-souk-banner.jpg"
        >
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Le-Souk",
                "url": "https://le-souk.vercel.app/",
                "description": "${
                  language === "ar"
                    ? "تسوق الموضة الفاخرة المستعملة والجديدة في لو سوك. اكتشف أنماطًا فريدة بالعربية والإنجليزية."
                    : "Shop luxury pre-owned & new fashion at Le-Souk. Discover unique styles in Arabic & English."
                }",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://le-souk.vercel.app/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            `}
          </script>
        </Meta>
        <HeroSection />
        <Categories />
        <WeaklyOffers />
        <Products />
        <Offers />
        <HomePackages perPage={5} />
      </div>
    </React.Fragment>
  );
};

export default Home;
