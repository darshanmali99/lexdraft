import API from "./api";


// ======================================
// GET TEMPLATES
// ======================================

export const fetchTemplates =
async () => {

  const response =
    await API.get(
      "/kb/templates"
    );

  return response.data;
};


// ======================================
// UPLOAD TEMPLATE
// ======================================

export const uploadTemplate =
async (formData) => {

  const response =
    await API.post(

      "/kb/templates",

      formData,

      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};


// ======================================
// GET COMPANY SETTINGS
// ======================================

export const fetchCompanySettings =
async () => {

  const response =
    await API.get(
      "/kb/settings"
    );

  return response.data;
};


// ======================================
// SAVE COMPANY SETTINGS
// ======================================

export const saveCompanySettings =
async (data) => {

  const response =
    await API.post(

      "/kb/settings",

      data
    );

  return response.data;
};

// ======================================
// UPLOAD COMPANY LOGO
// ======================================

export const uploadCompanyLogo =
async (formData) => {

  const response =
    await API.post(

      "/kb/settings/logo",

      formData,

      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};
