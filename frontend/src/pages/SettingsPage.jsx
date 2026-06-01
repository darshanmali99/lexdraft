import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  ShieldCheck,
  FileSignature,
  Upload,
  Loader2,
  Save,
  RotateCcw,
} from "lucide-react";

import {
  fetchCompanySettings,
  saveCompanySettings,
  uploadCompanyLogo,
} from "../services/kbService";

// ========================
// Reusable sub-components
// ========================

function FieldLabel({ children, required }) {
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
      {required && <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>}
    </label>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="card" style={{ padding: "26px" }}>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          marginBottom: "22px",
          paddingBottom: "18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "var(--accent-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={16} style={{ color: "#4f8cff" }} />
        </div>
        <div>
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            {title}
          </h2>
          <p style={{ fontSize: "12px", color: "#8b9ab3", marginTop: "3px" }}>
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        transition: "border-color 0.2s ease",
        cursor: "pointer",
      }}
      onClick={onChange}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <div>
        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>{title}</h3>
        <p style={{ fontSize: "11.5px", color: "#8b9ab3", marginTop: "3px" }}>{desc}</p>
      </div>

      {/* Toggle pill */}
      <div
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "999px",
          background: checked ? "#4f8cff" : "rgba(255,255,255,0.10)",
          position: "relative",
          transition: "background 0.2s ease",
          flexShrink: 0,
          boxShadow: checked ? "0 0 10px rgba(79,140,255,0.35)" : "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: checked ? "23px" : "3px",
            width: "18px",
            height: "18px",
            borderRadius: "999px",
            background: "#fff",
            transition: "left 0.2s ease",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}


// ========================
// Settings Page
// ========================

