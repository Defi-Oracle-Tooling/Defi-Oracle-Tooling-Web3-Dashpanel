import axios, { AxiosError } from "axios";

/**
 * Shared integration logic for Aave-Special-Lever.
 * Replace with actual API calls and processing as needed.
 */
export default async function aaveSpecialLeverIntegration(): Promise<object> {
  try {
    // TODO: Replace simulated API call with actual Aave API interaction.
    // Ensure AAVE_API_KEY environment variable is set.
    // Consider using an Aave SDK if available.
    const response = await axios.get("https://api.aave.com/v2/leveraged", {
      headers: {
        Authorization: `Bearer ${process.env.AAVE_API_KEY || ""}`,
      },
      timeout: 10000, // Add a timeout
    });
    return {
      service: "Aave Special Lever",
      status: "operational",
      data: response.data,
    };
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
      service: "Aave Special Lever",
      status: "error",
      error: {
        type: errorType,
        message: errorMessage,
        details: errorDetails,
      },
    };
  }
}
