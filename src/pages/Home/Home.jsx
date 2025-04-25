import React from 'react'
import HomeSwiper from './../../components/Home Components/HomeSwiper/HomeSwiper';
import Categories from '../../components/Home Components/Categories/Categories';
import Products from '../../components/Home Components/Products/Products';

const Home = () => {
  return (
    <React.Fragment>
      <HomeSwiper />
      <Categories />
      <Products />
    </React.Fragment>
  )
}

export default Home
