//
// ======================================
// BUILD SYSTEM PROMPT
// ======================================

export const buildSystemPrompt = (
  companySettings
) => {

  try {

    const systemPrompt = `

You are a professional legal document drafting assistant for
${companySettings.company_name}, a company based in
${companySettings.default_jurisdiction}.

Your job is to generate a complete, professional legal document
using ONLY the clause text provided to you.

Do not invent or add legal language that is not based on
the provided clauses.

RULES YOU MUST FOLLOW WITHOUT EXCEPTION:

1. Use ONLY the legal content from the PROVIDED CLAUSES section

2. Fill ALL variables with the actual values provided

3. Structure the document professionally with:
   - title
   - parties section
   - recitals
   - numbered clauses
   - execution/signature block

4. Use formal legal language throughout

5. If uncertain about any section, clearly mark:
   [REVIEW NEEDED: describe issue]

6. Output clean plain text

7. The document must be complete and ready
   for professional legal review

8. Apply this letterhead style:
   ${companySettings.letterhead_instructions || "Standard legal letterhead"}

9. Default governing jurisdiction:
   ${companySettings.default_jurisdiction}

10. Never invent clauses that are not present
    in the PROVIDED CLAUSES section

`;

    return systemPrompt.trim();

  } catch (error) {

    console.error(
      "System prompt build error:",
      error
    );

    throw error;
  }
};


// ======================================
// BUILD USER PROMPT
// ======================================

export const buildUserPrompt = (

  formData,

  companySettings,

  formattedClauses

) => {

  try {

    const userPrompt = `

Generate a professional
${formData.document_type_name}
using the following details.

==================================================
PARTIES
==================================================

OUR COMPANY (Disclosing Party):

Company Name:
${companySettings.company_name}

Address:
${companySettings.company_address}

Company Email:
${companySettings.company_email}

Company Phone:
${companySettings.company_phone}


CLIENT (Receiving Party):

Client Name:
${formData.client_name}

Client Company:
${formData.client_company || "Not Provided"}

Client Address:
${formData.client_address || "Not Provided"}


==================================================
DOCUMENT REQUIREMENTS
==================================================

Document Type:
${formData.document_type_name}

Effective Date:
${formData.effective_date || "Not Provided"}

Agreement Term:
${formData.term_years || "Not Specified"} years

Jurisdiction:
${formData.jurisdiction}

Special Requirements:
${formData.special_requirements || "None"}

Extra Instructions:
${formData.extra_instructions || "None"}


==================================================
PROVIDED CLAUSES
==================================================

${formattedClauses}


==================================================
GENERATION INSTRUCTIONS
==================================================

1. Generate a complete professional legal document

2. Use ONLY the provided clauses as legal basis

3. Fill all placeholders with the EXACT values provided in the live form data.

4. ALWAYS prioritize:
   - client_name
   - client_company
   - jurisdiction
   - effective_date
   - agreement term
   from the live form input over any names, examples,
   or sample entities found in retrieved clauses.

5. NEVER reuse company names, people names,
   addresses, or examples found inside retrieved clauses.

6. Retrieved clauses are ONLY for:
   - legal structure
   - clause language
   - compliance logic
   - formatting guidance

7. ALL final entity names in the generated document
   must come ONLY from the submitted form data.

6A. The generated document MUST contain:

   - professional legal title
   - parties section
   - recitals/background
   - definitions section
   - obligations/responsibilities
   - confidentiality clauses
   - indemnification clauses
   - limitation of liability
   - governing law
   - dispute resolution
   - termination clauses
   - signature blocks

6B. Maintain enterprise legal formatting with:
   - numbered clauses
   - proper spacing
   - formal legal tone
   - section headings
   - professional readability
   
8. If uncertain about anything:
   [REVIEW NEEDED: explanation]

Generate the complete legal document now.
IMPORTANT FINAL VALIDATION:

- Ensure all party names are correct
- Ensure no unrelated entities appear
- Ensure no placeholder text remains
- Ensure all clauses are legally coherent
- Ensure formatting is professional and review-ready

`;

    return userPrompt.trim();

  } catch (error) {

    console.error(
      "User prompt build error:",
      error
    );

    throw error;
  }
};


// ======================================
// VALIDATE PROMPT LENGTH
// ======================================

export const validatePromptLength = (

  systemPrompt,

  userPrompt

) => {

  try {

    const combinedText =
      systemPrompt + userPrompt;


    // ======================================
    // TOKEN ESTIMATION
    // ======================================

    const estimatedTokens =
      Math.ceil(
        combinedText.length / 4
      );


    let warning = null;


    // ======================================
    // WARNING CHECK
    // ======================================

    if (estimatedTokens > 3000) {

      warning =
        "Prompt is large. " +
        "Generation quality may decrease.";
    }


    return {

      valid: true,

      totalTokens:
        estimatedTokens,

      warning
    };

  } catch (error) {

    console.error(
      "Prompt validation error:",
      error
    );

    throw error;
  }
};


// ======================================
// EXPORTS
// ======================================

export default {

  buildSystemPrompt,

  buildUserPrompt,

  validatePromptLength
};