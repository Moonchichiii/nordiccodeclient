// summary.types.ts

export interface WebsiteTemplate {
  sections: { [key: string]: string };
  css: string;
  js: string;
  meta: {
    colors: { [key: string]: string };
    typography: { headings: string; body: string };
    // You can add other meta fields if needed.
  };
}

export interface DeveloperNotes {
  architecture: string;
  components: string[];
  integrations: string[];
  accessibility: string;
  performance: string;
  framework: {
    primary: string;
    alternatives: string[];
    reasoning: string;
  };
}

export interface PlannerData {
  client_summary: string;
  website_template: WebsiteTemplate;
  developer_worksheet: DeveloperNotes;
}

export interface ProjectPackage {
  id: string;
  type: string;
  name: string;
  price_eur: number;
  price_sek: number;
  features: string[];
}

export interface ProjectAddon {
  id: string;
  name: string;
  price_eur: number;
  price_sek: number;
  is_included: boolean;
}

export interface ProjectSummary {
  id: number;
  title: string;
  status: string;
  package: ProjectPackage;
  addons: ProjectAddon[];
  total_price_eur: number;
  total_price_sek: number;
  planner_data: PlannerData;
}

export interface SummaryAPIResponse {
  project: ProjectSummary;
  planner: PlannerData;
}
