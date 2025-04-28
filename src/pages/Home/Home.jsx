import React from "react";
import HeroSection from "../../components/Home Components/HomeSwiper/HeroSection";
import Categories from "../../components/Home Components/Categories/Categories";
import Products from "../../components/Home Components/Products/Products";
import { useLanguage } from "../../context/Language/LanguageContext";

const Home = () => {
  const { language } = useLanguage();
  return (
    <React.Fragment>
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        <HeroSection />
        <Categories />
        <Products />
      </div>
    </React.Fragment>
  );
};

export default Home;
