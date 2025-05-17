import React from "react";
import { useParams } from "react-router-dom";
import useCategories from "../../../hooks/Categories/useCategories";
import ProductCard from "./ProductCard";
import Loader from "../../../layouts/Loader";

const CategoryId = () => {
  const { categoryId } = useParams();
  const { category, loading, error, getTranslatedText } = useCategories(
    null,
    null,
    categoryId
  );

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-4 text-red-600">خطأ: {error}</div>;
  if (!category) return <div className="text-center py-4">لا توجد بيانات</div>;

  return (
    <div className="">
      <div className="bg-[#1e70d0] text-white text-center py-20 mb-6">
        <h2 className="text-2xl font-bold">{category.name}</h2>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-12">
          {category.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              getTranslatedText={getTranslatedText}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryId;
