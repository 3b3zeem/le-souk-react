import React, { useEffect } from "react";
import HeroSection from "../../components/Home Components/HomeSwiper/HeroSection";
import Categories from "../../components/Home Components/Categories/Categories";
import Products from "../../components/Home Components/Products/Products";
import { useLanguage } from "../../context/Language/LanguageContext";
import Offers from "../../components/Home Components/Offers/Offers";
import HomePackages from "../../components/Home Components/Packages/HomePackages";
import WeaklyOffers from "../../components/Home Components/WeaklyOffers/WeaklyOffers";
import Meta from "../../components/Meta/Meta";

const Home = () => {
  const { language } = useLanguage();
  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        <Meta
          title=""
          description="Discover the best products and offers at Le-Souk."
        />
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
