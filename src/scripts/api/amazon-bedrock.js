const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

class BedrockAPI {
  /**
   * @param {Object} config - AWS configuration including region and credentials.
   */
  constructor(config) {
    this.client = new BedrockRuntimeClient(config);
  }

  // Helper function to extract the entire code block (including delimiters) if present.
  extractBlock(text) {
    const regex = /(```[\s\S]*?```)/;
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : text;
  }

  /**
   * Sends a prompt to an AWS Bedrock model.
   * @param {string} prompt - The input prompt.
   * @param {string} modelId - The identifier of the Bedrock model.
   * @returns {Promise<Object>} - An object containing the model response.
   */
  async sendMessage(prompt, modelId) {
    try {
      const command = new InvokeModelCommand({
        modelId: modelId,
        content: prompt,

        // parameters: { temperature: 0.2, maxTokens: 8000 }
      });

      const response = await this.client.send(command);
      // The field holding the model's output might differ. Here, we assume it's in response.content.
      const rawContent = response.content || "";
      const responseContent = this.extractBlock(rawContent);

      return {
        content: responseContent
      };
    } catch (error) {
      console.error("Error calling AWS Bedrock API:", error);
      throw error;
    }
  }
}

module.exports = BedrockAPI;