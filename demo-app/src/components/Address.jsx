import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddressCard from "./AddressCard";
import userService from "../services/user.service";
import {
  updateStart,
  updateFailure,
  updateSuccess,
} from "../store/user/userSlice";

export default function Address({ onSelectAddress }) {
  const { currentUser } = useSelector((state) => state.user);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    line1: "",
    line2: "",
    zipcode: "",
    city: "",
    state: "",
    country: "",
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    const data = await userService.addAddress(currentUser._id, newAddress);
    if (data.success === true) {
      dispatch(updateSuccess(data.payload));
      setNewAddress({
        line1: "",
        line2: "",
        zipcode: "",
        city: "",
        state: "",
        country: "",
      });
    } else {
      dispatch(updateFailure());
    }

    setShowAddAddressModal(false);
  };

  const onRemoveAddress = async (userId, addressId) => {
    try {
      dispatch(updateStart());
      const data = await userService.removeAddress(userId, addressId);
      if (data.success === true) {
        dispatch(updateSuccess(data.payload));
      } else {
        dispatch(updateFailure());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address); // Update selected address state
    // Call the callback function with the selected address
    onSelectAddress(address);
  };

  return (
    <>
      <div className="container">
        {currentUser?.addresses?.length > 0 &&
          currentUser.addresses.map((item) => (
            <>
              <AddressCard
                key={item._id}
                address={item}
                selected={selectedAddress === item}
                onRemoveAddress={() =>
                  onRemoveAddress(currentUser._id, item._id)
                }
                onSelect={handleSelectAddress}
              />
            </>
          ))}

        {currentUser.addresses.length < 3 ? (
          <div className="text-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowAddAddressModal(true)}
            >
              Add New Address
            </button>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Modal or Form for adding new address */}
      {showAddAddressModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div
                  className="close text-right cursor-pointer"
                  onClick={() => setShowAddAddressModal(false)}
                >
                  X
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 mb-4"
                      id="modal-title"
                    >
                      Add New Address
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleAddAddress}>
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="line1"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Line 1<span className="text-red-400">*</span>
                            </label>
                            <input
                              required
                              type="text"
                              name="line1"
                              id="line1"
                              autoComplete="address-line1"
                              value={newAddress.line1}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="line2"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Line 2
                            </label>
                            <input
                              type="text"
                              name="line2"
                              id="line2"
                              autoComplete="address-line1"
                              value={newAddress.line2}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="zipcode"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Zip Code<span className="text-red-400">*</span>
                            </label>
                            <input
                              type="number"
                              name="zipcode"
                              id="zipcode"
                              required
                              autoComplete="address-line1"
                              value={newAddress.zipcode}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-gray-700"
                            >
                              city<span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              name="city"
                              id="city"
                              required
                              autoComplete="address-line1"
                              value={newAddress.city}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="state"
                              className="block text-sm font-medium text-gray-700"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              id="state"
                              autoComplete="address-line1"
                              value={newAddress.state}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="country"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Country
                            </label>
                            <input
                              type="text"
                              name="country"
                              id="country"
                              autoComplete="address-line1"
                              value={newAddress.country}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          {/* Add other fields similarly */}

                          <div className="col-span-6 sm:col-span-6">
                            <button
                              // onClick={handleAddAddress}
                              type="submit"
                              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                            >
                              Add Address
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
