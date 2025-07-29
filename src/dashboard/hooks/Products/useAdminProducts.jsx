import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";

const useAdminProducts = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuthContext();
  const { language } = useLanguage();

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const perPage = parseInt(searchParams.get("per_page")) || 10;

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      config.headers["Accept-Language"] = language;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [language]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("per_page", perPage);
      params.append("page", page);
      params.append("with", "images,category,variants");

      const response = await axios.get(
        `https://le-souk.dinamo-app.com/api/admin/products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data.data);
      setTotalPages(response.data.meta.last_page || 1);
      setTotalCount(response.data.meta.total);
      setCurrentPage(response.data.meta.current_page);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch products";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [language, searchParams]);

  const addProduct = async (formData) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.post(
        "https://le-souk.dinamo-app.com/api/admin/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts((prev) => [...prev, response.data.data]);
      toast.success("Product added successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add product";
      toast.error(errorMessage);
      return false;
    }
  };

  const updateProduct = async (productId, formData, section) => {
  try {
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    let url = "";
    let body = formData;
    let contentType = "multipart/form-data";

    switch (section) {
      case "basic":
        url = `https://le-souk.dinamo-app.com/api/admin/products/${productId}`;
        contentType = "application/json";
        
        const categoryIds = Array.from(formData.entries())
          .filter(([key]) => key.startsWith("categories["))
          .map(([, value]) => value);

       
        const categories = categoryIds.length > 0 ? { id: parseInt(categoryIds[0]) } : null;

        body = {
          status: formData.get("status") || "active",
          en: {
            name: formData.get("en[name]") || "",
            description: formData.get("en[description]") || "",
          },
          ar: {
            name: formData.get("ar[name]") || "",
            description: formData.get("ar[description]") || "",
          },
          ...(categories && { categories })
        };
        break;
        
      case "variants":
        url = `https://le-souk.dinamo-app.com/api/admin/products/${productId}/variants`;
        contentType = "application/json";
        const variants = [];
        formData.forEach((value, key) => {
          const match = key.match(/variants\[(\d+)\]\[(\w+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!variants[index]) variants[index] = {};
            variants[index][field] = value;
          }
        });
        body = {
          variants: variants.filter((v) => Object.keys(v).length > 0),
        };
        break;
        
      default:
        throw new Error("Invalid section");
    }

    const response = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
      },
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? response.data.data : p))
    );
    toast.success(`Product ${section} updated successfully!`);
    
    await fetchProducts();
    return true;
  } catch (err) {
    console.error("Error details:", err);
    const errorMessage =
      err.response?.data?.message || `Failed to update product ${section}`;
    toast.error(errorMessage);
    return false;
  }
};

  const updateProductImages = async (productId, formData) => {
    try {
      const imagesToAdd = [];
      const imagesToRemove = [];

      let index = 0;
      while (formData.has(`images[${index}]`)) {
        const image = formData.get(`images[${index}]`);
        imagesToAdd.push(image);
        index++;
      }

      index = 0;
      while (formData.has(`product_image_ids[${index}]`)) {
        const id = formData.get(`product_image_ids[${index}]`);
        imagesToRemove.push(id);
        index++;
      }

      if (imagesToAdd.length === 0 && imagesToRemove.length === 0) {
        console.log("No image changes to update.");
        return true;
      }

      const newFormData = new FormData();
      imagesToAdd.forEach((image, index) =>
        newFormData.append(`images[${index}]`, image)
      );
      imagesToRemove.forEach((id, index) =>
        newFormData.append(`product_image_ids[${index}]`, id)
      );
      newFormData.append("_method", "PUT");

      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/products/${productId}/images`,
        newFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? response.data.data : p))
      );
      toast.success(`Product images updated successfully!`);
      await fetchProducts();
      return true;
    } catch (err) {
      console.error("Error details:", err);
      console.log("API Error Response:", err.response?.data);
      const errorMessage =
        err.response?.data?.message || "Failed to update product images";
      toast.error(errorMessage);
      return false;
    }
  };

  const setPrimaryImage = async (productId, productImageId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.put(
        `https://le-souk.dinamo-app.com/api/admin/products/${productId}/images/${productImageId}/primary`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      await fetchProducts();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to set primary image";
      toast.error(errorMessage);
      return false;
    }
  };

  const addProductDiscount = async (productId, discountData) => {
    try {
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.put(
        `https://le-souk.dinamo-app.com/api/admin/products/${productId}/discount`,
        discountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Discount added successfully!");
      await fetchProducts();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add discount";
      toast.error(errorMessage);
      return false;
    }
  };

  const assignImagesToVariant = async (
    productId,
    productVariantId,
    productImageIds
  ) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.put(
        `https://le-souk.dinamo-app.com/api/admin/products/${productId}/images/assign`,
        {
          product_image_ids: productImageIds,
          product_variant_id: productVariantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response.data.message || "Images assigned to variant successfully!"
      );
      await fetchProducts();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to assign images to variant";
      toast.error(errorMessage);
      return false;
    }
  };

  const IsFeaturedProduct = async (productId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const response = await axios.post(
        `https://le-souk.dinamo-app.com/api/admin/products/${productId}/toggle-featured`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || "Product featured status updated!");
      await fetchProducts();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update featured status";
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.delete(
        `https://le-souk.dinamo-app.com/api/admin/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Product deleted successfully!");

      setProducts((prev) => prev.filter((p) => p.id !== productId));

      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    products,
    addProduct,
    updateProduct,
    updateProductImages,
    setPrimaryImage,
    addProductDiscount,
    assignImagesToVariant,
    deleteProduct,
    IsFeaturedProduct,
    loading,
    error,
    totalPages,
    totalCount,
    currentPage,
    search,
    page,
  };
};

export default useAdminProducts;
