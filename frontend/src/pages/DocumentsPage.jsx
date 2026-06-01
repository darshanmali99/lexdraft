import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  Search,
  Download,
  Eye,
  MoreHorizontal,
  Trash2,
  RefreshCcw,
  Loader2,
} from "lucide-react";

import {

  fetchDocuments,

  archiveDocument,

  regenerateDocument,

  exportDocx,

  previewDocument,

} from "../services/documentService";


function DocumentsPage() {

  // ======================================
  // STATE
  // ======================================

  const [documents, setDocuments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState(null);

  const [previewContent, setPreviewContent] =
    useState("");

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);


  // ======================================
  // LOAD DOCUMENTS
  // ======================================

  useEffect(() => {

    loadDocuments();

  }, []);


  const loadDocuments = async () => {

    try {

      setLoading(true);

      setError(null);

      const data =
        await fetchDocuments();

      setDocuments(
        data.documents || []
      );

    } catch (error) {

      console.error(
        "Failed to load documents:",
        error
      );

      setError(
        "Failed to load documents."
      );

    } finally {

      setLoading(false);
    }
  };


  // ======================================
  // ARCHIVE DOCUMENT
  // ======================================

  const handleArchive =
    async (id) => {

      const confirmed = window.confirm(
        "Delete this document?"
      );

      if (!confirmed) return;

      try {

        setActionLoading(id);

        await archiveDocument(id);

        toast.success(
          "Document deleted"
        );

        await loadDocuments();

      } catch (error) {

        console.error(
          "Archive failed:",
          error
        );

        toast.error(
          "Delete failed"
        );

      } finally {

        setActionLoading(null);
      }
    };


  // ======================================
  // REGENERATE DOCUMENT
  // ======================================

  const handleRegenerate =
    async (id) => {

      try {

        setActionLoading(id);

        toast.loading(
          "Regenerating document...",
          {
            id: "regen"
          }
        );

        await regenerateDocument(
          id,
          {}
        );

        toast.success(
          "Document regenerated",
          {
            id: "regen"
          }
        );

        await loadDocuments();

      } catch (error) {

        console.error(
          "Regenerate failed:",
          error
        );

        toast.error(
          "Regenerate failed",
          {
            id: "regen"
          }
        );

      } finally {

        setActionLoading(null);
      }
    };


  // ======================================
  // DOWNLOAD DOCX
  // ======================================

  const handleDownload =
    async (doc) => {

      try {

        setActionLoading(doc.id);

        await exportDocx(

          doc.id,

          doc.title
        );

        toast.success(
          "DOCX downloaded"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Download failed"
        );

      } finally {

        setActionLoading(null);
      }
    };


  // ======================================
  // PREVIEW DOCUMENT
  // ======================================

  const handlePreview =
    async (doc) => {

      try {

        setActionLoading(doc.id);

        const content =
          await previewDocument(
            doc.id
          );

        setPreviewContent(content);

        setPreviewOpen(true);

      } catch (error) {

        console.error(error);

        toast.error(
          "Preview failed"
        );

      } finally {

        setActionLoading(null);
      }
    };


  // ======================================
  // FILTER DOCUMENTS
  // ======================================

  const filteredDocuments =
    documents.filter((doc) => {

      const title =
        doc.title?.toLowerCase() || "";

      const client =
        doc.client_name?.toLowerCase() || "";

      return (
        title.includes(
          search.toLowerCase()
        ) ||
        client.includes(
          search.toLowerCase()
        )
      );
    });


  // ======================================
  // LOADING STATE
  // ======================================

  if (loading) {

    return (

      <div className="flex flex-col items-center justify-center py-24">

        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />

        <p className="mt-5 text-slate-400 text-sm">

          Loading documents...

        </p>

      </div>
    );
  }


  // ======================================
  // ERROR STATE
  // ======================================

  if (error) {

    return (

      <div className="flex flex-col items-center justify-center py-24">

        <p className="text-red-400 text-sm mb-5">

          {error}

        </p>

        <button
          onClick={loadDocuments}
          className="btn-primary px-5 h-11 text-sm"
        >

          Retry

        </button>

      </div>
    );
  }


  // ======================================
  // COMPONENT
  // ======================================

  return (

    <div className="space-y-10 fade-in">

      {/* Header */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Documents
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl">
            Manage AI-generated legal agreements,
            exports,
            and enterprise legal workflows.
          </p>

        </div>

        <button
          onClick={() => {
            window.location.href =
              "/documents/new";
          }}
          className="btn-primary px-5 h-11 text-sm"
        >

          New Document

        </button>

      </div>


      {/* Toolbar */}

      <div className="card p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div className="relative w-full lg:w-[340px]">

          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full h-11 pl-12 pr-4 text-sm"
          />

        </div>

      </div>


      {/* Table */}

      <div className="card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>

              <tr className="border-b border-white/5 text-left">

                <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Document
                </th>

                <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Client
                </th>

                <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Version
                </th>

                <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Created
                </th>

                <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredDocuments.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-20 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <p className="text-slate-400 text-sm">

                        No documents yet.
                        Generate your first one.

                      </p>

                      <button
                        onClick={() => {
                          window.location.href =
                            "/documents/new";
                        }}
                        className="btn-primary mt-5 px-5 h-11 text-sm"
                      >

                        Generate Document

                      </button>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredDocuments.map((doc) => (

                  <tr
                    key={doc.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition"
                  >

                    {/* Title */}

                    <td className="px-6 py-5">

                      <div>

                        <p className="text-sm font-medium">
                          {doc.title}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          AI Generated
                        </p>

                      </div>

                    </td>


                    {/* Client */}

                    <td className="px-6 py-5 text-sm text-slate-400">

                      {doc.client_name}

                    </td>


                    {/* Status */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          doc.status === "approved"
                            ? "bg-green-500/10 text-green-400"
                            : doc.status === "draft"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >

                        {doc.status}

                      </span>

                    </td>


                    {/* Version */}

                    <td className="px-6 py-5 text-sm text-slate-400">

                      v{doc.version}

                    </td>


                    {/* Created */}

                    <td className="px-6 py-5 text-sm text-slate-500">

                      {new Date(
                        doc.created_at
                      ).toLocaleDateString()}

                    </td>


                    {/* Actions */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        {/* Preview */}

                        <button

                          onClick={() =>
                            handlePreview(doc)
                          }

                          className="w-9 h-9 rounded-xl hover:bg-white/[0.04] flex items-center justify-center transition"
                        >

                          {actionLoading === doc.id ? (

                            <Loader2
                              size={16}
                              className="animate-spin text-slate-400"
                            />

                          ) : (

                            <Eye
                              size={16}
                              className="text-slate-400"
                            />
                          )}

                        </button>


                        {/* Download */}

                        <button

                          onClick={() =>
                            handleDownload(doc)
                          }

                          className="w-9 h-9 rounded-xl hover:bg-white/[0.04] flex items-center justify-center transition"
                        >

                          <Download
                            size={16}
                            className="text-slate-400"
                          />

                        </button>


                        {/* Regenerate */}

                        <button
                          onClick={() =>
                            handleRegenerate(doc.id)
                          }
                          className="w-9 h-9 rounded-xl hover:bg-white/[0.04] flex items-center justify-center transition"
                        >

                          <RefreshCcw
                            size={16}
                            className={`text-slate-400 ${
                              actionLoading === doc.id
                                ? "animate-spin"
                                : ""
                            }`}
                          />

                        </button>


                        {/* Delete */}

                        <button
                          onClick={() =>
                            handleArchive(doc.id)
                          }
                          className="w-9 h-9 rounded-xl hover:bg-red-500/10 flex items-center justify-center transition"
                        >

                          <Trash2
                            size={16}
                            className="text-red-400"
                          />

                        </button>


                        {/* More */}

                        <button className="w-9 h-9 rounded-xl hover:bg-white/[0.04] flex items-center justify-center transition">

                          <MoreHorizontal
                            size={16}
                            className="text-slate-400"
                          />

                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ======================================
          PREVIEW MODAL
      ====================================== */}

      {previewOpen && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">

          <div className="w-full max-w-5xl h-[85vh] bg-[#111827] rounded-3xl border border-white/10 overflow-hidden flex flex-col">

            {/* Header */}

            <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">

              <div>

                <h2 className="text-xl font-semibold">
                  Document Preview
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  AI-generated legal document
                </p>

              </div>

              <button

                onClick={() =>
                  setPreviewOpen(false)
                }

                className="w-10 h-10 rounded-xl hover:bg-white/[0.05]"
              >

                ✕

              </button>

            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto px-8 py-8">

              <pre className="whitespace-pre-wrap text-sm leading-8 text-slate-300 font-sans">

                {previewContent}

              </pre>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default DocumentsPage;