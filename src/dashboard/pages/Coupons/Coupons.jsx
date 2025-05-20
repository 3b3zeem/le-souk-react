import React from "react";

const Coupons = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Coupons</h1>
      <div className="mt-4">
        <p>Manage your coupons here.</p>
      </div>
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Coupon
        </button>
      </div>
      <div className="mt-4">
        {/* Add your coupon management table or component here */}
        <p>List of coupons will be displayed here.</p>
      </div>
    </div>
  );
};

export default Coupons;
