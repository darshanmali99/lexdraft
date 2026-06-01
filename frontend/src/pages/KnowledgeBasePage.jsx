import {
  useEffect,
  useState,
} from "react";

import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  fetchTemplates,
  uploadTemplate,
} from "../services/kbService";


function KnowledgeBasePage() {

  // ======================================
  // STATE
  // ======================================

  const [files, setFiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading,
    setUploading] =
    useState(false);


  // ======================================
  // FETCH TEMPLATES
  // ======================================

  const loadTemplates =
    async () => {

      try {

        const data =
          await fetchTemplates();

        setFiles(data.templates || []);

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load templates"
        );

      } finally {

        setLoading(false);
      }
    };


  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {

    loadTemplates();

  }, []);


  // ======================================
  // HANDLE FILE UPLOAD
  // ======================================

  const handleUpload =
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

        setUploading(true);

        await uploadTemplate(
          formData
        );

        toast.success(
          "Template uploaded successfully"
        );

        loadTemplates();

      } catch (error) {

        console.error(error);

        toast.error(
          "Upload failed"
        );

      } finally {

        setUploading(false);
      }
    };


  return (

    <div className="space-y-10 fade-in">

      {/* Header */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Knowledge Base
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl">

            Upload legal templates and build your enterprise AI retrieval system.

          </p>

        </div>

      </div>


      {/* Upload Zone */}

      <div className="card p-10">

        <div className="border border-dashed border-white/10 rounded-3xl p-14 flex flex-col items-center justify-center text-center bg-white/[0.02]">

          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">

            <Upload
              size={24}
              className="text-slate-300"
            />

          </div>

          <h3 className="text-xl font-semibold">

            Upload Legal Templates

          </h3>

          <p className="text-slate-500 mt-3 max-w-xl leading-relaxed">

            Upload contracts, policies, compliance files,
            or legal documents to improve AI generation quality.

          </p>


          {/* Upload Input */}

          <label className="btn-primary h-11 px-5 text-sm mt-8 flex items-center gap-2 cursor-pointer">

            {uploading ? (

              <>

                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Uploading...

              </>

            ) : (

              <>

                <Upload size={16} />

                Select Files

              </>

            )}

            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
            />

          </label>

        </div>

      </div>


      {/* Templates Table */}

      <div className="card overflow-hidden">

        <div className="px-6 py-5 border-b border-white/5">

          <h3 className="text-lg font-semibold">

            Uploaded Knowledge Files

          </h3>

        </div>


        {/* Loading */}

        {loading ? (

          <div className="p-10 flex justify-center">

            <Loader2
              size={28}
              className="animate-spin text-slate-400"
            />

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b border-white/5 text-left">

                  <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-slate-500">

                    File

                  </th>

                  <th className="px-6 py-5 text-xs font-medium uppercase tracking-wider text-slate-500">

                    Status

                  </th>

                </tr>

              </thead>

              <tbody>

                {files.map((file) => (

                  <tr
                    key={file.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-2xl bg-white/[0.04] flex items-center justify-center">

                          <FileText
                            size={18}
                            className="text-slate-300"
                          />

                        </div>

                        <div>

                          <p className="text-sm font-medium">

                            {file.name}

                          </p>

                          <p className="text-xs text-slate-500 mt-1">

                            AI Knowledge Source

                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        <CheckCircle2
                          size={16}
                          className="text-green-400"
                        />

                        <span className="text-sm text-green-400">

                          Embedded

                        </span>

                      </div>

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