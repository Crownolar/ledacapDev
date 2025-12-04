import { X, Camera, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createSample } from "../../redux/slice/samplesSlice";
import { statesData, productTypes, vendorTypes } from "../../utils/constants";
import { generateSampleId } from "../../utils/helpers";
import { useRef, useState } from "react";

const SampleFormModal = ({ theme, onClose, samples }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.samples);

  const [formData, setFormData] = useState({
    stateId: "",
    lgaId: "",
    marketId: "",
    productType: "",
    productName: "",
    brandName: "",
    batchNumber: "",
    price: "",
    marketName: "",
    vendorType: "",
    vendorTypeOther: "",
    isRegistered: false,
    gpsLatitude: "",
    gpsLongitude: "",
    productPhoto: null,
    vendorPhoto: null,
  });

  const productPhotoRef = useRef(null);
  const vendorPhotoRef = useRef(null);

  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const removePhoto = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    if (field === "productPhoto") productPhotoRef.current.value = "";
    if (field === "vendorPhoto") vendorPhotoRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createSample(formData));
    if (createSample.fulfilled.match(result)) {
      alert("Sample created successfully!");
      onClose();
    } else {
      alert(result.payload || "Failed to create sample");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000] overflow-y-auto">
      <div
        className={`${theme.card} rounded-lg shadow-xl max-w-4xl w-full my-8 border ${theme.border} mx-auto sm:mx-2`}
      >
        <div className={`p-4 sm:p-6 border-b ${theme.border}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left w-full sm:w-auto">
              New Sample Entry
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${theme.hover}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          <section>
            <h3 className="text-lg font-semibold mb-4 text-emerald-500">
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
                  State *
                </label>
                <select
                  required
                  value={formData.stateId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stateId: e.target.value,
                      lgaId: "",
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
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
                  LGA *
                </label>
                <select
                  required
                  value={formData.lgaId}
                  onChange={(e) =>
                    setFormData({ ...formData, lgaId: e.target.value })
                  }
                  disabled={!formData.stateId}
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50`}
                >
                  <option value="">Select LGA</option>
                  {formData.stateId &&
                    statesData[formData.stateId].map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
                  Market Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.marketName}
                  onChange={(e) =>
                    setFormData({ ...formData, marketName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., Oja Oba Market"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
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
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {formData.vendorType === "OTHER" && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${theme.text}`}
                  >
                    Specify Vendor Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vendorTypeOther}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendorTypeOther: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  />
                </div>
              )}

              {!formData.isRegistered && (
                <>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      GPS Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.gpsLatitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gpsLatitude: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., 6.5244"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme.text}`}
                    >
                      GPS Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.gpsLongitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gpsLongitude: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="e.g., 3.3792"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 text-emerald-500">
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
                  Product Type *
                </label>
                <select
                  required
                  value={formData.productType}
                  onChange={(e) =>
                    setFormData({ ...formData, productType: e.target.value })
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
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., Tiró Kohl"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) =>
                    setFormData({ ...formData, brandName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., BeautyGlow or N/A"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme.text}`}
                >
                  Batch Number
                </label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, batchNumber: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg ${theme.input} focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="e.g., BT2025001"
                />
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="registered"
                  checked={formData.isRegistered}
                  onChange={(e) =>
                    setFormData({ ...formData, isRegistered: e.target.checked })
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
          </section>

          {!formData.isRegistered && (
            <section>
              <h3 className="text-lg font-semibold mb-4 text-emerald-500">
                Documentation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PhotoUpload
                  label="Product Photo"
                  photo={formData.productPhoto}
                  refInput={productPhotoRef}
                  onUpload={(e) => handleFileUpload(e, "productPhoto")}
                  onRemove={() => removePhoto("productPhoto")}
                  theme={theme}
                />
                <PhotoUpload
                  label="Vendor Stall Photo (UI only)"
                  photo={formData.vendorPhoto}
                  refInput={vendorPhotoRef}
                  onUpload={(e) => handleFileUpload(e, "vendorPhoto")}
                  onRemove={() => removePhoto("vendorPhoto")}
                  theme={theme}
                />
              </div>
            </section>
          )}

          {formData.stateId && formData.lgaId && formData.productType && (
            <div className="bg-emerald-500 bg-opacity-10 border border-emerald-500 rounded-lg p-4">
              <p className={`text-sm ${theme.textMuted} mb-1`}>
                Generated Sample ID:
              </p>
              <p className="text-xl font-mono font-bold text-emerald-500">
                {generateSampleId(
                  formData.stateId,
                  formData.lgaId,
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
              className={`flex-1 px-6 py-3 border ${theme.border} rounded-lg font-medium ${theme.hover}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600"
              } text-white rounded-lg font-medium transition-colors`}
            >
              {loading ? "Saving..." : "Save Sample"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PhotoUpload = ({ label, photo, refInput, onUpload, onRemove, theme }) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
      {label}
    </label>
    {photo ? (
      <div className="relative">
        <img
          src={photo}
          alt={label}
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ) : (
      <label
        className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${theme.input} hover:border-emerald-500`}
      >
        <Camera className="w-6 h-6 mr-2 text-gray-400" />
        <span className="text-gray-400">Upload Photo</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={refInput}
          onChange={onUpload}
        />
      </label>
    )}
  </div>
);

export default SampleFormModal;
