import React, { useState, useRef } from "react";
import { X, Camera, Trash2 } from "lucide-react";
import { statesData, productTypes, vendorTypes } from "../../utils/constants";
import { generateSampleId } from "../../utils/helpers";

const SampleFormModal = ({ theme, onClose, onSubmit, samples }) => {
  const [formData, setFormData] = useState({
    state: "",
    lga: "", 
    productType: "",
    productName: "",
    brand: "",
    registered: false,
    market: "",
    vendorType: "",
    price: "",
    batchNumber: "",
    coordinates: { lat: "", lng: "" },
    productPhoto: null,
    vendorPhoto: null,
  });

  const productPhotoRef = useRef(null);
  const vendorPhotoRef = useRef(null);

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));

    if (type === "productPhoto" && productPhotoRef.current) {
      productPhotoRef.current.value = "";
    } else if (vendorPhotoRef.current) {
      vendorPhotoRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div
        className={`${theme.card} rounded-lg shadow-xl max-w-4xl w-full my-8 border ${theme.border} mx-auto sm:mx-2`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b ${theme.border}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left w-full sm:w-auto">
              New Sample Entry
            </h2>
            <button onClick={onClose} className={`p-2 rounded-lg ${theme.hover}`}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-500">
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  State *
                </label>
                <select
                  required
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                      lga: "",
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                >
                  <option value="">Select State</option>
                  {Object.keys(statesData).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  LGA *
                </label>
                <select
                  required
                  value={formData.lga}
                  onChange={(e) =>
                    setFormData({ ...formData, lga: e.target.value })
                  }
                  disabled={!formData.state}
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50`}
                >
                  <option value="">Select LGA</option>
                  {formData.state &&
                    statesData[formData.state].map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Market Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.market}
                  onChange={(e) =>
                    setFormData({ ...formData, market: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., Oja Oba Market"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Vendor Type *
                </label>
                <select
                  required
                  value={formData.vendorType}
                  onChange={(e) =>
                    setFormData({ ...formData, vendorType: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                >
                  <option value="">Select Vendor Type</option>
                  {vendorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  GPS Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates.lat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: {
                        ...formData.coordinates,
                        lat: e.target.value,
                      },
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., 8.4799"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  GPS Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates.lng}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: {
                        ...formData.coordinates,
                        lng: e.target.value,
                      },
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., 4.5418"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-500">
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Product Type *
                </label>
                <select
                  required
                  value={formData.productType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productType: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                >
                  <option value="">Select Product Type</option>
                  {Object.entries(productTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productName: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., Tiró Kohl"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., BeautyGlow or N/A"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Batch Number
                </label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      batchNumber: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., BT2025001"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Price (₦) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., 500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="registered"
                  checked={formData.registered}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registered: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                />
                <label
                  htmlFor="registered"
                  className={`ml-2 text-sm font-medium ${theme.text}`}
                >
                  Registered Product (NAFDAC/SON)
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-500">
              Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Photo */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Product Photo
                </label>

                {formData.productPhoto ? (
                  <div className="relative">
                    <img
                      src={formData.productPhoto}
                      alt="Product"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto("productPhoto")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => productPhotoRef.current?.click()}
                    className={`border-2 border-dashed ${theme.border} rounded-lg p-8 text-center ${theme.hover} cursor-pointer`}
                  >
                    <Camera
                      className={`w-12 h-12 mx-auto mb-2 ${theme.textMuted}`}
                    />
                    <p className={`text-sm ${theme.textMuted}`}>
                      Click to upload
                    </p>
                  </div>
                )}

                <input
                  ref={productPhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "productPhoto")}
                />
              </div>

              {/* Vendor Photo */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Vendor Stall Photo
                </label>

                {formData.vendorPhoto ? (
                  <div className="relative">
                    <img
                      src={formData.vendorPhoto}
                      alt="Vendor"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto("vendorPhoto")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => vendorPhotoRef.current?.click()}
                    className={`border-2 border-dashed ${theme.border} rounded-lg p-8 text-center ${theme.hover} cursor-pointer`}
                  >
                    <Camera
                      className={`w-12 h-12 mx-auto mb-2 ${theme.textMuted}`}
                    />
                    <p className={`text-sm ${theme.textMuted}`}>
                      Click to upload
                    </p>
                  </div>
                )}

                <input
                  ref={vendorPhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "vendorPhoto")}
                />
              </div>
            </div>
          </div>

          {formData.state && formData.lga && formData.productType && (
            <div className="bg-emerald-500 bg-opacity-10 border border-emerald-500 rounded-lg p-4">
              <p className={`text-sm ${theme.textMuted} mb-1`}>
                Generated Sample ID:
              </p>
              <p className="text-xl font-mono font-bold text-emerald-500">
                {generateSampleId(
                  formData.state,
                  formData.lga,
                  formData.productType,
                  samples
                )}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 border ${theme.border} rounded-lg font-medium ${theme.hover} transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
            >
              Save Sample
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SampleFormModal;
