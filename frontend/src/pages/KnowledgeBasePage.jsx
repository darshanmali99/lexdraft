import { useEffect, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Database,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchTemplates, uploadTemplate } from "../services/kbService";

function KnowledgeBasePage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const loadTemplates = async () => {
    try {
      const data = await fetchTemplates();
      setFiles(data.templates || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      setUploading(true);
      await uploadTemplate(formData);
      toast.success("Template uploaded successfully");
      loadTemplates();
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      await uploadTemplate(formData);
      toast.success("Template uploaded successfully");
      loadTemplates();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.03em" }}>
          Knowledge Base
        </h1>
        <p style={{ fontSize: "13px", color: "#8b9ab3", marginTop: "5px" }}>
          Upload legal templates to train your enterprise AI retrieval system.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[
          { label: "Total Templates", value: files.length, icon: FileText, color: "stat-icon-blue" },
          { label: "Embedded", value: files.length, icon: CheckCircle2, color: "stat-icon-green" },
          { label: "Processing", value: 0, icon: Clock, color: "stat-icon-amber" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div className={`stat-icon ${s.color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p style={{ fontSize: "22px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: "11.5px", color: "#8b9ab3", marginTop: "4px" }}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Zone */}
      <div className="card" style={{ padding: "24px" }}>
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "48px 24px",
            border: `2px dashed ${dragging ? "rgba(79,140,255,0.50)" : "rgba(255,255,255,0.09)"}`,
            borderRadius: "20px",
            background: dragging ? "rgba(79,140,255,0.04)" : "rgba(255,255,255,0.015)",
            cursor: "pointer",
            transition: "border-color 0.2s ease, background 0.2s ease",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              background: dragging ? "var(--accent-bg)" : "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px",
              transition: "background 0.2s ease",
            }}
          >
            {uploading ? (
              <Loader2 size={24} style={{ color: "#4f8cff", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <Upload size={24} style={{ color: dragging ? "#4f8cff" : "#8b9ab3" }} />
            )}
          </div>

          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            {uploading ? "Uploading..." : dragging ? "Drop it here!" : "Upload Legal Templates"}
          </h3>

          <p style={{ fontSize: "13px", color: "#8b9ab3", maxWidth: "420px", lineHeight: "1.6", marginBottom: "20px" }}>
            Upload contracts, policies, compliance files, or any legal document to improve AI generation quality. Drag & drop or click to browse.
          </p>

          <div
            className="btn-primary"
            style={{ padding: "0 20px", height: "40px", fontSize: "13px", pointerEvents: "none" }}
          >
            <Upload size={14} />
            {uploading ? "Uploading..." : "Select Files"}
          </div>

          <p style={{ fontSize: "11px", color: "#4b5a72", marginTop: "12px" }}>
            Supported: PDF, DOCX, TXT — max 50MB
          </p>

          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            style={{ display: "none" }}
            accept=".pdf,.docx,.doc,.txt"
          />
        </label>
      </div>

      {/* Templates Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {/* Table Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "var(--accent-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Database size={14} style={{ color: "#4f8cff" }} />
          </div>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            Knowledge Files
          </h3>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              fontWeight: "600",
              padding: "2px 8px",
              borderRadius: "999px",
              background: "var(--accent-bg)",
              color: "#4f8cff",
              border: "1px solid rgba(79,140,255,0.20)",
            }}
          >
            {files.length} files
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "48px", display: "flex", justifyContent: "center" }}>
            <Loader2 size={28} style={{ color: "#4f8cff", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : files.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ fontSize: "13.5px", color: "#8b9ab3" }}>No templates uploaded yet.</p>
            <p style={{ fontSize: "12px", color: "#4b5a72", marginTop: "4px" }}>Upload your first legal template above.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["File", "Type", "Status", "Uploaded"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 18px",
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
                {files.map((file) => (
                  <tr
                    key={file.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.018)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <FileText size={15} style={{ color: "#8b9ab3" }} />
                        </div>
                        <div>
                          <p style={{ fontSize: "13.5px", fontWeight: "600", color: "#f1f5f9" }}>{file.name}</p>
                          <p style={{ fontSize: "11px", color: "#4b5a72", marginTop: "2px" }}>AI Knowledge Source</p>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#8b9ab3",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "6px",
                          padding: "2px 8px",
                        }}
                      >
                        {file.type || "Document"}
                      </span>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={14} style={{ color: "#22c55e" }} />
                        <span style={{ fontSize: "12.5px", color: "#22c55e", fontWeight: "600" }}>Embedded</span>
                      </div>
                    </td>

                    <td style={{ padding: "14px 18px", fontSize: "12px", color: "#4b5a72" }}>
                      {file.created_at
                        ? new Date(file.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default KnowledgeBasePage;