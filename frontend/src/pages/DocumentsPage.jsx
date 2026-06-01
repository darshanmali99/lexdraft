import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Download,
  Eye,
  Trash2,
  RefreshCcw,
  Loader2,
  FileText,
  Plus,
  X,
} from "lucide-react";

import {
  fetchDocuments,
  archiveDocument,
  regenerateDocument,
  exportDocx,
  previewDocument,
} from "../services/documentService";
import ReactMarkdown from "react-markdown";

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [previewContent, setPreviewContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { loadDocuments(); }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDocuments();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    const confirmed = window.confirm("Delete this document? This action cannot be undone.");
    if (!confirmed) return;
    try {
      setActionLoading(id);
      await archiveDocument(id);
      toast.success("Document deleted");
      await loadDocuments();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (id) => {
    try {
      setActionLoading(id);
      toast.loading("Regenerating document...", { id: "regen" });
      await regenerateDocument(id, {});
      toast.success("Document regenerated", { id: "regen" });
      await loadDocuments();
    } catch (error) {
      toast.error("Regenerate failed", { id: "regen" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (doc) => {
    try {
      setActionLoading(doc.id);
      await exportDocx(doc.id, doc.title);
      toast.success("DOCX downloaded");
    } catch (error) {
      toast.error("Download failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePreview = async (doc) => {
    try {
      setActionLoading(doc.id);
      const content = await previewDocument(doc.id);
      setPreviewContent(content);
      setPreviewTitle(doc.title);
      setPreviewOpen(true);
    } catch (error) {
      toast.error("Preview failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const title = doc.title?.toLowerCase() || "";
    const client = doc.client_name?.toLowerCase() || "";
    const q = search.toLowerCase();
    return title.includes(q) || client.includes(q);
  });

  const getStatusStyle = (status) => {
    if (status === "approved") return { bg: "rgba(34,197,94,0.10)", color: "#22c55e", border: "rgba(34,197,94,0.20)" };
    if (status === "draft") return { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "rgba(245,158,11,0.20)" };
    return { bg: "rgba(79,140,255,0.10)", color: "#7aabff", border: "rgba(79,140,255,0.20)" };
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(255,255,255,0.06)",
            borderTopColor: "#4f8cff",
            borderRadius: "999px",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ marginTop: "16px", color: "#8b9ab3", fontSize: "13px" }}>Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
        <p style={{ color: "#f87171", fontSize: "14px", marginBottom: "16px" }}>{error}</p>
        <button onClick={loadDocuments} className="btn-primary" style={{ padding: "0 20px", height: "40px", fontSize: "13px" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.03em" }}>
            Documents
          </h1>
          <p style={{ fontSize: "13px", color: "#8b9ab3", marginTop: "5px" }}>
            Manage AI-generated legal agreements, exports, and workflows.
          </p>
        </div>
        <button
          onClick={() => window.location.href = "/documents/new"}
          className="btn-primary"
          style={{ padding: "0 18px", height: "40px", fontSize: "13px" }}
        >
          <Plus size={14} />
          New Document
        </button>
      </div>

      {/* Toolbar */}
      <div
        className="card"
        style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
      >
        <div style={{ position: "relative", flex: "1", minWidth: "220px", maxWidth: "360px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#4b5a72",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search by title or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "36px",
              paddingRight: "14px",
              fontSize: "13px",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
          <span style={{ fontSize: "12px", color: "#4b5a72" }}>
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Document", "Client", "Status", "Version", "Created", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 18px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#4b5a72",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "64px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "16px",
                          background: "rgba(255,255,255,0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FileText size={22} style={{ color: "#4b5a72" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#8b9ab3" }}>No documents found</p>
                        <p style={{ fontSize: "12px", color: "#4b5a72", marginTop: "4px" }}>
                          {search ? "Try a different search term." : "Generate your first legal document to get started."}
                        </p>
                      </div>
                      {!search && (
                        <button
                          onClick={() => window.location.href = "/documents/new"}
                          className="btn-primary"
                          style={{ padding: "0 18px", height: "38px", fontSize: "13px", marginTop: "4px" }}
                        >
                          <Plus size={13} />
                          Generate Document
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => {
                  const s = getStatusStyle(doc.status);
                  const isActioning = actionLoading === doc.id;
                  return (
                    <tr
                      key={doc.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.018)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      {/* Title */}
                      <td style={{ padding: "16px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "10px",
                              background: "var(--accent-bg)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <FileText size={14} style={{ color: "#4f8cff" }} />
                          </div>
                          <div>
                            <p style={{ fontSize: "13.5px", fontWeight: "600", color: "#f1f5f9" }}>{doc.title}</p>
                            <p style={{ fontSize: "11px", color: "#4b5a72", marginTop: "2px" }}>AI Generated</p>
                          </div>
                        </div>
                      </td>

                      {/* Client */}
                      <td style={{ padding: "16px 18px", fontSize: "13px", color: "#8b9ab3" }}>
                        {doc.client_name || "—"}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "16px 18px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: "600",
                            background: s.bg,
                            color: s.color,
                            border: `1px solid ${s.border}`,
                          }}
                        >
                          {doc.status || "draft"}
                        </span>
                      </td>

                      {/* Version */}
                      <td style={{ padding: "16px 18px", fontSize: "13px", color: "#8b9ab3" }}>
                        <span
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "6px",
                            padding: "2px 8px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          v{doc.version || 1}
                        </span>
                      </td>

                      {/* Created */}
                      <td style={{ padding: "16px 18px", fontSize: "12.5px", color: "#4b5a72" }}>
                        {new Date(doc.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          {/* Preview */}
                          <button
                            onClick={() => handlePreview(doc)}
                            title="Preview"
                            className="icon-btn"
                          >
                            {isActioning ? (
                              <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>

                          {/* Download */}
                          <button
                            onClick={() => handleDownload(doc)}
                            title="Download DOCX"
                            className="icon-btn"
                          >
                            <Download size={14} />
                          </button>

                          {/* Regenerate */}
                          <button
                            onClick={() => handleRegenerate(doc.id)}
                            title="Regenerate"
                            className="icon-btn"
                          >
                            <RefreshCcw
                              size={14}
                              style={{ animation: isActioning ? "spin 0.8s linear infinite" : "none" }}
                            />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleArchive(doc.id)}
                            title="Delete"
                            className="icon-btn icon-btn-danger"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewOpen(false); }}
        >
          <div
            className="slide-up"
            style={{
              width: "100%",
              maxWidth: "860px",
              maxHeight: "88vh",
              background: "#0d1117",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "24px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "var(--accent-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={15} style={{ color: "#4f8cff" }} />
                </div>
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                    {previewTitle || "Document Preview"}
                  </h2>
                  <p style={{ fontSize: "11px", color: "#8b9ab3", marginTop: "2px" }}>AI-generated legal document</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="icon-btn"
                style={{ flexShrink: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
              <div
                style={{
                  background: "#ffffff",
                  color: "#1e293b",
                  padding: "48px 60px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                  fontSize: "14px",
                  lineHeight: "1.8",
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: "800px",
                  margin: "0 auto",
                }}
                className="markdown-preview"
              >
                <img 
                  src="http://localhost:5000/uploads/header.png" 
                  alt="Document Header" 
                  style={{ width: "100%", height: "auto", marginBottom: "20px" }}
                />
                <ReactMarkdown>{previewContent}</ReactMarkdown>
                <img 
                  src="http://localhost:5000/uploads/footer.png" 
                  alt="Document Footer" 
                  style={{ width: "100%", height: "auto", marginTop: "20px" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentsPage;