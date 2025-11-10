import { useState } from 'react';
import {
  Code,
  Book,
  Key,
  Lock,
  FileText,
  Shield,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ApiDocumentation = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    passwords: false,
    notes: false,
    categories: false
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CodeBlock = ({ code, language = 'javascript', id }) => (
    <div className="relative group">
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copiedCode === id ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-slate-300" />
        )}
      </button>
      <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  const EndpointSection = ({ method, path, description, children }) => (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
            method === 'POST' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              method === 'PUT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
          {method}
        </span>
        <div className="flex-1">
          <code className="text-lg font-mono text-slate-800 dark:text-white">{path}</code>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/app/developer')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Developer Keys
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                API Documentation
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Complete guide to Secret Manager API
              </p>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Quick Start
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              All API requests require authentication using your API key in the Authorization header:
            </p>
            <CodeBlock
              id="auth-header"
              code={`Authorization: Bearer YOUR_API_KEY`}
            />
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              Base URL: <code className="px-2 py-1 bg-white dark:bg-slate-800 rounded">https://your-domain.com/public-api</code>
            </p>
          </div>
        </div>

        {/* Passwords Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6">
          <button
            onClick={() => toggleSection('passwords')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-2xl"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Passwords</h2>
            </div>
            {expandedSections.passwords ? (
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {expandedSections.passwords && (
            <div className="p-6 pt-0 border-t border-slate-200 dark:border-slate-700">
              <EndpointSection
                method="GET"
                path="/public-api/vault"
                description="Get all passwords in your vault"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Query Parameters</h4>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <code className="font-mono">category_id</code> (optional) - Filter by category ID
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <code className="font-mono">search</code> (optional) - Search by name or username
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="get-passwords-response"
                    language="json"
                    code={`{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "name": "GitHub",
      "username": "user@example.com",
      "encrypted_password": "...",
      "url": "https://github.com",
      "category_id": "cat123",
      "category_name": "Work",
      "notes": "Development account",
      "is_favorite": false,
      "created_at": "2025-11-10T03:04:53.319Z",
      "updated_at": "2025-11-10T03:04:53.319Z"
    }
  ]
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="POST"
                path="/public-api/vault"
                description="Create a new password entry"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Request Body</h4>
                  <CodeBlock
                    id="create-password-request"
                    language="json"
                    code={`{
  "name": "GitHub",
  "username": "user@example.com",
  "encrypted_password": "base64_encrypted_password",
  "url": "https://github.com",
  "category_id": "cat123",
  "notes": "Development account",
  "is_favorite": false
}`}
                  />
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="create-password-response"
                    language="json"
                    code={`{
  "success": true,
  "message": "Password created successfully",
  "data": {
    "id": "abc123",
    "name": "GitHub",
    ...
  }
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="PUT"
                path="/public-api/vault/:id"
                description="Update an existing password"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Request Body</h4>
                  <CodeBlock
                    id="update-password-request"
                    language="json"
                    code={`{
  "name": "GitHub Updated",
  "username": "newuser@example.com",
  "encrypted_password": "base64_encrypted_password",
  "url": "https://github.com",
  "category_id": "cat123",
  "notes": "Updated notes",
  "is_favorite": true
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="DELETE"
                path="/public-api/vault/:id"
                description="Delete a password entry"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="delete-password-response"
                    language="json"
                    code={`{
  "success": true,
  "message": "Password deleted successfully"
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="POST"
                path="/public-api/vault/:id/decrypt"
                description="Decrypt a password"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Request Body</h4>
                  <CodeBlock
                    id="decrypt-password-request"
                    language="json"
                    code={`{
  "master_password": "your_master_password"
}`}
                  />
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="decrypt-password-response"
                    language="json"
                    code={`{
  "success": true,
  "data": {
    "decrypted_password": "plain_text_password"
  }
}`}
                  />
                </div>
              </EndpointSection>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6">
          <button
            onClick={() => toggleSection('notes')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-2xl"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Secret Notes</h2>
            </div>
            {expandedSections.notes ? (
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {expandedSections.notes && (
            <div className="p-6 pt-0 border-t border-slate-200 dark:border-slate-700">
              <EndpointSection
                method="GET"
                path="/public-api/notes"
                description="Get all secret notes"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Query Parameters</h4>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <code className="font-mono">category_id</code> (optional) - Filter by category ID
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <code className="font-mono">search</code> (optional) - Search by title
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="get-notes-response"
                    language="json"
                    code={`{
  "success": true,
  "data": [
    {
      "id": "note123",
      "title": "Meeting Notes",
      "encrypted_content": "...",
      "category_id": "cat123",
      "category_name": "Work",
      "tags": ["meeting", "Q1"],
      "created_at": "2025-11-10T03:04:53.319Z",
      "updated_at": "2025-11-10T03:04:53.319Z"
    }
  ]
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="POST"
                path="/public-api/notes"
                description="Create a new secret note"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Request Body</h4>
                  <CodeBlock
                    id="create-note-request"
                    language="json"
                    code={`{
  "title": "Meeting Notes",
  "encrypted_content": "base64_encrypted_content",
  "category_id": "cat123",
  "tags": ["meeting", "Q1"]
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="GET"
                path="/public-api/notes/:id"
                description="Get a specific note"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="get-note-response"
                    language="json"
                    code={`{
  "success": true,
  "data": {
    "id": "note123",
    "title": "Meeting Notes",
    "encrypted_content": "...",
    "category_id": "cat123",
    "tags": ["meeting", "Q1"],
    "created_at": "2025-11-10T03:04:53.319Z",
    "updated_at": "2025-11-10T03:04:53.319Z"
  }
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="PUT"
                path="/public-api/notes/:id"
                description="Update a secret note"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Request Body</h4>
                  <CodeBlock
                    id="update-note-request"
                    language="json"
                    code={`{
  "title": "Updated Meeting Notes",
  "encrypted_content": "base64_encrypted_content",
  "category_id": "cat123",
  "tags": ["meeting", "Q1", "important"]
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="DELETE"
                path="/public-api/notes/:id"
                description="Delete a secret note"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="delete-note-response"
                    language="json"
                    code={`{
  "success": true,
  "message": "Note deleted successfully"
}`}
                  />
                </div>
              </EndpointSection>

              <EndpointSection
                method="POST"
                path="/public-api/notes/:id/decrypt"
                description="Decrypt a note"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Request Body</h4>
                  <CodeBlock
                    id="decrypt-note-request"
                    language="json"
                    code={`{
  "master_password": "your_master_password"
}`}
                  />
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="decrypt-note-response"
                    language="json"
                    code={`{
  "success": true,
  "data": {
    "decrypted_content": "plain_text_content"
  }
}`}
                  />
                </div>
              </EndpointSection>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-2xl"
          >
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Categories</h2>
            </div>
            {expandedSections.categories ? (
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {expandedSections.categories && (
            <div className="p-6 pt-0 border-t border-slate-200 dark:border-slate-700">
              <EndpointSection
                method="GET"
                path="/public-api/categories"
                description="Get all available categories"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Response</h4>
                  <CodeBlock
                    id="get-categories-response"
                    language="json"
                    code={`{
  "success": true,
  "data": [
    {
      "id": "cat123",
      "name": "Work",
      "icon": "briefcase",
      "color": "blue"
    },
    {
      "id": "cat456",
      "name": "Personal",
      "icon": "user",
      "color": "green"
    }
  ]
}`}
                  />
                </div>
              </EndpointSection>
            </div>
          )}
        </div>

        {/* Error Responses */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Error Responses</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            All endpoints may return the following error responses:
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">401 Unauthorized</h4>
              <CodeBlock
                id="error-401"
                language="json"
                code={`{
  "success": false,
  "message": "Invalid or missing API key"
}`}
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">404 Not Found</h4>
              <CodeBlock
                id="error-404"
                language="json"
                code={`{
  "success": false,
  "message": "Resource not found"
}`}
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">429 Too Many Requests</h4>
              <CodeBlock
                id="error-429"
                language="json"
                code={`{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}`}
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">500 Internal Server Error</h4>
              <CodeBlock
                id="error-500"
                language="json"
                code={`{
  "success": false,
  "message": "An unexpected error occurred"
}`}
              />
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Code Examples</h2>

          <div className="mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">JavaScript / Node.js</h3>
            <CodeBlock
              id="example-js"
              language="javascript"
              code={`const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://your-domain.com/api';

// Get all passwords
async function getPasswords() {
  try {
    const response = await axios.get(\`\${BASE_URL}/vault\`, {
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Passwords:', response.data.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Create a new note
async function createNote(title, encryptedContent, categoryId, tags) {
  try {
    const response = await axios.post(\`\${BASE_URL}/notes\`, {
      title,
      encrypted_content: encryptedContent,
      category_id: categoryId,
      tags
    }, {
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Note created:', response.data.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

getPasswords();`}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Python</h3>
            <CodeBlock
              id="example-python"
              language="python"
              code={`import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'https://your-domain.com/api'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Get all passwords
def get_passwords():
    response = requests.get(f'{BASE_URL}/vault', headers=headers)
    if response.status_code == 200:
        data = response.json()
        print('Passwords:', data['data'])
    else:
        print('Error:', response.json())

# Create a new note
def create_note(title, encrypted_content, category_id, tags):
    payload = {
        'title': title,
        'encrypted_content': encrypted_content,
        'category_id': category_id,
        'tags': tags
    }
    
    response = requests.post(f'{BASE_URL}/notes', json=payload, headers=headers)
    if response.status_code == 201:
        data = response.json()
        print('Note created:', data['data'])
    else:
        print('Error:', response.json())

get_passwords()`}
            />
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">cURL</h3>
            <CodeBlock
              id="example-curl"
              language="bash"
              code={`# Get all passwords
curl -X GET "https://your-domain.com/public-api/vault" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json"

# Create a new note
curl -X POST "https://your-domain.com/public-api/notes" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My Secret Note",
    "encrypted_content": "base64_encrypted_content",
    "category_id": "cat123",
    "tags": ["important", "work"]
  }'

# Delete a password
curl -X DELETE "https://your-domain.com/public-api/vault/abc123" \\
  -H "Authorization: Bearer your_api_key_here"`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
          <p className="mb-2">Need help? Have questions?</p>
          <p className="text-sm">Contact support or check our community forum</p>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
