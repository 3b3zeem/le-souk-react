import React from "react";

const OrderSkeletonLoader = () => {
  const skeletonRows = Array(5).fill();

  return (
    <div className="w-full mx-auto bg-white p-8 shadow-md mt-6">
      {/* العنوان */}
      <h2
        className="skeleton-bg mb-6"
        style={{
          height: "28px",
          width: "150px",
        }}
      ></h2>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              {Array(5)
                .fill()
                .map((_, idx) => (
                  <th key={idx} className="py-3 px-4">
                    <div
                      className="skeleton-bg"
                      style={{
                        height: "20px",
                        width: "80px",
                      }}
                    ></div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((_, idx) => (
              <tr key={idx}>
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <td key={i} className="py-3 px-4">
                      <div
                        className="skeleton-bg"
                        style={{
                          height: "18px",
                          width: i === 4 ? "100px" : "70%",
                        }}
                      ></div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderSkeletonLoader;
