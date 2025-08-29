import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../context/Auth/AuthContext";

const BASE_URL = "https://le-souk.dinamo-app.com/api/";

const usePaymentManagement = () => {
  const { token } = useAuthContext();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}admin/payment-management/methods`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentMethods(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch payment settings
  const fetchPaymentSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}admin/payment-management/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentSettings(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update payment method fees
  const updatePaymentMethodFees = async (paymentMethodId, feeData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}admin/payment-management/methods/${paymentMethodId}/fees`,
        feeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentMethods((prevMethods) =>
        prevMethods.map((method) =>
          method.id === paymentMethodId
            ? { ...method, fees: response.data.data.fees }
            : method
        )
      );

      toast.success(response.data.message || "Fees updated successfully!");
      setError(null);
      return response.data;
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // Update payment settings
  const updatePaymentSettings = async (settingsData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}admin/payment-management/settings`,
        { settings: settingsData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentSettings(response.data.data);
      toast.success(response.data.message || "Fees updated successfully!");
      await fetchPaymentSettings();
      setError(null);
      return response.data;
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
    fetchPaymentSettings();
  }, []);

  return {
    paymentMethods,
    paymentSettings,
    loading,
    error,
    fetchPaymentMethods,
    fetchPaymentSettings,
    updatePaymentMethodFees,
    updatePaymentSettings,
  };
};

export default usePaymentManagement;
