import api from "../utils/api";

export const getPolicyDashboardSummary = async (params = {}) => {
  const response = await api.get("/samples/policy-dashboard-summary", {
    params,
  });
  return response.data?.data || response.data;
};