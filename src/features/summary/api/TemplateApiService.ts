import axios from '@/lib/axios';
import { Template } from '@/features/summary/utils/TemplateUtils';

/**
 * Service for handling template API operations
 */
export class TemplateApiService {
  /**
   * Fetches a template for a given project
   */
  static async getTemplate(projectId: number): Promise<Template> {
    try {
      const response = await axios.get(`/api/planner/submissions/${projectId}/`);
      
      if (!response.data?.website_template) {
        throw new Error('Template not found');
      }
      
      return response.data.website_template as Template;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }
  
  /**
   * Updates a template for a given project
   */
  static async updateTemplate(projectId: number, template: Template): Promise<Template> {
    try {
      const response = await axios.patch(`/api/planner/submissions/${projectId}/`, {
        website_template: template
      });
      
      if (!response.data?.website_template) {
        throw new Error('Failed to update template');
      }
      
      return response.data.website_template as Template;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }
  
  /**
   * Updates a specific section of a template
   */
  static async updateSection(projectId: number, sectionId: string, content: string): Promise<Template> {
    try {
      // First get the current template
      const template = await this.getTemplate(projectId);
      
      // Update the specific section
      if (!template.sections) {
        template.sections = {};
      }
      
      template.sections[sectionId] = content;
      
      // Save the updated template
      return await this.updateTemplate(projectId, template);
    } catch (error) {
      console.error(`Error updating section ${sectionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Updates the CSS of a template
   */
  static async updateCSS(projectId: number, css: string): Promise<Template> {
    try {
      // First get the current template
      const template = await this.getTemplate(projectId);
      
      // Update the CSS
      template.css = css;
      
      // Save the updated template
      return await this.updateTemplate(projectId, template);
    } catch (error) {
      console.error('Error updating CSS:', error);
      throw error;
    }
  }
  
  /**
   * Updates the JavaScript of a template
   */
  static async updateJS(projectId: number, js: string): Promise<Template> {
    try {
      // First get the current template
      const template = await this.getTemplate(projectId);
      
      // Update the JavaScript
      template.js = js;
      
      // Save the updated template
      return await this.updateTemplate(projectId, template);
    } catch (error) {
      console.error('Error updating JavaScript:', error);
      throw error;
    }
  }
  
  /**
   * Updates the meta information of a template
   */
  static async updateMeta(projectId: number, meta: Partial<Template['meta']>): Promise<Template> {
    try {
      // First get the current template
      const template = await this.getTemplate(projectId);
      
      // Update the meta information
      template.meta = {
        ...template.meta,
        ...meta
      };
      
      // Save the updated template
      return await this.updateTemplate(projectId, template);
    } catch (error) {
      console.error('Error updating meta:', error);
      throw error;
    }
  }
  
  /**
   * Exports a template as a downloadable file
   */
  static exportTemplate(template: Template, filename: string = 'template.json'): void {
    try {
      const data = JSON.stringify(template, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting template:', error);
      throw error;
    }
  }
  
  /**
   * Imports a template from a file
   */
  static async importTemplate(file: File): Promise<Template> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const template = JSON.parse(event.target?.result as string) as Template;
          resolve(template);
        } catch (error) {
          reject(new Error('Invalid template file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Generates a preview URL for a template
   */
  static getPreviewUrl(projectId: number): string {
    return `/preview/${projectId}`;
  }
  
  /**
   * Requests a regeneration of a template
   */
  static async regenerateTemplate(projectId: number): Promise<Template> {
    try {
      const response = await axios.post(`/api/planner/regenerate/${projectId}/`);
      
      if (!response.data?.website_template) {
        throw new Error('Failed to regenerate template');
      }
      
      return response.data.website_template as Template;
    } catch (error) {
      console.error('Error regenerating template:', error);
      throw error;
    }
  }
  
  /**
   * Creates a complete static website export
   */
  static async exportStaticWebsite(projectId: number): Promise<Blob> {
    try {
      const response = await axios.get(`/api/planner/export/${projectId}/`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exporting static website:', error);
      throw error;
    }
  }
}

export default TemplateApiService;