import api, { requestHandler } from './api';

const projectService = {
  getProjects: async (search = '', category = '') => {
    return requestHandler(
      () => api.get('/projects', { params: { search, category } }),
      () => {
        let projects = JSON.parse(localStorage.getItem('nimbus_mock_projects') || '[]');
        
        if (category) {
          projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (search) {
          const query = search.toLowerCase();
          projects = projects.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.techStack.toLowerCase().includes(query)
          );
        }

        // Sort by newest first
        return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    );
  },

  getProjectById: async (id) => {
    const numericId = Number(id);
    return requestHandler(
      () => api.get(`/projects/${numericId}`),
      () => {
        const projects = JSON.parse(localStorage.getItem('nimbus_mock_projects') || '[]');
        const project = projects.find(p => p.id === numericId);
        
        if (!project) {
          throw new Error('Project not found');
        }

        // Increment views in mock
        project.views = (project.views || 0) + 1;
        localStorage.setItem('nimbus_mock_projects', JSON.stringify(projects));
        
        return project;
      }
    );
  },

  createProject: async (projectData) => {
    return requestHandler(
      () => api.post('/projects', projectData),
      () => {
        const projects = JSON.parse(localStorage.getItem('nimbus_mock_projects') || '[]');
        const storedUser = localStorage.getItem('nimbus_user');
        const user = storedUser ? JSON.parse(storedUser) : { id: 1, username: 'Anonymous' };

        const newProject = {
          id: Date.now(),
          title: projectData.title,
          category: projectData.category,
          techStack: projectData.techStack,
          description: projectData.description,
          demoUrl: projectData.demoUrl || '',
          thumbnail: projectData.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          userId: user.id,
          author: user.username,
          stars: 0,
          views: 0,
          createdAt: new Date().toISOString()
        };

        projects.push(newProject);
        localStorage.setItem('nimbus_mock_projects', JSON.stringify(projects));
        return newProject;
      }
    );
  },

  updateProject: async (id, projectData) => {
    const numericId = Number(id);
    return requestHandler(
      () => api.put(`/projects/${numericId}`, projectData),
      () => {
        const projects = JSON.parse(localStorage.getItem('nimbus_mock_projects') || '[]');
        const idx = projects.findIndex(p => p.id === numericId);
        
        if (idx === -1) {
          throw new Error('Project module not found');
        }

        const updatedProject = {
          ...projects[idx],
          title: projectData.title,
          category: projectData.category,
          techStack: projectData.techStack,
          description: projectData.description,
          demoUrl: projectData.demoUrl || '',
          thumbnail: projectData.thumbnail || projects[idx].thumbnail
        };

        projects[idx] = updatedProject;
        localStorage.setItem('nimbus_mock_projects', JSON.stringify(projects));
        return updatedProject;
      }
    );
  },

  deleteProject: async (id) => {
    const numericId = Number(id);
    return requestHandler(
      () => api.delete(`/projects/${numericId}`),
      () => {
        let projects = JSON.parse(localStorage.getItem('nimbus_mock_projects') || '[]');
        const initialLength = projects.length;
        projects = projects.filter(p => p.id !== numericId);
        
        if (projects.length === initialLength) {
          throw new Error('Project not found');
        }

        localStorage.setItem('nimbus_mock_projects', JSON.stringify(projects));
        return { success: true, message: 'Project deleted successfully' };
      }
    );
  }
};

export default projectService;
