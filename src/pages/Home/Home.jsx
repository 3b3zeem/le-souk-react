import React from "react";
import HeroSection from "../../components/Home Components/HomeSwiper/HeroSection";
import Categories from "../../components/Home Components/Categories/Categories";
import Products from "../../components/Home Components/Products/Products";
import { useLanguage } from "../../context/Language/LanguageContext";
import Offers from "../../components/Home Components/Offers/Offers";
import HomePackages from "../../components/Home Components/Packages/HomePackages";

const Home = () => {
  const { language } = useLanguage();
  return (
    <React.Fragment>
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        <HeroSection />
        <Categories />
        <Products />
        <Offers perPage={20} />
        <HomePackages perPage={5} />
      </div>
    </React.Fragment>
  );
};

export default Home;
