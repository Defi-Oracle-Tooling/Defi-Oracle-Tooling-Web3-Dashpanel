import axios, { AxiosError } from "axios";

/**
 * Tatum.io integration sample.
 * Replace dummy implementation with actual SDK/API calls.
 */
export default async function tatumIntegration(): Promise<object> {
  try {
    // TODO: Replace simulated API call with actual Tatum API interaction.
    // Ensure TATUM_API_KEY environment variable is set.
    // Consider using the Tatum SDK (@tatumio/tatum) for easier integration.
    const response = await axios.get("https://api.tatum.io/v3/wallet", {
      headers: { "x-api-key": process.env.TATUM_API_KEY || "" },
      timeout: 10000, // Add a timeout
    });
    return { service: "Tatum.io", status: "operational", data: response.data };
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    let errorType = "IntegrationError";
    let errorDetails = null;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      errorType = "APIError";
      errorMessage = axiosError.message;
      errorDetails = {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        code: axiosError.code,
      };
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      service: "Tatum.io",
      status: "error",
      error: {
        type: errorType,
        message: errorMessage,
        details: errorDetails,
      },
    };
  }
}
