import API from "./api";


// ======================================
// GENERATE DOCUMENT
// ======================================

export const generateDocument =
async (data) => {

  const response =
    await API.post(

      "/documents/generate",

      data
    );

  return response.data;
};


// ======================================
// GET ALL DOCUMENTS
// ======================================

export const fetchDocuments =
async () => {

  const response =
    await API.get("/documents");

  return response.data;
};


// ======================================
// GET SINGLE DOCUMENT
// ======================================

export const fetchDocumentById =
async (id) => {

  const response =
    await API.get(
      `/documents/${id}`
    );

  return response.data;
};


// ======================================
// DELETE / ARCHIVE DOCUMENT
// ======================================

export const archiveDocument =
async (id) => {

  const response =
    await API.delete(
      `/documents/${id}`
    );

  return response.data;
};


// ======================================
// REGENERATE DOCUMENT
// ======================================

export const regenerateDocument =
async (id, data) => {

  const response =
    await API.post(

      `/documents/${id}/regenerate`,

      data
    );

  return response.data;
};


// ======================================
// EXPORT DOCX
// ======================================

export const exportDocx =
async (id, title = "document") => {

  const response =
    await API.get(

      `/documents/${id}/export/docx`,

      {
        responseType: "blob",
      }
    );

  // ======================================
  // CREATE DOWNLOAD LINK
  // ======================================

  const blob =
    new Blob(

      [response.data],

      {
        type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }
    );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `${title}.docx`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);

  return true;
};

// ======================================
// EXPORT PDF
// ======================================

export const exportPdf =
async (id) => {

  const response =
    await API.get(

      `/documents/${id}/export/pdf`
    );

  return response.data;
};


// ======================================
// PREVIEW DOCUMENT
// ======================================

export const previewDocument =
async (id) => {

  const response =
    await API.get(

      `/documents/${id}/export/preview`
    );

  return response.data;
};