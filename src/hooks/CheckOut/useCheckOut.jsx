const usePayment = () => {
  const sendPayment = async ({
    name,
    email,
    phone,
    cartItems,
    subtotal,
    streetAddress,
    townCity,
    zipCode,
    country,
    state,
  }) => {
    try {
      const countryCodes = {
        KW: "+965", // Kuwait
        EG: "+20", // Egypt
        SA: "+966", // Saudi Arabia
        AE: "+971", // United Arab Emirates
        QA: "+974", // Qatar
        BH: "+973", // Bahrain
        OM: "+968", // Oman
        JO: "+962", // Jordan
        LB: "+961", // Lebanon
        SY: "+963", // Syria
        IQ: "+964", // Iraq
        PS: "+970", // Palestine
        YE: "+967", // Yemen
        SD: "+249", // Sudan
        MA: "+212", // Morocco
        DZ: "+213", // Algeria
        TN: "+216", // Tunisia
        LY: "+218", // Libya
        MR: "+222", // Mauritania
        DJ: "+253", // Djibouti
        SO: "+252", // Somalia
        KM: "+269", // Comoros
        US: "+1", // United States (kept for completeness)
      };
      const mobileCountryCode = countryCodes[country] || "+965";

      const res = await fetch("http://localhost:5000/send-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL",
        },
        body: JSON.stringify({
          CustomerName: name,
          InvoiceValue: subtotal,
          CallBackUrl: "https://example.com/success",
          ErrorUrl: "https://example.com/error",
          Language: "en",
          CustomerEmail: email,
          MobileCountryCode: mobileCountryCode,
          CustomerMobile: phone,
          DisplayCurrencyIso: "KWD",
          NotificationOption: "LNK",
          InvoiceItems: cartItems.map((item) => ({
            ItemName: item.product.name,
            Quantity: item.quantity,
            UnitPrice: item.unit_price,
          })),
          BillingAddress: {
            StreetAddress: streetAddress,
            TownCity: townCity,
            ZipCode: zipCode,
            Country: country,
            State: state,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.Message || "Payment request failed.");
      }

      return data;
    } catch (error) {
      console.error("Payment Error:", error.message);
      throw new Error(error.message || "Something went wrong.");
    }
  };

  return { sendPayment };
};

export default usePayment;
