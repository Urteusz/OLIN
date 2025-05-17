const API_URL = 'http://localhost:8080/api';

export interface LoginData {
  username: string;
  password: string;
}

export const authService = {
  async login(loginData: LoginData) {
    const response = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    // Pobierz odpowiedź jako tekst, a nie JSON
    const message = await response.text();
    // Wyciągnij nazwę użytkownika z wiadomości
    const username = message.replace('Login successful. Welcome ', '');
    
    // Zwróć obiekt z danymi użytkownika
    return {
      id: username, // Używamy username jako ID, ponieważ nie mamy prawdziwego ID
      username: username,
      email: '',
      message: message
    };
  },
};