function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const [settings, setSettings] = useState({
    company_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    default_jurisdiction: "India",
    letterhead_instructions: "",
    enable_docx_export: true,
    enable_pdf_export: true,
    add_watermark: false,
    two_factor_auth: false,
    session_timeout: true,
    logo_url: null,
  });

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetchCompanySettings();
      if (response.data) {
        setSettings((prev) => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveCompanySettings({
        company_name: settings.company_name,
        company_address: settings.company_address,
        company_phone: settings.company_phone,
        company_email: settings.company_email,
        letterhead_instructions: settings.letterhead_instructions,
        default_jurisdiction: settings.default_jurisdiction,
      });
      toast.success("Workspace settings saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      setLogoUploading(true);
      const response = await uploadCompanyLogo(formData);
      setSettings((prev) => ({ ...prev, logo_url: response.logo_url }));
      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Logo upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
        <Loader2 size={32} style={{ color: "#4f8cff", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.03em" }}>
            Workspace Settings
          </h1>
          <p style={{ fontSize: "13px", color: "#8b9ab3", marginTop: "5px" }}>
            Configure company identity, legal branding, exports, and preferences.
          </p>
        </div>

        {/* Save / Reset */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={loadSettings}
            className="btn-secondary"
            style={{ padding: "0 16px", height: "40px", fontSize: "13px" }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{ padding: "0 18px", height: "40px", fontSize: "13px" }}
          >
            {saving ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Onboarding Hint */}
      {!settings.company_name && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "14px",
            background: "rgba(79,140,255,0.06)",
            border: "1px solid rgba(79,140,255,0.20)",
          }}
        >
          <h3 style={{ fontSize: "13px", fontWeight: "600", color: "#7aabff" }}>
            Complete Workspace Setup
          </h3>
          <p style={{ fontSize: "12.5px", color: "#8b9ab3", marginTop: "4px", lineHeight: 1.6 }}>
            Add your company information so exported agreements automatically reflect your organization.
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "18px", alignItems: "start" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Organization */}
          <SectionCard icon={Building2} title="Organization Profile" subtitle="Company identity used in exported legal documents.">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

              <div>
                <FieldLabel required>Company Name</FieldLabel>
                <input
                  type="text"
                  name="company_name"
                  value={settings.company_name}
                  onChange={handleChange}
                  placeholder="LexDraft AI Ltd."
                  style={{ width: "100%", height: "46px", padding: "0 14px", fontSize: "14px" }}
                />
              </div>

              <div>
                <FieldLabel>Business Email</FieldLabel>
                <input
                  type="email"
                  name="company_email"
                  value={settings.company_email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  style={{ width: "100%", height: "46px", padding: "0 14px", fontSize: "14px" }}
                />
              </div>

              <div>
                <FieldLabel>Company Phone</FieldLabel>
                <input
                  type="text"
                  name="company_phone"
                  value={settings.company_phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  style={{ width: "100%", height: "46px", padding: "0 14px", fontSize: "14px" }}
                />
              </div>

              <div>
                <FieldLabel>Default Jurisdiction</FieldLabel>
                <select
                  name="default_jurisdiction"
                  value={settings.default_jurisdiction}
                  onChange={handleChange}
                  style={{ width: "100%", height: "46px", padding: "0 14px", fontSize: "14px" }}
                >
                  {["India", "United States", "United Kingdom", "Singapore", "European Union"].map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <FieldLabel>Company Address</FieldLabel>
                <textarea
                  rows={3}
                  name="company_address"
                  value={settings.company_address}
                  onChange={handleChange}
                  placeholder="Enter registered company address..."
                  style={{ width: "100%", padding: "12px 14px", fontSize: "14px", resize: "none" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <FieldLabel>Letterhead Instructions</FieldLabel>
                <textarea
                  rows={3}
                  name="letterhead_instructions"
                  value={settings.letterhead_instructions}
                  onChange={handleChange}
                  placeholder="Optional branding or formatting instructions for exported documents..."
                  style={{ width: "100%", padding: "12px 14px", fontSize: "14px", resize: "none" }}
                />
              </div>
            </div>
          </SectionCard>

          {/* Export */}
          <SectionCard icon={FileSignature} title="Export Preferences" subtitle="Configure enterprise document export behavior.">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { key: "enable_docx_export", title: "Enable DOCX Export", desc: "Allow Microsoft Word downloads" },
                { key: "enable_pdf_export", title: "Enable PDF Export", desc: "Generate printable legal documents" },
                { key: "add_watermark", title: "Add Company Watermark", desc: "Apply branding to exported files" },
              ].map((item) => (
                <ToggleRow
                  key={item.key}
                  title={item.title}
                  desc={item.desc}
                  checked={settings[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Branding */}
          <SectionCard icon={Upload} title="Branding" subtitle="Company logo for legal exports.">
            {/* Upload Area */}
            <div
              style={{
                border: "2px dashed rgba(255,255,255,0.10)",
                borderRadius: "16px",
                padding: "28px 20px",
                textAlign: "center",
                background: "rgba(255,255,255,0.015)",
                marginBottom: "16px",
              }}
            >
              {settings.logo_url ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "16px",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    }}
                  >
                    <img
                      src={`http://localhost:5000${settings.logo_url}`}
                      alt="Company Logo"
                      style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }}
                    />
                  </div>
                  <p style={{ fontSize: "12px", color: "#22c55e", fontWeight: "600" }}>
                    ✓ Logo uploaded
                  </p>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 14px",
                    }}
                  >
                    <Upload size={20} style={{ color: "#8b9ab3" }} />
                  </div>
                  <h3 style={{ fontSize: "13.5px", fontWeight: "600", color: "#f1f5f9", marginBottom: "6px" }}>
                    Upload Company Logo
                  </h3>
                  <p style={{ fontSize: "11.5px", color: "#8b9ab3", lineHeight: 1.6 }}>
                    Appears in exported agreements and branded legal documents.
                  </p>
                </div>
              )}
            </div>

            <label style={{ display: "block", cursor: "pointer" }}>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.svg"
                onChange={handleLogoUpload}
                style={{ display: "none" }}
              />
              <div
                className="btn-primary"
                style={{ justifyContent: "center", height: "40px", fontSize: "13px", pointerEvents: "none" }}
              >
                {logoUploading ? (
                  <><Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> Uploading...</>
                ) : (
                  <><Upload size={14} /> {settings.logo_url ? "Replace Logo" : "Upload Logo"}</>
                )}
              </div>
            </label>
          </SectionCard>

          {/* Security */}
          <SectionCard icon={ShieldCheck} title="Security" subtitle="Workspace protection preferences.">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { key: "two_factor_auth", title: "Two-Factor Auth", desc: "Additional account protection" },
                { key: "session_timeout", title: "Session Timeout", desc: "Auto-logout after inactivity" },
              ].map((item) => (
                <ToggleRow
                  key={item.key}
                  title={item.title}
                  desc={item.desc}
                  checked={settings[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
              ))}
            </div>

            {/* Security Notice */}
            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <p style={{ fontSize: "12px", color: "#86efac", fontWeight: "500" }}>
                🔒 Your workspace data is encrypted at rest with AES-256.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;