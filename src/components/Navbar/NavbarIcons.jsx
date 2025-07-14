import React from "react";
import { ShoppingCart, Heart } from "lucide-react";
import LanguageDropdown from "../Language/LanguageDropdown";

const NavbarIcons = ({
  handleCartClick,
  handleWishlistClick,
  cartCount,
  wishlistCount,
  children,
  isLoggedIn,
  isWhite = false,
}) => (
  <div className="flex gap-4 items-center">
    <LanguageDropdown />
  
        <button
          onClick={handleCartClick}
          className="p-2 rounded border text-[#333e2c] border-gray-300 transition duration-200 cursor-pointer relative"
        >
          <ShoppingCart
            size={20}
            className={isWhite ? "text-white" : " text-[#333e2c]"}
          />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {cartCount}
            </span>
          )}
        </button>
          {isLoggedIn && (
      <>
        <button
          onClick={handleWishlistClick}
          className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer relative"
        >
          <Heart
            size={20}
            className={isWhite ? "text-white" : "text-gray-500"}
          />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {wishlistCount}
            </span>
          )}
        </button>
      </>
    )}
    {children}
  </div>
);

export default NavbarIcons;
