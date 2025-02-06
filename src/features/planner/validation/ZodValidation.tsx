import { z } from 'zod';

const SummarySchema = z.object({
  client_summary: z.string(),
  developer_worksheet: z.string(),
});

async function processAISummary(responseText: string) {
  try {
    const result = JSON.parse(responseText);
    return SummarySchema.parse(result);
  } catch (e) {
    // Handle parsing or validation error
    console.error("Failed to validate AI response:", e);
    throw e;
  }
}
