const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  patients: `${API_BASE_URL}/api/patients`,
  consultations: `${API_BASE_URL}/api/consultations`,
<<<<<<< HEAD
  certificateTemplates: `${API_BASE_URL}/api/certificates/templates`,
  certificates: `${API_BASE_URL}/api/certificates`,
};

export default API_ENDPOINTS;


=======
};

export default API_ENDPOINTS;
>>>>>>> cb30d177532597ade5b987d7d5d8977e61ca33b2
