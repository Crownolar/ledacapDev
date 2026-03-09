import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSamples } from "../redux/slice/samplesSlice";
import DatabaseView from "../components/views/DatabaseView";
import api from "../utils/api";

const Database = ({ theme }) => {
  const dispatch = useDispatch();
  const { samples, loading } = useSelector((state) => state.samples);
  const { currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterProductVariant, setFilterProductVariant] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [states, setStates] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);

  const [selectedSample, setSelectedSample] = useState(null);

  useEffect(() => {
    dispatch(fetchSamples({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get("/management/states", {
          params: { activeOnly: "true" },
        });
        setStates(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, []);

  const filteredSamplesArray = samples.filter((sample) => {
    const matchesSearch =
      sample.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState =
      filterState === "all" || sample.state.name === filterState;

    const matchesProduct =
      filterProductVariant === "all" || sample.product === filterProductVariant;

    const matchesStatus =
      filterStatus === "all" || sample.status === filterStatus;

    // const matchCategory =
    //   filterCategory === "all" || sample.category === filterCategory;

    return (
      matchesSearch &&
      // matchCategory &&
      matchesState &&
      matchesProduct &&
      matchesStatus
    );
  });

  console.log({
    samples: samples,
    filteredState: filterState,
    filterCategory: filterCategory,
    filteredStatus: filterStatus,
    filteredSamplesArray: filteredSamplesArray,
    searchTerm: searchTerm,
    selectedSample,
    filterProductVariant,
  });

  // useEffect(() => {
  //   setFilteredSamples(filteredSamplesArray);
  // }, [searchTerm, filterState, filterProductVariant, filterCategory, filterStatus]);

  // console.log("sample", samples);
  console.log("filtered sample array", filteredSamplesArray);
  console.log("filtered Samples", filteredSamples);
  return (
    <div>
      <DatabaseView
        theme={theme}
        loading={loading}
        samples={samples}
        states={states}
        currentUser={currentUser}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterState={filterState}
        setFilterState={setFilterState}
        filterProductVariant={filterProductVariant}
        setFilterProductVariant={setFilterProductVariant}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filteredSamples={filteredSamples}
        selectedSample={selectedSample}
        setSelectedSample={setSelectedSample}
      />
    </div>
  );
};

export default Database;
