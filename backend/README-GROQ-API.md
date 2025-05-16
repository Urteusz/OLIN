# Groq API Integration

This document provides instructions for setting up and using the Groq API integration in the application.

## Setup

### API Key

To use the Groq API, you need to obtain an API key from [Groq](https://console.groq.com/keys).

Once you have the API key, you can set it in one of the following ways:

1. **Environment Variable (Recommended for Production)**
   
   Set the `GROQ_API_KEY` environment variable:
   
   ```bash
   # Linux/macOS
   export GROQ_API_KEY=your-api-key-here
   
   # Windows Command Prompt
   set GROQ_API_KEY=your-api-key-here
   
   # Windows PowerShell
   $env:GROQ_API_KEY="your-api-key-here"
   ```

2. **Application Properties (Development Only)**
   
   In `application.properties`, update the `groq.api.key` property:
   
   ```properties
   groq.api.key=your-api-key-here
   ```
   
   **Note:** This approach is not recommended for production as it may expose your API key if the properties file is committed to version control.

### Configuration Properties

The Groq API integration uses the following configuration properties:

- `groq.api.key`: The API key for authenticating with the Groq API
- `groq.api.base-url`: The base URL for the Groq API (default: https://api.groq.com/openai/v1)
- `groq.api.default-model`: The default model to use for chat completions (default: llama-3.3-70b-versatile)

## API Endpoints

The application exposes the following endpoints for interacting with the Groq API:

### Send a Simple Message

```
POST /api/groq/message
Content-Type: text/plain

Your message here
```

**Response:** The text response from the model.

### Send a Chat Completion Request

```
POST /api/groq/chat/completions
Content-Type: application/json

{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "user",
      "content": "Explain the importance of fast language models"
    }
  ],
  "temperature": 0.7,
  "maxTokens": 1024
}
```

**Response:** The complete chat completion response from the Groq API.

### Send Messages for Chat Completion

```
POST /api/groq/chat/messages
Content-Type: application/json

[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": "Explain the importance of fast language models"
  }
]
```

**Response:** The complete chat completion response from the Groq API.

## Security Considerations

- Always use environment variables for API keys in production environments
- Consider restricting access to the Groq API endpoints in production
- Monitor API usage to avoid unexpected costs
- Implement rate limiting to prevent abuse