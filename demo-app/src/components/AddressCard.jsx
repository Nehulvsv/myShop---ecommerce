// AddressCard.js

import React from "react";

export default function AddressCard({
  address,
  selected,
  onSelect,
  onChangeAddress,
  onRemoveAddress,
}) {
  const { line1, line2, city, zipcode, state, country } = address;

  const handleClick = () => {
    onSelect(address);
  };

  return (
    <div
      className={`bg-white shadow-md rounded-md p-4 mb-4 ${
        selected ? "border border-blue-500" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Address</h2>
        <div className="">
          {/* <button
            className="text-blue-500 hover:text-blue-700 mr-3"
            onClick={onChangeAddress}
          >
            Change
          </button> */}
          <button
            className="text-red-500 hover:text-blue-700"
            onClick={onRemoveAddress}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="mb-2">
        <p className="text-gray-600">{line1}</p>
        {line2 && <p className="text-gray-600">{line2}</p>}
        <p className="text-gray-600">{`${city}, ${state}, ${zipcode}`}</p>
        <p className="text-gray-600">{country}</p>
      </div>
    </div>
  );
}
