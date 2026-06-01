import {

  useEffect,
  useState

} from "react";

import toast from "react-hot-toast";

import {
  Building2,
  ShieldCheck,
  FileSignature,
  Upload,
  Loader2,
} from "lucide-react";

import {

  fetchCompanySettings,

  saveCompanySettings,

  uploadCompanyLogo,

} from "../services/kbService";


function SettingsPage() {

  // ======================================
  // STATE
  // ======================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [logoUploading, setLogoUploading] =
    useState(false); 

  const [settings, setSettings] =
    useState({

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
    });


  // ======================================
  // LOAD SETTINGS
  // ======================================

  useEffect(() => {

    loadSettings();

  }, []);


  const loadSettings =
  async () => {

    try {

      setLoading(true);

      const response =
        await fetchCompanySettings();

      if (response.data) {

        setSettings((prev) => ({

          ...prev,

          ...response.data,
        }));
      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load settings"
      );

    } finally {

      setLoading(false);
    }
  };


  // ======================================
  // HANDLE CHANGE
  // ======================================

  const handleChange =
  (e) => {

    const {
      name,
      value,
    } = e.target;

    setSettings((prev) => ({

      ...prev,

      [name]: value,
    }));
  };


  // ======================================
  // HANDLE TOGGLE
  // ======================================

  const handleToggle =
  (name) => {

    setSettings((prev) => ({

      ...prev,

      [name]:
        !prev[name],
    }));
  };


  // ======================================
  // SAVE SETTINGS
  // ======================================

  const handleSave =
  async () => {

    try {

      setSaving(true);

      await saveCompanySettings({

        company_name:
          settings.company_name,

        company_address:
          settings.company_address,

        company_phone:
          settings.company_phone,

        company_email:
          settings.company_email,

        letterhead_instructions:
          settings.letterhead_instructions,

        default_jurisdiction:
          settings.default_jurisdiction,
      });

      toast.success(
        "Workspace settings saved"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to save settings"
      );

    } finally {

      setSaving(false);
    }
  };

// ======================================
// HANDLE LOGO UPLOAD
// ======================================

const handleLogoUpload =
async (e) => {

  try {

    const file =
      e.target.files[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    setLogoUploading(true);

    const response =
      await uploadCompanyLogo(
        formData
      );

    setSettings((prev) => ({

      ...prev,

      logo_url:
        response.logo_url,
    }));

    toast.success(
      "Logo uploaded successfully"
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Logo upload failed"
    );

  } finally {

    setLogoUploading(false);
  }
};  

  // ======================================
  // LOADING STATE
  // ======================================

  if (loading) {

    return (

      <div className="flex items-center justify-center py-24">

        <Loader2
          size={36}
          className="animate-spin text-blue-400"
        />

      </div>
    );
  }


  // ======================================
  // COMPONENT
  // ======================================

  return (

    <div className="space-y-10 fade-in">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-semibold tracking-tight">

          Workspace Settings

        </h1>

        <p className="text-slate-500 mt-3 max-w-2xl">

          Configure company identity,
          legal branding,
          export behavior,
          and workspace preferences.

        </p>

      </div>


      {/* Onboarding Hint */}

      {!settings.company_name && (

        <div className="card p-5 border border-blue-500/20 bg-blue-500/5">

          <h3 className="text-sm font-semibold text-blue-300">

            Complete Workspace Setup

          </h3>

          <p className="text-sm text-slate-400 mt-2 leading-relaxed">

            Add your company information and legal branding
            so exported agreements automatically reflect
            your organization identity.

          </p>

        </div>
      )}


      {/* Main Grid */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left */}

        <div className="xl:col-span-2 space-y-6">

          {/* Organization */}

          <div className="card p-7">

            <div className="flex items-start gap-4 mb-8">

              <div className="w-11 h-11 rounded-2xl bg-white/[0.04] flex items-center justify-center">

                <Building2
                  size={18}
                  className="text-slate-300"
                />

              </div>

              <div>

                <h2 className="text-lg font-semibold">

                  Organization Profile

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Company identity used in exported legal documents.

                </p>

              </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Company Name */}

              <div>

                <label className="block text-sm text-slate-400 mb-3">

                  Company Name

                </label>

                <input
                  type="text"
                  name="company_name"
                  value={settings.company_name}
                  onChange={handleChange}
                  placeholder="LexDraft AI"
                  className="w-full h-12 px-4 text-sm"
                />

              </div>


              {/* Email */}

              <div>

                <label className="block text-sm text-slate-400 mb-3">

                  Business Email

                </label>

                <input
                  type="email"
                  name="company_email"
                  value={settings.company_email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  className="w-full h-12 px-4 text-sm"
                />

              </div>


              {/* Phone */}

              <div>

                <label className="block text-sm text-slate-400 mb-3">

                  Company Phone

                </label>

                <input
                  type="text"
                  name="company_phone"
                  value={settings.company_phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full h-12 px-4 text-sm"
                />

              </div>


              {/* Jurisdiction */}

              <div>

                <label className="block text-sm text-slate-400 mb-3">

                  Default Jurisdiction

                </label>

                <select
                  name="default_jurisdiction"
                  value={settings.default_jurisdiction}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-sm bg-[#111827] text-white border border-white/10 rounded-2xl"
                >

                  <option value="India">
                    India
                  </option>

                  <option value="United States">
                    United States
                  </option>

                  <option value="United Kingdom">
                    United Kingdom
                  </option>

                  <option value="Singapore">
                    Singapore
                  </option>

                </select>

              </div>


              {/* Address */}

              <div className="md:col-span-2">

                <label className="block text-sm text-slate-400 mb-3">

                  Company Address

                </label>

                <textarea
                  rows="4"
                  name="company_address"
                  value={settings.company_address}
                  onChange={handleChange}
                  placeholder="Enter company address..."
                  className="w-full px-4 py-4 text-sm resize-none"
                />

              </div>


              {/* Letterhead */}

              <div className="md:col-span-2">

                <label className="block text-sm text-slate-400 mb-3">

                  Letterhead Instructions

                </label>

                <textarea
                  rows="4"
                  name="letterhead_instructions"
                  value={settings.letterhead_instructions}
                  onChange={handleChange}
                  placeholder="Optional branding instructions..."
                  className="w-full px-4 py-4 text-sm resize-none"
                />

              </div>

            </div>

          </div>


          {/* Export Settings */}

          <div className="card p-7">

            <div className="flex items-start gap-4 mb-8">

              <div className="w-11 h-11 rounded-2xl bg-white/[0.04] flex items-center justify-center">

                <FileSignature
                  size={18}
                  className="text-slate-300"
                />

              </div>

              <div>

                <h2 className="text-lg font-semibold">

                  Export Preferences

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Configure enterprise document export behavior.

                </p>

              </div>

            </div>


            <div className="space-y-5">

              {[
                {
                  key: "enable_docx_export",
                  title: "Enable DOCX Export",
                  desc: "Allow Microsoft Word downloads",
                },

                {
                  key: "enable_pdf_export",
                  title: "Enable PDF Export",
                  desc: "Generate printable legal documents",
                },

                {
                  key: "add_watermark",
                  title: "Add Company Watermark",
                  desc: "Apply branding to exported files",
                },

              ].map((item) => (

                <div
                  key={item.key}
                  className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
                >

                  <div>

                    <h3 className="text-sm font-medium">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {item.desc}
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-500 rounded"
                    checked={settings[item.key]}
                    onChange={() =>
                      handleToggle(item.key)
                    }
                  />

                </div>
              ))}

            </div>

          </div>

        </div>


        {/* Right */}

        <div className="space-y-6">

          {/* Branding */}

<div className="card p-7">

  <div className="flex items-start gap-4 mb-8">

    <div className="w-11 h-11 rounded-2xl bg-white/[0.04] flex items-center justify-center">

      <Upload
        size={18}
        className="text-slate-300"
      />

    </div>

    <div>

      <h2 className="text-lg font-semibold">

        Branding

      </h2>

      <p className="text-sm text-slate-500 mt-1">

        Company identity for legal exports.

      </p>

    </div>

  </div>


  {/* Upload Area */}

  <div className="border border-dashed border-white/10 rounded-3xl p-8 text-center bg-white/[0.02]">

    {/* Existing Logo */}

    {settings.logo_url ? (

      <div className="flex flex-col items-center">

  <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center overflow-hidden shadow-lg border border-white/10">

    <img
      src={`http://localhost:5000${settings.logo_url}`}
      alt="Company Logo"
      className="max-w-[80%] max-h-[80%] object-contain"
    />

  </div>

  <p className="text-sm text-slate-400 mt-5">

    Company branding uploaded successfully

  </p>

</div>

    ) : (

      <div>

        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-5">

          <Upload
            size={22}
            className="text-slate-300"
          />

        </div>

        <h3 className="text-sm font-medium">

          Upload Company Logo

        </h3>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs mx-auto">

          Your logo will automatically appear
          in exported agreements and branded legal documents.

        </p>

      </div>
    )}


    {/* Upload Button */}

    <label className="inline-flex mt-7 cursor-pointer">

      <input
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={handleLogoUpload}
        className="hidden"
      />

      <div className="btn-primary px-5 h-11 text-sm flex items-center gap-2">

        {logoUploading && (

          <Loader2
            size={16}
            className="animate-spin"
          />
        )}

        {settings.logo_url
          ? "Replace Logo"
          : "Upload Logo"}

      </div>

    </label>

  </div>

</div>
          {/* Security */}

          <div className="card p-7">

            <div className="flex items-start gap-4 mb-8">

              <div className="w-11 h-11 rounded-2xl bg-white/[0.04] flex items-center justify-center">

                <ShieldCheck
                  size={18}
                  className="text-slate-300"
                />

              </div>

              <div>

                <h2 className="text-lg font-semibold">

                  Security

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Workspace protection preferences.

                </p>

              </div>

            </div>


            <div className="space-y-5">

              {[
                {
                  key: "two_factor_auth",
                  title: "Two-Factor Authentication",
                  desc: "Additional account protection",
                },

                {
                  key: "session_timeout",
                  title: "Session Timeout",
                  desc: "Automatic logout after inactivity",
                },

              ].map((item) => (

                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >

                  <div>

                    <h3 className="text-sm font-medium">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {item.desc}
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-500 rounded"
                    checked={settings[item.key]}
                    onChange={() =>
                      handleToggle(item.key)
                    }
                  />

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>


      {/* Footer */}

      <div className="sticky bottom-0 bg-[#0b1120] py-5 flex items-center justify-end gap-4">

        <button
          onClick={loadSettings}
          className="btn-secondary h-11 px-5 text-sm"
        >

          Reset

        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary h-11 px-5 text-sm flex items-center gap-2"
        >

          {saving && (

            <Loader2
              size={16}
              className="animate-spin"
            />
          )}

          Save Changes

        </button>

      </div>

    </div>
  );
}

export default SettingsPage;