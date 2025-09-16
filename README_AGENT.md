# Mini Roadmap Agent

A prototype web application that generates AI-powered learning roadmaps by searching the web and processing information through Large Language Models. Similar to Manus but simplified for demonstration purposes.

## Features

- **Web Search Integration**: Searches the web using APIs to gather information about learning topics
- **AI-Powered Analysis**: Uses OpenAI's GPT models to analyze search results and generate structured learning paths
- **Interactive Visualization**: D3.js-powered graph visualization of learning roadmaps
- **Real-time Progress**: Dashboard showing completion progress with interactive node states
- **Process Transparency**: Live logs showing the AI agent's steps (search, processing, output)
- **Source Attribution**: Display of search sources used to generate the roadmap

## Architecture

### Backend (Python + FastAPI)
- **Endpoint**: `/agent/roadmap?topic=...`
- **Search Service**: Integrates with SerpAPI for web search (with mock fallback)
- **LLM Service**: Uses OpenAI API for roadmap generation (with mock fallback)
- **Data Models**: Pydantic models for structured JSON responses

### Frontend (HTML + JavaScript + D3.js)
- **Input Interface**: Topic input with generate button
- **Graph Visualization**: Interactive D3.js force-directed graph
- **Dashboard**: Progress tracking with percentage and completion stats
- **Logs Panel**: Real-time display of AI agent steps
- **Sources Panel**: List of web sources with titles, snippets, and URLs

## Installation

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Setup

1. **Clone or download the project files**
   ```bash
   # All files should be in the same directory:
   # - server.py
   # - index.html
   # - requirements.txt
   # - .env.example
   # - README.md
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables (Optional)**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys:
   # OPENAI_API_KEY=your_openai_api_key_here
   # SERPAPI_KEY=your_serpapi_key_here
   ```

   **Note**: The application works without API keys using mock data for demonstration purposes.

4. **Run the server**
   ```bash
   python server.py
   ```

5. **Open the application**
   - Open your browser and go to `http://localhost:8000/static/index.html`
   - Or access the API directly at `http://localhost:8000`

## Usage

1. **Enter a Learning Topic**
   - Type any learning topic in the input field (e.g., "Python basics", "JLPT N1 grammar", "Machine Learning")
   
2. **Generate Roadmap**
   - Click "Generate Roadmap" or press Enter
   - Watch the agent logs as it searches and processes information

3. **Interact with the Roadmap**
   - **Drag nodes** to rearrange the graph
   - **Click nodes** to toggle between learned/unlearned states
   - **Hover nodes** to see detailed information
   - **Zoom and pan** the graph for better navigation

4. **Monitor Progress**
   - Dashboard shows completion percentage
   - Green nodes are "learned", gray nodes are "unlearned"
   - Orange borders indicate "recommended" nodes (next steps)

## API Response Format

```json
{
  "topic": "Python basics",
  "nodes": [
    {
      "id": "node1",
      "title": "Python Syntax & Variables",
      "kind": "concept",
      "brief": "Learn basic Python syntax, data types, and variable declarations."
    }
  ],
  "edges": [
    {
      "source": "node1",
      "target": "node2",
      "relation": "prereq"
    }
  ],
  "sources": [
    {
      "title": "Complete Guide to Python",
      "url": "https://example.com/guide",
      "snippet": "Learn Python from basics to advanced concepts..."
    }
  ],
  "logs": [
    {
      "ts": "2023-12-07T10:30:00",
      "stage": "search",
      "message": "Starting web search for topic: Python basics"
    }
  ]
}
```

## Configuration

### API Keys (Optional)
- **OpenAI API Key**: For real LLM processing instead of mock responses
- **SerpAPI Key**: For real web search instead of mock results

### Mock Data
Without API keys, the application uses intelligent mock data that:
- Generates topic-specific roadmaps (special handling for "Python" topics)
- Provides realistic search results
- Demonstrates all functionality

## Development

### Project Structure
```
├── server.py          # FastAPI backend server
├── index.html         # Frontend with D3.js visualization
├── requirements.txt   # Python dependencies
├── .env.example      # Environment variables template
└── README.md         # This file
```

### Key Components

#### Backend Services
- `SearchService`: Web search functionality with SerpAPI integration
- `LLMService`: OpenAI integration for roadmap generation
- `FastAPI app`: REST API with CORS support

#### Frontend Classes
- `RoadmapAgent`: Main application class handling UI and visualization
- D3.js simulation: Force-directed graph with drag, zoom, and interaction
- Dashboard: Real-time progress tracking
- Panels: Logs and sources display

### Customization
- **Styling**: Modify CSS in `index.html` for different themes
- **Mock Data**: Update `_get_mock_roadmap()` for different sample roadmaps
- **Graph Layout**: Adjust D3.js force simulation parameters
- **Search Results**: Modify `_get_mock_search_results()` for different sample sources

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`

2. **CORS errors in browser**
   - Access via `http://localhost:8000/static/index.html` (not file:// protocol)

3. **API key errors**
   - Application works without API keys using mock data
   - Check `.env` file format if using real APIs

4. **Graph not displaying**
   - Check browser console for JavaScript errors
   - Ensure D3.js is loading from CDN

5. **Server won't start**
   - Check if port 8000 is available
   - Try a different port: `uvicorn server:app --port 8001`

### Performance Notes
- Mock mode responds instantly
- Real API mode may take 5-10 seconds for search + LLM processing
- Graph rendering is optimized for up to 20 nodes

## Future Enhancements

- **User Authentication**: Save and track personal learning progress
- **Multiple Graph Layouts**: Tree, hierarchical, and circular layouts
- **Export Functionality**: Save roadmaps as PDF or image files
- **Collaborative Features**: Share roadmaps with others
- **Progress Tracking**: Persistent storage of learning progress
- **Resource Integration**: Direct links to learning materials
- **Advanced Search**: Multiple search engines and source filtering

## License

This is a prototype/demonstration project. Feel free to use and modify for educational purposes.
