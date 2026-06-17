import api, { requestHandler } from './api';

const authService = {
  login: async (email, password) => {
    return requestHandler(
      () => api.post('/auth/login', { email, password }),
      () => {
        const users = JSON.parse(localStorage.getItem('nimbus_mock_users') || '[]');
        const matchedUser = users.find(u => u.email === email && u.password === password);
        
        if (!matchedUser) {
          throw new Error('Invalid email or password.');
        }
        
        return {
          token: `mock-jwt-token-node-${matchedUser.id}`,
          user: {
            id: matchedUser.id,
            username: matchedUser.username,
            email: matchedUser.email
          }
        };
      }
    );
  },

  register: async (username, email, password) => {
    return requestHandler(
      () => api.post('/auth/register', { username, email, password }),
      () => {
        const users = JSON.parse(localStorage.getItem('nimbus_mock_users') || '[]');
        const emailExists = users.some(u => u.email === email);
        
        if (emailExists) {
          throw new Error('An account with this email already exists.');
        }

        const newUser = {
          id: Date.now(),
          username,
          email,
          password
        };

        users.push(newUser);
        localStorage.setItem('nimbus_mock_users', JSON.stringify(users));

        return {
          token: `mock-jwt-token-node-${newUser.id}`,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
          }
        };
      }
    );
  }
};

export default authService;
