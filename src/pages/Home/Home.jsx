import React from 'react'
import HeroSection from '../../components/Home Components/HomeSwiper/HeroSection';
import Categories from '../../components/Home Components/Categories/Categories';
import Products from '../../components/Home Components/Products/Products';

const Home = () => {
  return (
    <React.Fragment>
      <HeroSection />
      <Categories />
      <Products />
    </React.Fragment>
  )
}

export default Home
