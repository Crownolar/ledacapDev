import api from "../utils/api";

// const resolveStateParam = (state) => {
//   if (!state) return undefined;

//   if (typeof state === "object") return state.name;

//   return state;
// };

export const getStateSummaryReport = async ({ state, dateFrom, dateTo }) => {
  const params = {
    ...(state && { state }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };

  console.log("STATE SUMMARY PARAMS:", params);

  const response = await api.get("/moh/reports/state-summary", {
    params,
    headers: { Accept: "application/json" },
  });

  return response.data;
};

export const getContaminationAnalysisReport = async ({
  stateIds,
  stateName,
  productVariantIds,
  dateFrom,
  dateTo,
}) => {
  const params = {
    ...(stateIds?.length && { stateIds: stateIds.join(",") }),
    ...(stateName && { state: stateName }),
    ...(productVariantIds?.length && {
      productVariantIds: productVariantIds.join(","),
    }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };

  console.log("CONTAMINATION ANALYSIS PARAMS:", params);

  const response = await api.get("/moh/reports/contamination-analysis", {
    params,
    headers: { Accept: "application/json" },
  });

  return response.data;
};

// export const getContaminationAnalysisReport = async ({
//   stateIds,
//   productVariantIds,
//   dateFrom,
//   dateTo,
// }) => {
//   const params = {
//     ...(stateIds?.length && { stateIds: stateIds.join(",") }),
//     ...(productVariantIds?.length && {
//       productVariantIds: productVariantIds.join(","),
//     }),
//     ...(dateFrom && { dateFrom }),
//     ...(dateTo && { dateTo }),
//   };

//   console.log("CONTAMINATION ANALYSIS PARAMS:", params);

//   const response = await api.get("/moh/reports/contamination-analysis", {
//     params,
//     headers: { Accept: "application/json" },
//   });

//   return response.data;
// };

export const getProductTypeReport = async ({ stateId, dateFrom, dateTo }) => {
  const params = {
    ...(stateId && { stateId }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };

  console.log("PRODUCT TYPE PARAMS:", params);

  const response = await api.get("/moh/reports/product-type", {
    params,
    headers: { Accept: "application/json" },
  });

  return response.data;
};

export const getRiskAssessmentReport = async ({
  minLeadLevel,
  dateFrom,
  dateTo,
}) => {
  const params = {
    ...(minLeadLevel && { minLeadLevel }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };

  console.log("RISK ASSESSMENT PARAMS:", params);

  const response = await api.get("/moh/reports/risk-assessment", {
    params,
    headers: { Accept: "application/json" },
  });

  return response.data;
};

export const getContaminationSummary = async ({
  stateId,
  stateName,
  dateFrom,
  dateTo,
}) => {
  const params = {
    ...(stateId && { stateId }),
    ...(stateName && { state: stateName }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };

  console.log("CONTAMINATION SUMMARY PARAMS:", params);

  const response = await api.get("/moh/contamination-summary", {
    params,
    headers: { Accept: "application/json" },
  });

  return response.data;
};

export const getSavedReports = async () => {
  const response = await api.get("/moh/reports");
  return response.data;
};

export const getReportById = async (id) => {
  const response = await api.get(`/moh/reports/${id}`, {
    headers: { Accept: "application/json" },
  });

  return response.data;
};
