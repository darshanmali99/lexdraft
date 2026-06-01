import { useState } from "react";
import { Sparkles, ChevronRight, Loader2, FileText, Wand2 } from "lucide-react";
import { generateDocument } from "../services/documentService";
import toast from "react-hot-toast";

const DOC_TYPES = [
  { value: "18efdb97-9abb-48e1-a313-f97bb8ff60b0", label: "NDA — Non-Disclosure Agreement" },
  { value: "2", label: "Employment Contract" },
  { value: "3", label: "Service Agreement" },
  { value: "4", label: "Privacy Policy" },
];

const JURISDICTIONS = ["India", "United States", "United Kingdom", "European Union", "Singapore"];

function FieldLabel({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: "#8b9ab3",
        marginBottom: "8px",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </label>
  );
}

function GeneratePage() {
  const [formData, setFormData] = useState({
    document_type_id: "18efdb97-9abb-48e1-a313-f97bb8ff60b0",
    client_name: "",
    client_company: "",
    client_address: "",
    effective_date: "",
    term_years: "",
    jurisdiction: "India",
    special_requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.client_name.trim()) {
      toast.error("Please enter the client name");
      return;
    }
    try {
      setLoading(true);
      const response = await generateDocument(formData);
      setGeneratedDraft(response.document?.generated_draft || "No draft generated.");
      toast.success("Document generated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ---- Header ---- */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.03em" }}>
            Generate Document
          </h1>
          <p style={{ fontSize: "13px", color: "#8b9ab3", marginTop: "5px" }}>
            Create AI-powered legal agreements using enterprise workflows.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4b5a72" }}>
          <Sparkles size={13} style={{ color: "#4f8cff" }} />
          <span style={{ color: "#8b9ab3" }}>AI Assistant</span>
          <ChevronRight size={12} />
          <span style={{ color: "#f1f5f9", fontWeight: "600" }}>Document Generation</span>
        </div>
      </div>

      {/* ---- Main Grid ---- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
          alignItems: "start",
        }}
        className="generate-grid"
      >
        {/* LEFT: Form */}
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
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
                <FileText size={14} style={{ color: "#4f8cff" }} />
              </div>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                Document Details
              </h2>
            </div>
            <p style={{ fontSize: "12.5px", color: "#8b9ab3", paddingLeft: "40px" }}>
              Configure AI legal generation parameters.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Document Type */}
            <div>
              <FieldLabel>Document Type</FieldLabel>
              <select
                name="document_type_id"
                value={formData.document_type_id}
                onChange={handleChange}
                style={{ width: "100%", height: "46px", padding: "0 16px", fontSize: "14px" }}
              >
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Client Name */}
            <div>
              <FieldLabel>Client Name <span style={{ color: "#ef4444" }}>*</span></FieldLabel>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="Enter client or individual name"
                style={{ width: "100%", height: "46px", padding: "0 16px", fontSize: "14px" }}
              />
            </div>

            {/* Client Company */}
            <div>
              <FieldLabel>Client Company</FieldLabel>
              <input
                type="text"
                name="client_company"
                value={formData.client_company}
                onChange={handleChange}
                placeholder="Enter company or organization name"
                style={{ width: "100%", height: "46px", padding: "0 16px", fontSize: "14px" }}
              />
            </div>

            {/* Client Address */}
            <div>
              <FieldLabel>Client Address</FieldLabel>
              <textarea
                rows={3}
                name="client_address"
                value={formData.client_address}
                onChange={handleChange}
                placeholder="Enter registered business address"
                style={{ width: "100%", padding: "12px 16px", fontSize: "14px", resize: "none" }}
              />
            </div>

            {/* Two-column row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {/* Effective Date */}
              <div>
                <FieldLabel>Effective Date</FieldLabel>
                <input
                  type="date"
                  name="effective_date"
                  value={formData.effective_date}
                  onChange={handleChange}
                  style={{ width: "100%", height: "46px", padding: "0 16px", fontSize: "14px" }}
                />
              </div>

              {/* Agreement Term */}
              <div>
                <FieldLabel>Term (Years)</FieldLabel>
                <input
                  type="number"
                  min="1"
                  max="10"
                  name="term_years"
                  value={formData.term_years}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  style={{ width: "100%", height: "46px", padding: "0 16px", fontSize: "14px" }}
                />
              </div>
            </div>

            {/* Jurisdiction */}
            <div>
              <FieldLabel>Jurisdiction</FieldLabel>
              <select
                name="jurisdiction"
                value={formData.jurisdiction}
                onChange={handleChange}
                style={{ width: "100%", height: "46px", padding: "0 16px", fontSize: "14px" }}
              >
                {JURISDICTIONS.map((j) => (
                  <option key={j}>{j}</option>
                ))}
              </select>
            </div>

            {/* AI Instructions */}
            <div>
              <FieldLabel>AI Instructions</FieldLabel>
              <textarea
                rows={6}
                name="special_requirements"
                value={formData.special_requirements}
                onChange={handleChange}
                placeholder="Describe legal requirements, specific clauses, payment terms, responsibilities, confidentiality scope..."
                style={{ width: "100%", padding: "12px 16px", fontSize: "14px", resize: "vertical" }}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary"
              style={{ height: "48px", fontSize: "14px", justifyContent: "center", width: "100%", marginTop: "4px" }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Generate Legal Document
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", minHeight: "600px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "rgba(34,197,94,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={14} style={{ color: "#22c55e" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                  Document Preview
                </h2>
                <p style={{ fontSize: "12px", color: "#8b9ab3", marginTop: "2px" }}>
                  AI-generated legal content
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: "999px",
                background: generatedDraft ? "var(--accent-bg)" : "rgba(255,255,255,0.04)",
                color: generatedDraft ? "#4f8cff" : "#4b5a72",
                border: generatedDraft ? "1px solid rgba(79,140,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {generatedDraft ? "AI Draft" : "Awaiting"}
            </span>
          </div>

          {/* Preview Content */}
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              padding: "24px",
              overflowY: "auto",
            }}
          >
            {generatedDraft ? (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "13px",
                  color: "#d1d9e6",
                  lineHeight: "1.85",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "400",
                }}
              >
                {generatedDraft}
              </pre>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: "12px",
                }}
              >
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
                <p style={{ fontSize: "14px", color: "#4b5a72", fontWeight: "500" }}>
                  Your AI-generated legal draft
                </p>
                <p style={{ fontSize: "12px", color: "#2d3748" }}>
                  Fill in the form and click Generate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneratePage;