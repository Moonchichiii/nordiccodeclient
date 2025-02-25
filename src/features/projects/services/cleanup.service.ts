// src/features/projects/services/cleanup.service.ts
export class ProjectCleanupService {
    private static EXPIRATION_HOURS = 24;
  
    static async cleanupStaleProjects(): Promise<void> {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() - this.EXPIRATION_HOURS);
  
      try {
        await axios.post('/api/projects/cleanup', {
          expirationDate: expirationDate.toISOString(),
          status: ['draft', 'planning'],
        });
      } catch (error) {
        console.error('Failed to cleanup stale projects:', error);
      }
    }
  }