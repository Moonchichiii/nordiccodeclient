import { z } from 'zod';

// Base schemas for project data (unchanged)
export const packageTypeSchema = z.enum(['static', 'fullstack', 'enterprise']);

export const packageSchema = z.object({
  type: packageTypeSchema,
  name: z.string(),
  priceEUR: z.number(),
  priceSEK: z.number(),
  features: z.array(z.string()),
  extraFeatures: z.array(z.string()),
  recommended: z.boolean().optional(),
  projectId: z.number().optional(),
});

export const addonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priceEUR: z.number(),
  priceSEK: z.number(),
  compatible: z.array(packageTypeSchema),
});

// Schemas for the requirements collected by the UI

export const projectOverviewSchema = z.object({
  projectName: z.string(),
  industry: z.string(),
  vision: z.string(),
  timeline: z.string(),
});

export const businessGoalsSchema = z.object({
  primaryObjective: z.string(),
  primaryPurpose: z.array(z.string()),
  homepageSections: z.array(z.string()),
});

export const userExperienceSchema = z.object({
  // Now using enums for preset options:
  accessibility: z.enum(['standard', 'enhanced', 'full']),
  deviceSupport: z.array(z.string()),
  performanceExpectations: z.string(),
  performance: z.enum(['standard', 'high', 'premium']),
  responsive: z.enum(['mobile-first', 'desktop-first', 'unified']),
});

export const designPreferencesSchema = z.object({
  brandPersonality: z.string(),
  brandGuidelines: z.object({
    exists: z.boolean(),
    description: z.string().optional(),
  }),
  colorPalette: z.string(),
  stylePreference: z.string(),
  fontPairing: z.string(),
  userExperience: userExperienceSchema,
});

export const requirementsSchema = z.object({
  projectOverview: projectOverviewSchema,
  businessGoals: businessGoalsSchema,
  designPreferences: designPreferencesSchema,
});

// Summary schemas (unchanged)
export const plannerDataSchema = z.object({
  client_summary: z.string(),
  website_template: z.string(),
  developer_worksheet: z.union([z.string(), z.record(z.any())]),
  designPreferences: designPreferencesSchema.optional(),
});

export const projectSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
  package: packageSchema,
  addons: z.array(addonSchema),
  total_price_eur: z.number(),
  total_price_sek: z.number(),
  planner_data: plannerDataSchema,
});

export const summarySchema = z.object({
  project: projectSummarySchema,
  planner: plannerDataSchema,
  total_price_eur: z.number().optional().default(0),
});

// Helper functions with console.logs

export function validateRequirements(data: unknown) {
  console.log('validateRequirements - input data:', data);
  const result = requirementsSchema.safeParse(data);
  console.log('validateRequirements - result:', result);
  return result;
}

export function validateSummary(data: unknown) {
  console.log('validateSummary - input data:', data);
  const result = summarySchema.safeParse(data);
  console.log('validateSummary - result:', result);
  return result;
}

export function validatePackage(data: unknown) {
  console.log('validatePackage - input data:', data);
  const result = packageSchema.safeParse(data);
  console.log('validatePackage - result:', result);
  return result;
}

export function validateAddon(data: unknown) {
  console.log('validateAddon - input data:', data);
  const result = addonSchema.safeParse(data);
  console.log('validateAddon - result:', result);
  return result;
}

// Exported types
export type Package = z.infer<typeof packageSchema>;
export type Addon = z.infer<typeof addonSchema>;
export type Requirements = z.infer<typeof requirementsSchema>;
export type Summary = z.infer<typeof summarySchema>;
