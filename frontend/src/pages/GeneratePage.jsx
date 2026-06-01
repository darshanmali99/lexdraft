import {
  useState,
} from "react";

import {
  Sparkles,
  FileText,
  ChevronRight,
  Loader2,
} from "lucide-react";

import {
  generateDocument,
} from "../services/documentService";

import toast from "react-hot-toast";


function GeneratePage() {

  // ======================================
  // FORM STATE
  // ======================================

  const [formData, setFormData] =
  useState({

    
      document_type_id:
        "18efdb97-9abb-48e1-a313-f97bb8ff60b0",
        

      client_name: "",

      jurisdiction:
        "India",

      special_requirements: "",

    });


  // ======================================
  // UI STATE
  // ======================================

  const [loading, setLoading] =
    useState(false);

  const [generatedDraft,
    setGeneratedDraft] =
    useState("");


  // ======================================
  // HANDLE INPUT
  // ======================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // ======================================
  // GENERATE DOCUMENT
  // ======================================

  const handleGenerate =
    async () => {

      try {

        setLoading(true);

        const response =
          await generateDocument(
            formData
          );

        setGeneratedDraft(

          response.document
            ?.generated_draft ||

          "No draft generated."
        );

        toast.success(
          "Document generated successfully"
        );

      } catch (error) {

        console.error(error);

        toast.error(

          error?.response?.data?.error ||

          "Generation failed"
        );

      } finally {

        setLoading(false);
      }
    };


  // ======================================
  // COMPONENT
  // ======================================

  return (

    <div className="space-y-10 fade-in">

      {/* Header */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Generate Document
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl">
            Create AI-powered legal agreements
            using enterprise AI workflows.
          </p>

        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <span>AI Assistant</span>

          <ChevronRight size={14} />

          <span className="text-slate-300">
            Document Generation
          </span>

        </div>

      </div>


      {/* Main Grid */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">

        {/* ======================================
            LEFT PANEL
        ====================================== */}

        <div className="card p-7">

          <div className="mb-8">

            <h2 className="text-lg font-semibold">
              Document Details
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Configure AI legal generation parameters.
            </p>

          </div>


          <div className="space-y-6">

            {/* Document Type */}

            <div>

              <label className="block text-sm font-medium mb-3 text-slate-300">

                Document Type

              </label>

              <select
  name="document_type_id"
  value={formData.document_type_id}
  onChange={handleChange}
  className="w-full h-12 px-4 text-sm"
>

  <option value="18efdb97-9abb-48e1-a313-f97bb8ff60b0">
  NDA
</option>

  <option value={2}>
    Employment Contract
  </option>

  <option value={3}>
    Service Agreement
  </option>

  <option value={4}>
    Privacy Policy
  </option>

</select>

            </div>


            {/* Client Name */}

            <div>

              <label className="block text-sm font-medium mb-3 text-slate-300">

                Client Name

              </label>

              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="Enter client/company name"
                className="w-full h-12 px-4 text-sm"
              />

            </div>

{/* Client Company */}

<div>

  <label className="block text-sm font-medium mb-3 text-slate-300">

    Client Company

  </label>

  <input
    type="text"
    name="client_company"
    value={formData.client_company}
    onChange={handleChange}
    placeholder="Enter company name"
    className="w-full h-12 px-4 text-sm"
  />

</div>


{/* Client Address */}

<div>

  <label className="block text-sm font-medium mb-3 text-slate-300">

    Client Address

  </label>

  <textarea
    rows="3"
    name="client_address"
    value={formData.client_address}
    onChange={handleChange}
    placeholder="Enter registered business address"
    className="w-full px-4 py-4 text-sm resize-none"
  />

</div>


{/* Effective Date */}

<div>

  <label className="block text-sm font-medium mb-3 text-slate-300">

    Effective Date

  </label>

  <input
    type="date"
    name="effective_date"
    value={formData.effective_date}
    onChange={handleChange}
    className="w-full h-12 px-4 text-sm"
  />

</div>


{/* Agreement Term */}

<div>

  <label className="block text-sm font-medium mb-3 text-slate-300">

    Agreement Term (Years)

  </label>

  <input
    type="number"
    min="1"
    max="10"
    name="term_years"
    value={formData.term_years}
    onChange={handleChange}
    className="w-full h-12 px-4 text-sm"
  />

</div>

            {/* Jurisdiction */}

            <div>

              <label className="block text-sm font-medium mb-3 text-slate-300">

                Jurisdiction

              </label>

              <select
                name="jurisdiction"
                value={formData.jurisdiction}
                onChange={handleChange}
                className="w-full h-12 px-4 text-sm"
              >

                <option>India</option>

                <option>United States</option>

                <option>United Kingdom</option>

                <option>European Union</option>

              </select>

            </div>


            {/* AI Instructions */}

            <div>

              <label className="block text-sm font-medium mb-3 text-slate-300">

                AI Instructions

              </label>

              <textarea
                rows="8"
                name="special_requirements"
                value={
                  formData.special_requirements
                }
                onChange={handleChange}
                placeholder="Describe legal requirements, clauses, payment terms, responsibilities..."
                className="w-full px-4 py-4 text-sm resize-none"
              />

            </div>


            {/* Generate Button */}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary h-12 px-6 text-sm flex items-center gap-2 disabled:opacity-50"
            >

              {loading ? (

                <>

                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Generating...

                </>

              ) : (

                <>

                  <Sparkles size={16} />

                  Generate Legal Document

                </>

              )}

            </button>

          </div>

        </div>


        {/* ======================================
            PREVIEW PANEL
        ====================================== */}

        <div className="card p-7 flex flex-col">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-lg font-semibold">
                Document Preview
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                AI-generated legal content
              </p>

            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-slate-400">

              Draft

            </span>

          </div>


          {/* Preview */}

          <div className="h-[75vh] rounded-3xl border border-white/5 bg-[#0f131b] p-8 overflow-y-auto">

            {generatedDraft ? (

              <div className="prose prose-invert max-w-none">

                <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-7 font-sans">

                  {generatedDraft}

                </pre>

              </div>

            ) : (

              <div className="h-full flex items-center justify-center text-slate-500 text-sm">

                Generated legal draft will appear here.

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default GeneratePage;