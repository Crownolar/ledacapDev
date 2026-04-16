import api from "../utils/api";

export const getMOHSamples = async ({
  page = 1,
  pageSize = 10,
  stateId = "",
  lgaId = "",
  dateFrom = "",
  dateTo = "",
  status = "",
}) => {
  const params = {
    page,
    pageSize,
    ...(stateId && { stateId }),
    ...(lgaId && { lgaId }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    ...(status && { status }),
  };

  console.log("getMOHSamples params:", params);

  const res = await api.get("/moh/samples", { params });
  return res.data;
};