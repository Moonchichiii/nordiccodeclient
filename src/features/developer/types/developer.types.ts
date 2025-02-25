export interface DeveloperWorksheet {
    projectId: number;
    architecture: {
      frontend: string;
      backend: string;
      database: string;
    };
    technical_specifications: {
      components: string[];
      integrations: string[];
      security: string[];
    };
    design_implementation: {
      colorPalette: string[];
      typography: {
        primary: string;
        secondary: string;
      };
      layout: string;
    };
    requirements: {
      features: string[];
      accessibility: string;
      performance: string;
    };
    developer_notes: string;
  }
  
  export interface WorksheetResponse {
    data: DeveloperWorksheet;
    status: 'draft' | 'complete';
    lastUpdated: string;
  }