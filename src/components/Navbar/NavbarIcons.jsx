import React from "react";
import { ShoppingCart, Heart } from "lucide-react";
import LanguageDropdown from "../Language/LanguageDropdown";

const NavbarIcons = ({
  handleCartClick,
  handleWishlistClick,
  cartCount,
  wishlistCount,
  isWhite = false,
}) => (
  <div className="flex gap-4 items-center">
    <LanguageDropdown />

    <button
      onClick={handleCartClick}
      className="p-2 rounded border text-[#333e2c] border-gray-300 bg-[#f3f3f3] transition duration-200 cursor-pointer relative"
      title="Shopping Cart"
    >
      <ShoppingCart size={20} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
          {cartCount}
        </span>
      )}
    </button>
    <button
      onClick={handleWishlistClick}
      className="p-2 rounded border text-[#333e2c] border-gray-300 bg-[#f3f3f3] transition duration-200 cursor-pointer relative"
      title="WishList"
    >
      <Heart size={20} />
      {wishlistCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
          {wishlistCount}
        </span>
      )}
    </button>
  </div>
);

export default NavbarIcons;
