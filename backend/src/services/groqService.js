import Groq from "groq-sdk";


// ======================================
// GROQ CLIENT CACHE
// ======================================

let groqClient = null;


// ======================================
// INITIALIZE GROQ CLIENT
// ======================================

export const initializeGroqClient =
() => {

  try {

    // ======================================
    // RETURN CACHED CLIENT
    // ======================================

    if (groqClient) {

      return groqClient;
    }


    // ======================================
    // VALIDATE API KEY
    // ======================================

    if (
      !process.env.GROQ_API_KEY
    ) {

      throw new Error(

        "GROQ_API_KEY missing in .env file"
      );
    }


    // ======================================
    // CREATE CLIENT
    // ======================================

    groqClient = new Groq({

      apiKey:
        process.env.GROQ_API_KEY
    });


    console.log(
      "Groq client initialized"
    );

    return groqClient;

  } catch (error) {

    console.error(
      "Groq initialization error:",
      error
    );

    throw error;
  }
};


// ======================================
// GENERATE LEGAL DOCUMENT
// ======================================

export const generateDocument =
async (

  systemPrompt,

  userPrompt

) => {

  try {

    const groq =
      initializeGroqClient();


    console.log(
      "Starting Groq generation..."
    );


    // ======================================
    // START TIMER
    // ======================================

    const startTime = Date.now();


    // ======================================
    // CALL GROQ API
    // ======================================

    const response =
      await groq.chat.completions.create({

        model:
          process.env.GROQ_MODEL ||
          "llama-3.3-70b-versatile",

        temperature:
          parseFloat(
            process.env
              .GROQ_TEMPERATURE
          ) || 0.2,

        max_tokens:
          parseInt(
            process.env
              .GROQ_MAX_TOKENS
          ) || 4096,

        messages: [

          {
            role: "system",
            content: systemPrompt
          },

          {
            role: "user",
            content: userPrompt
          }
        ]
      });


    // ======================================
    // END TIMER
    // ======================================

    const endTime = Date.now();

    const generationTime =
      endTime - startTime;


    // ======================================
    // EXTRACT RESPONSE
    // ======================================

    const generatedContent =
      response.choices?.[0]
        ?.message?.content || "";


    const tokensUsed =
      response.usage
        ?.total_tokens || 0;


    console.log(
      "Groq generation complete"
    );

    console.log(
      `Tokens used:
       ${tokensUsed}`
    );

    console.log(
      `Generation time:
       ${generationTime}ms`
    );


    return {

      content:
        generatedContent,

      model:
        response.model,

      tokens_used:
        tokensUsed,

      generation_time_ms:
        generationTime
    };

  } catch (error) {

    console.error(
      "Groq generation error:",
      error
    );


    // ======================================
    // INVALID API KEY
    // ======================================

    if (
      error.status === 401
    ) {

      throw new Error(

        "Invalid Groq API key. " +
        "Check GROQ_API_KEY in .env"
      );
    }


    // ======================================
    // RATE LIMIT
    // ======================================

    if (
      error.status === 429
    ) {

      throw new Error(

        "Groq rate limit exceeded. " +
        "Wait one minute and retry."
      );
    }


    // ======================================
    // MODEL NOT FOUND
    // ======================================

    if (
      error.status === 404
    ) {

      throw new Error(

        "Groq model not found. " +
        "Use llama-3.3-70b-versatile"
      );
    }


    // ======================================
    // NETWORK TIMEOUT
    // ======================================

    if (
      error.code ===
      "ETIMEDOUT"
    ) {

      throw new Error(

        "Groq request timed out after 60 seconds"
      );
    }


    // ======================================
    // FALLBACK ERROR
    // ======================================

    throw new Error(

      error.message ||
      "Groq document generation failed"
    );
  }
};


// ======================================
// TEST GROQ CONNECTION
// ======================================

export const testGroqConnection =
async () => {

  try {

    const groq =
      initializeGroqClient();


    console.log(
      "Testing Groq connection..."
    );


    // ======================================
    // START TIMER
    // ======================================

    const startTime =
      Date.now();


    // ======================================
    // SIMPLE TEST CALL
    // ======================================

    const response =
      await groq.chat.completions.create({

        model:
          process.env.GROQ_MODEL ||
          "llama-3.3-70b-versatile",

        messages: [

          {
            role: "user",
            content:
              "Reply with: Groq connection successful"
          }
        ],

        max_tokens: 20
      });


    // ======================================
    // END TIMER
    // ======================================

    const latency =
      Date.now() - startTime;


    console.log(
      "Groq connection successful"
    );


    return {

      connected: true,

      model:
        response.model,

      latency_ms:
        latency
    };

  } catch (error) {

    console.error(
      "Groq connection test failed:",
      error
    );

    return {

      connected: false,

      error:
        error.message
    };
  }
};


// ======================================
// EXPORTS
// ======================================

export default {

  initializeGroqClient,

  generateDocument,

  testGroqConnection
};