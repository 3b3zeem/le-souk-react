import { ChevronRight, Heart, House, ShoppingCart, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useWishlistCRUD from "../../hooks/WishList/useWishlist";
import useCartCRUD from "../../hooks/Cart/UseCart";

const colors = {
  primary: "#1e70d0",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
};

const WishList = () => {
  const {
    wishlistItems,
    fetchWishlist,
    removeFromWishlist,
    clearWishlist,
    success: wishlistSuccess,
  } = useWishlistCRUD();
  const { addToCart } = useCartCRUD();
  const [loadingStates, setLoadingStates] = useState({
    remove: {},
    addToCart: {},
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (wishlistSuccess) {
      toast.success(wishlistSuccess);
    }
  }, [wishlistSuccess]);

  const handleRemove = async (productId) => {
    setLoadingStates((prev) => ({
      ...prev,
      remove: { ...prev.remove, [productId]: true },
    }));

    try {
      await removeFromWishlist(productId);
      await fetchWishlist();
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove item from wishlist.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        remove: { ...prev.remove, [productId]: false },
      }));
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    setLoadingStates((prev) => ({
      ...prev,
      cart: { ...prev.cart, [productId]: true },
    }));
    try {
      await addToCart(productId, quantity);
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        cart: { ...prev.cart, [productId]: false },
      }));
    }
  };

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  return (
    <React.Fragment>
      <div className="bg-gray-200 p-10 mb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.productTitle }}
          >
            MY WISHLIST
          </h1>
          <div className="flex items-center text-gray-600 gap-1">
            <House
              onClick={() => navigate("/")}
              size={20}
              className="cursor-pointer"
            />
            <ChevronRight size={20} />
            <span className="text-[17px]">Wishlist</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart
              size={64}
              className="mb-4"
              style={{ color: colors.productName, opacity: 0.3 }}
            />
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: colors.productTitle }}
            >
              Your Wishlist is Empty
            </h2>
            <p
              className="text-sm mb-6 max-w-md"
              style={{ color: colors.productName }}
            >
              Looks like you haven't added any items to your wishlist yet.
              Explore our collection and find something you love!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="py-3 px-6 rounded-md customEffect cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
            >
              <span>Continue Shopping</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="border-b-1 border-gray-300">
              <button
                onClick={handleClearWishlist}
                className="px-4 py-2 bg-red-500 mb-5  text-white rounded-md customEffect cursor-pointer"
              >
                <span>Clear Wishlist</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8 mt-5">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-6">
                {wishlistItems.map((item) => {
                  const isRemoving = loadingStates.remove[item.id] || false;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b pb-6"
                      style={{ borderColor: colors.borderLight }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1">
                        <h2
                          className="font-semibold"
                          style={{ color: colors.productName }}
                        >
                          {item.name}
                        </h2>
                        <p
                          className="text-sm"
                          style={{ color: colors.productName }}
                        >
                          ITEM NO: {item.id}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.productName }}
                        >
                          SIZE: OS
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.productName }}
                        >
                          COLOR: Unknown
                        </p>
                      </div>
                      <div className="flex flex-col justify-between items-center">
                        <p
                          className="text-lg font-semibold"
                          style={{ color: colors.primary }}
                        >
                          ${Number(item.price).toFixed(2)}
                        </p>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAddToCart(item.id, 1)}
                            disabled={loadingStates.addToCart[item.id]}
                            className={` text-white font-bold py-2 px-4 rounded cursor-pointer customEffect mt-2 ${
                              loadingStates.addToCart[item.id]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            style={{ backgroundColor: colors.primary }}
                          >
                            <span>
                              {loadingStates.addToCart[item.id] ? (
                                "Adding..."
                              ) : (
                                <ShoppingCart size={18} />
                              )}
                            </span>
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={isRemoving}
                            className={`bg-[#d01e1e] text-white font-bold py-2 px-4 rounded cursor-pointer customEffect ${
                              isRemoving ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <span>
                              {isRemoving ? (
                                "Removing..."
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default WishList;
