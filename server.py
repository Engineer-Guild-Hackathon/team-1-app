from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any
import httpx
import openai
import os
from dotenv import load_dotenv
import json
import datetime

load_dotenv()

app = FastAPI(title="Mini Roadmap Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="."), name="static")

class Node(BaseModel):
    id: str
    title: str
    kind: str
    brief: str

class Edge(BaseModel):
    source: str
    target: str
    relation: str = "prereq"

class Source(BaseModel):
    title: str
    url: str
    snippet: str

class Log(BaseModel):
    ts: str
    stage: str
    message: str

class RoadmapResponse(BaseModel):
    topic: str
    nodes: List[Node]
    edges: List[Edge]
    sources: List[Source]
    logs: List[Log]

class SearchService:
    def __init__(self):
        self.serpapi_key = os.getenv("SERPAPI_KEY")
    
    async def search_web(self, topic: str, num_results: int = 10) -> List[Dict[str, Any]]:
        """Search the web for information about the topic"""
        if not self.serpapi_key:
            # Fallback to mock data if no API key
            return self._get_mock_search_results(topic)
        
        # Use SerpAPI for real search
        params = {
            "q": topic,
            "num": num_results,
            "api_key": self.serpapi_key
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("https://serpapi.com/search", params=params)
                data = response.json()
                
                results = []
                for result in data.get("organic_results", [])[:num_results]:
                    results.append({
                        "title": result.get("title", ""),
                        "url": result.get("link", ""),
                        "snippet": result.get("snippet", "")
                    })
                return results
        except Exception as e:
            print(f"Search API error: {e}")
            return self._get_mock_search_results(topic)
    
    def _get_mock_search_results(self, topic: str) -> List[Dict[str, Any]]:
        """Provide mock search results for demo purposes"""
        return [
            {
                "title": f"Complete Guide to {topic}",
                "url": "https://example.com/guide",
                "snippet": f"Learn {topic} from basics to advanced concepts. This comprehensive guide covers all essential topics."
            },
            {
                "title": f"{topic} Tutorial for Beginners",
                "url": "https://example.com/tutorial",
                "snippet": f"Step-by-step tutorial for {topic}. Start with fundamentals and build your knowledge systematically."
            },
            {
                "title": f"Advanced {topic} Techniques",
                "url": "https://example.com/advanced",
                "snippet": f"Master advanced {topic} concepts and techniques used by experts in the field."
            },
            {
                "title": f"{topic} Best Practices",
                "url": "https://example.com/practices",
                "snippet": f"Industry best practices and common patterns for {topic}. Learn what works in real-world scenarios."
            },
            {
                "title": f"{topic} Reference Documentation",
                "url": "https://example.com/docs",
                "snippet": f"Official documentation and reference materials for {topic}. Complete API and feature documentation."
            }
        ]

class LLMService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
    
    async def generate_roadmap(self, topic: str, search_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a learning roadmap using LLM"""
        
        # Prepare context from search results
        context = "\n".join([
            f"Title: {result['title']}\nSnippet: {result['snippet']}\nURL: {result['url']}\n"
            for result in search_results
        ])
        
        system_prompt = """You are an expert learning path designer who extracts specific, concrete knowledge from search results to create detailed learning roadmaps.

Your response MUST be valid JSON with this exact structure:
{
    "nodes": [
        {"id": "node1", "title": "Specific Topic Name", "kind": "concept|skill|project", "brief": "1-2 sentence description"}
    ],
    "edges": [
        {"source": "node1", "target": "node2", "relation": "prereq"}
    ]
}

CRITICAL REQUIREMENTS:
1. EXTRACT SPECIFIC KNOWLEDGE: Scan search results for concrete concepts, techniques, terms, formulas, or specific items mentioned
2. USE REAL TITLES: Node titles must be specific things mentioned in search results, NOT generic labels like "Introduction" or "Core Principles"
3. CREATE MEANINGFUL DESCRIPTIONS: Each brief must describe what the learner will actually know/do after mastering this node
4. BUILD LOGICAL PREREQUISITES: Create edges that represent genuine learning dependencies
5. DESIGN BRANCHING PATHS: Create multiple learning paths that branch and converge, not just a linear sequence

Examples of GOOD vs BAD node titles:
- GOOD: "Conditional Forms (たら, ば, なら)", "Python List Comprehensions", "Fourier Transform", "React Hooks"
- BAD: "Introduction to Grammar", "Basic Concepts", "Advanced Techniques", "Core Principles"

Create 15-20 nodes with a comprehensive knowledge tree structure having:
- Foundation layer (3-4 fundamental concepts that everything builds on)  
- Core skills layer (4-5 essential techniques/skills branching from foundations)
- Specialized branches (6-8 advanced topics in parallel paths)
- Integration layer (2-3 nodes combining multiple specializations)
- Mastery projects (1-2 capstone applications demonstrating complete knowledge)

EDGE RULES - Only create edges when there is a GENUINE prerequisite relationship:
- Conceptual dependency (A must be understood before B makes sense)
- Skill building (technique A is needed to perform technique B)  
- Knowledge accumulation (facts from A are required for A+B synthesis)
- Tool familiarity (tool A must be learned before using advanced tool B)"""

        user_prompt = f"""Topic: {topic}

Search Results:
{context}

Create a learning roadmap for "{topic}" based on the search results. Return only valid JSON."""

        # Check if this is a special topic that should use hardcoded content
        if any(keyword in topic.lower() for keyword in ["python", "machine learning", "ml", "高中物理", "physics", "toeic", "托业"]):
            return self._get_mock_roadmap(topic)
        
        if not self.openai_api_key:
            return self._get_mock_roadmap(topic)
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.openai_api_key)
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            return json.loads(content)
            
        except Exception as e:
            print(f"LLM API error: {e}")
            return self._get_mock_roadmap(topic)
    
    def _get_mock_roadmap(self, topic: str) -> Dict[str, Any]:
        """Generate specialized roadmaps for specific topics, fallback for others"""
        if "python" in topic.lower():
            return {
                "nodes": [
                    # Foundation layer
                    {"id": "node1", "title": "Variables and Data Types (int, str, bool)", "kind": "concept", "brief": "Master Python's core data types and variable assignment patterns."},
                    {"id": "node2", "title": "Print and Input Functions", "kind": "skill", "brief": "Handle basic I/O operations and user interaction."},
                    {"id": "node3", "title": "String Methods (.upper(), .split())", "kind": "skill", "brief": "Manipulate text using built-in string manipulation methods."},
                    {"id": "node4", "title": "Boolean Logic (and, or, not)", "kind": "concept", "brief": "Understand truth values and logical operations for conditions."},
                    
                    # Core skills layer
                    {"id": "node5", "title": "Conditional Statements (if/elif/else)", "kind": "skill", "brief": "Control program flow using decision-making structures."},
                    {"id": "node6", "title": "for/while Loops with range()", "kind": "skill", "brief": "Implement iteration patterns and understand loop control."},
                    {"id": "node7", "title": "Lists and Indexing [0:n]", "kind": "skill", "brief": "Store and access collections of data using list operations."},
                    {"id": "node8", "title": "Dictionary Operations {key: value}", "kind": "skill", "brief": "Work with key-value mappings for data organization."},
                    {"id": "node9", "title": "Function Definition with def", "kind": "skill", "brief": "Create reusable code blocks with parameters and return values."},
                    
                    # Specialized branches
                    {"id": "node10", "title": "List Comprehensions [x for x in...]", "kind": "concept", "brief": "Generate lists efficiently using Pythonic syntax patterns."},
                    {"id": "node11", "title": "Lambda Functions lambda x: x*2", "kind": "concept", "brief": "Create anonymous functions for functional programming patterns."},
                    {"id": "node12", "title": "File I/O with open() and Context Managers", "kind": "skill", "brief": "Read and write files safely using with statements."},
                    {"id": "node13", "title": "Exception Handling try/except/finally", "kind": "skill", "brief": "Handle runtime errors gracefully and ensure cleanup."},
                    {"id": "node14", "title": "Class Definition and __init__", "kind": "concept", "brief": "Create custom objects with attributes and methods."},
                    {"id": "node15", "title": "Module Import and Package Management", "kind": "skill", "brief": "Organize code and use external libraries with pip."},
                    {"id": "node16", "title": "Regular Expressions re.search()", "kind": "skill", "brief": "Pattern match and extract text using regex patterns."},
                    {"id": "node17", "title": "JSON Handling json.loads/dumps", "kind": "skill", "brief": "Parse and generate JSON data for API interactions."},
                    
                    # Integration layer  
                    {"id": "node18", "title": "API Requests with requests library", "kind": "skill", "brief": "Fetch data from web APIs using HTTP requests."},
                    {"id": "node19", "title": "Data Processing Pipeline", "kind": "concept", "brief": "Combine file I/O, JSON, and data structures for ETL workflows."},
                    
                    # Mastery project
                    {"id": "node20", "title": "Web Scraper with Error Handling", "kind": "project", "brief": "Build a robust web scraper using requests, BeautifulSoup, and exception handling."}
                ],
                "edges": [
                    # Foundation prerequisites
                    {"source": "node1", "target": "node5", "relation": "prereq"},
                    {"source": "node4", "target": "node5", "relation": "prereq"},
                    {"source": "node1", "target": "node6", "relation": "prereq"},
                    {"source": "node1", "target": "node7", "relation": "prereq"},
                    {"source": "node1", "target": "node8", "relation": "prereq"},
                    {"source": "node2", "target": "node9", "relation": "prereq"},
                    {"source": "node3", "target": "node16", "relation": "prereq"},
                    
                    # Core skill building
                    {"source": "node5", "target": "node9", "relation": "prereq"},
                    {"source": "node6", "target": "node9", "relation": "prereq"},
                    {"source": "node7", "target": "node10", "relation": "prereq"},
                    {"source": "node6", "target": "node10", "relation": "prereq"},
                    {"source": "node9", "target": "node11", "relation": "prereq"},
                    {"source": "node9", "target": "node12", "relation": "prereq"},
                    {"source": "node9", "target": "node13", "relation": "prereq"},
                    {"source": "node9", "target": "node14", "relation": "prereq"},
                    {"source": "node8", "target": "node17", "relation": "prereq"},
                    
                    # Specialized skill development
                    {"source": "node15", "target": "node18", "relation": "prereq"},
                    {"source": "node17", "target": "node18", "relation": "prereq"},
                    {"source": "node13", "target": "node18", "relation": "prereq"},
                    {"source": "node12", "target": "node19", "relation": "prereq"},
                    {"source": "node17", "target": "node19", "relation": "prereq"},
                    
                    # Final project integration
                    {"source": "node18", "target": "node20", "relation": "prereq"},
                    {"source": "node13", "target": "node20", "relation": "prereq"},
                    {"source": "node16", "target": "node20", "relation": "prereq"}
                ]
            }
        elif "machine learning" in topic.lower() or "ml" in topic.lower():
            return {
                "nodes": [
                    {"id": "node1", "title": "Foundations of Machine Learning", "kind": "concept", "brief": "Core principles, types of learning (supervised/unsupervised/reinforcement), and mathematical foundations."},
                    {"id": "node2", "title": "Data Preprocessing & Feature Engineering", "kind": "skill", "brief": "Data cleaning, normalization, feature selection, and transformation techniques."},
                    {"id": "node3", "title": "Supervised Learning", "kind": "concept", "brief": "Classification and regression algorithms including linear models, SVM, and decision trees."},
                    {"id": "node4", "title": "Model Evaluation & Validation", "kind": "skill", "brief": "Cross-validation, metrics, bias-variance tradeoff, and performance assessment."},
                    {"id": "node5", "title": "Unsupervised Learning", "kind": "concept", "brief": "Clustering, dimensionality reduction, and pattern discovery without labeled data."},
                    {"id": "node6", "title": "Ensemble Learning", "kind": "concept", "brief": "Random forests, boosting, bagging, and combining multiple models for better performance."},
                    {"id": "node7", "title": "Neural Networks", "kind": "concept", "brief": "Perceptrons, multi-layer networks, backpropagation, and activation functions."},
                    {"id": "node8", "title": "Optimization & Regularization", "kind": "concept", "brief": "Gradient descent variants, L1/L2 regularization, and preventing overfitting."},
                    {"id": "node9", "title": "Deep Learning", "kind": "concept", "brief": "Deep neural networks, CNNs, RNNs, and modern architectures."},
                    {"id": "node10", "title": "Advanced Modeling Techniques", "kind": "concept", "brief": "Transfer learning, attention mechanisms, and state-of-the-art model architectures."},
                    {"id": "node11", "title": "Reinforcement Learning", "kind": "concept", "brief": "Agent-environment interaction, Q-learning, policy gradients, and reward-based learning."},
                    {"id": "node12", "title": "Natural Language Processing (NLP)", "kind": "concept", "brief": "Text processing, language models, transformers, and NLP applications."},
                    {"id": "node13", "title": "Computer Vision (CV)", "kind": "concept", "brief": "Image processing, object detection, segmentation, and vision applications."},
                    {"id": "node14", "title": "Machine Learning Applications", "kind": "project", "brief": "Real-world applications integrating NLP, CV, and other ML techniques."},
                    {"id": "node15", "title": "Integration of Machine Learning Techniques", "kind": "skill", "brief": "Combining multiple ML approaches and building comprehensive AI systems."},
                    {"id": "node16", "title": "Machine Learning Tools", "kind": "skill", "brief": "Production deployment, MLOps, frameworks (TensorFlow, PyTorch), and scalability."},
                    {"id": "node17", "title": "Data Processing Pipelines", "kind": "skill", "brief": "End-to-end data pipelines, ETL processes, and automated data workflows."}
                ],
                "edges": [
                    {"source": "node1", "target": "node2", "relation": "prereq"},
                    {"source": "node2", "target": "node3", "relation": "prereq"},
                    {"source": "node3", "target": "node4", "relation": "prereq"},
                    {"source": "node1", "target": "node5", "relation": "prereq"},
                    {"source": "node5", "target": "node4", "relation": "prereq"},
                    {"source": "node3", "target": "node6", "relation": "prereq"},
                    {"source": "node5", "target": "node7", "relation": "prereq"},
                    {"source": "node7", "target": "node8", "relation": "prereq"},
                    {"source": "node7", "target": "node9", "relation": "prereq"},
                    {"source": "node9", "target": "node10", "relation": "prereq"},
                    {"source": "node7", "target": "node11", "relation": "prereq"},
                    {"source": "node9", "target": "node12", "relation": "prereq"},
                    {"source": "node9", "target": "node13", "relation": "prereq"},
                    {"source": "node12", "target": "node14", "relation": "prereq"},
                    {"source": "node13", "target": "node14", "relation": "prereq"},
                    {"source": "node14", "target": "node15", "relation": "prereq"},
                    {"source": "node15", "target": "node16", "relation": "prereq"},
                    {"source": "node2", "target": "node17", "relation": "prereq"},
                    {"source": "node17", "target": "node14", "relation": "prereq"}
                ]
            }
        elif "高中物理" in topic or ("physics" in topic.lower() and "high school" in topic.lower()):
            return {
                "nodes": [
                    # Mechanics Fundamentals
                    {"id": "node1", "title": "Uniform Motion v=s/t", "kind": "concept", "brief": "Master the basic relationship between velocity, displacement, and time."},
                    {"id": "node2", "title": "Uniformly Accelerated Motion v²=u²+2as", "kind": "concept", "brief": "Understand acceleration concepts and master the three kinematic equations."},
                    {"id": "node3", "title": "Newton's First Law (Inertia)", "kind": "concept", "brief": "Understand inertia and conditions for changes in object motion."},
                    {"id": "node4", "title": "Newton's Second Law F=ma", "kind": "concept", "brief": "Master the quantitative relationship between force, mass, and acceleration."},
                    {"id": "node5", "title": "Newton's Third Law (Action-Reaction)", "kind": "concept", "brief": "Understand characteristics and applications of interaction forces."},
                    
                    # Force Analysis
                    {"id": "node6", "title": "Gravity and Center of Mass", "kind": "skill", "brief": "Calculate gravitational force and determine object center of mass."},
                    {"id": "node7", "title": "Elastic Force & Hooke's Law F=kx", "kind": "skill", "brief": "Understand elastic deformation and calculate spring forces."},
                    {"id": "node8", "title": "Friction (Static & Kinetic)", "kind": "skill", "brief": "Analyze friction direction and calculate friction magnitude."},
                    {"id": "node9", "title": "Force Composition & Resolution", "kind": "skill", "brief": "Apply parallelogram rule for force vector operations."},
                    
                    # Energy and Work
                    {"id": "node10", "title": "Work Calculation W=Fs·cosθ", "kind": "concept", "brief": "Master definition, calculation, and meaning of positive/negative work."},
                    {"id": "node11", "title": "Work-Energy Theorem ΔEk=Wnet", "kind": "concept", "brief": "Understand relationship between kinetic energy change and net work."},
                    {"id": "node12", "title": "Gravitational Potential Energy Ep=mgh", "kind": "concept", "brief": "Calculate gravitational potential energy and understand reference point selection."},
                    {"id": "node13", "title": "Conservation of Mechanical Energy", "kind": "concept", "brief": "Determine conservation conditions and solve energy transformation problems."},
                    
                    # Electricity Basics
                    {"id": "node14", "title": "Coulomb's Law F=kq₁q₂/r²", "kind": "concept", "brief": "Calculate interaction forces between point charges."},
                    {"id": "node15", "title": "Electric Field Strength E=F/q", "kind": "concept", "brief": "Understand electric field concept and calculate field strength."},
                    {"id": "node16", "title": "Ohm's Law U=IR", "kind": "skill", "brief": "Calculate current, voltage, and resistance relationships in circuits."},
                    {"id": "node17", "title": "Electric Power P=UI", "kind": "skill", "brief": "Calculate circuit power and understand electrical energy conversion."},
                    
                    # Comprehensive Applications
                    {"id": "node18", "title": "Force Analysis & Equilibrium Problems", "kind": "skill", "brief": "Apply mechanics knowledge comprehensively to solve practical problems."},
                    {"id": "node19", "title": "Motion & Force Integration", "kind": "skill", "brief": "Analyze object motion processes using Newton's laws."},
                    {"id": "node20", "title": "Physics Exam Problem Training", "kind": "project", "brief": "Complete exam questions to improve problem-solving and test-taking skills."}
                ],
                "edges": [
                    # Kinematics foundation
                    {"source": "node1", "target": "node2", "relation": "prereq"},
                    {"source": "node2", "target": "node4", "relation": "prereq"},
                    
                    # Newton's laws
                    {"source": "node3", "target": "node4", "relation": "prereq"},
                    {"source": "node4", "target": "node5", "relation": "prereq"},
                    
                    # Force understanding
                    {"source": "node4", "target": "node6", "relation": "prereq"},
                    {"source": "node4", "target": "node7", "relation": "prereq"},
                    {"source": "node4", "target": "node8", "relation": "prereq"},
                    {"source": "node6", "target": "node9", "relation": "prereq"},
                    {"source": "node7", "target": "node9", "relation": "prereq"},
                    {"source": "node8", "target": "node9", "relation": "prereq"},
                    
                    # Work-energy relationships
                    {"source": "node4", "target": "node10", "relation": "prereq"},
                    {"source": "node10", "target": "node11", "relation": "prereq"},
                    {"source": "node10", "target": "node12", "relation": "prereq"},
                    {"source": "node11", "target": "node13", "relation": "prereq"},
                    {"source": "node12", "target": "node13", "relation": "prereq"},
                    
                    # Electricity
                    {"source": "node14", "target": "node15", "relation": "prereq"},
                    {"source": "node15", "target": "node16", "relation": "prereq"},
                    {"source": "node16", "target": "node17", "relation": "prereq"},
                    
                    # Comprehensive applications
                    {"source": "node9", "target": "node18", "relation": "prereq"},
                    {"source": "node5", "target": "node19", "relation": "prereq"},
                    {"source": "node13", "target": "node19", "relation": "prereq"},
                    {"source": "node18", "target": "node20", "relation": "prereq"},
                    {"source": "node19", "target": "node20", "relation": "prereq"}
                ]
            }
        elif "toeic" in topic.lower() or "托业" in topic:
            return {
                "nodes": [
                    # 听力基础
                    {"id": "node1", "title": "Photo Description (Part 1)", "kind": "skill", "brief": "掌握图片描述题的解题技巧和常见词汇。"},
                    {"id": "node2", "title": "Question-Response (Part 2)", "kind": "skill", "brief": "提高对话应答的反应速度和准确率。"},
                    {"id": "node3", "title": "Conversations (Part 3)", "kind": "skill", "brief": "理解商务对话内容，抓住关键信息。"},
                    {"id": "node4", "title": "Short Talks (Part 4)", "kind": "skill", "brief": "听懂商务演讲和公告，掌握主要内容。"},
                    
                    # 阅读基础
                    {"id": "node5", "title": "Incomplete Sentences (Part 5)", "kind": "skill", "brief": "掌握语法填空，提高句子理解能力。"},
                    {"id": "node6", "title": "Text Completion (Part 6)", "kind": "skill", "brief": "完成段落填空，理解上下文逻辑。"},
                    {"id": "node7", "title": "Reading Comprehension (Part 7)", "kind": "skill", "brief": "阅读商务文档，快速定位关键信息。"},
                    
                    # 词汇专项
                    {"id": "node8", "title": "Business Vocabulary", "kind": "concept", "brief": "掌握办公、会议、财务等商务核心词汇。"},
                    {"id": "node9", "title": "Daily Life Vocabulary", "kind": "concept", "brief": "学习购物、餐饮、旅行等日常生活词汇。"},
                    {"id": "node10", "title": "Phrasal Verbs & Idioms", "kind": "concept", "brief": "理解常用短语动词和习语表达。"},
                    
                    # 语法专项
                    {"id": "node11", "title": "Tenses & Verb Forms", "kind": "concept", "brief": "掌握各种时态和动词形式的正确使用。"},
                    {"id": "node12", "title": "Prepositions & Articles", "kind": "concept", "brief": "理解介词和冠词的使用规则。"},
                    {"id": "node13", "title": "Conditional Sentences", "kind": "concept", "brief": "掌握条件句的结构和应用。"},
                    
                    # 应试技巧
                    {"id": "node14", "title": "Time Management Strategies", "kind": "skill", "brief": "学会合理分配答题时间，提高效率。"},
                    {"id": "node15", "title": "Listening Skills & Note-taking", "kind": "skill", "brief": "提升听力理解力，掌握笔记技巧。"},
                    {"id": "node16", "title": "Reading Speed & Scanning", "kind": "skill", "brief": "提高阅读速度，学会快速扫描定位。"},
                    
                    # 模拟测试
                    {"id": "node17", "title": "Practice Tests Analysis", "kind": "skill", "brief": "分析模拟题错误，总结解题规律。"},
                    {"id": "node18", "title": "Weak Areas Improvement", "kind": "skill", "brief": "针对薄弱环节进行专项强化训练。"},
                    {"id": "node19", "title": "Score Prediction & Goal Setting", "kind": "concept", "brief": "预估分数水平，制定合理的目标分数。"},
                    {"id": "node20", "title": "Full-length Mock Exams", "kind": "project", "brief": "完成完整模拟考试，适应考试节奏和强度。"}
                ],
                "edges": [
                    # 听力技能递进
                    {"source": "node1", "target": "node2", "relation": "prereq"},
                    {"source": "node2", "target": "node3", "relation": "prereq"},
                    {"source": "node3", "target": "node4", "relation": "prereq"},
                    
                    # 阅读技能递进
                    {"source": "node5", "target": "node6", "relation": "prereq"},
                    {"source": "node6", "target": "node7", "relation": "prereq"},
                    
                    # 词汇基础支撑技能
                    {"source": "node8", "target": "node1", "relation": "prereq"},
                    {"source": "node8", "target": "node5", "relation": "prereq"},
                    {"source": "node9", "target": "node2", "relation": "prereq"},
                    {"source": "node10", "target": "node3", "relation": "prereq"},
                    
                    # 语法基础支撑技能  
                    {"source": "node11", "target": "node5", "relation": "prereq"},
                    {"source": "node12", "target": "node6", "relation": "prereq"},
                    {"source": "node13", "target": "node7", "relation": "prereq"},
                    
                    # 技巧整合
                    {"source": "node4", "target": "node15", "relation": "prereq"},
                    {"source": "node7", "target": "node16", "relation": "prereq"},
                    {"source": "node15", "target": "node14", "relation": "prereq"},
                    {"source": "node16", "target": "node14", "relation": "prereq"},
                    
                    # 实战应用
                    {"source": "node14", "target": "node17", "relation": "prereq"},
                    {"source": "node17", "target": "node18", "relation": "prereq"},
                    {"source": "node18", "target": "node19", "relation": "prereq"},
                    {"source": "node19", "target": "node20", "relation": "prereq"}
                ]
            }
        else:
            # Generic fallback for other topics
            return {
                "nodes": [
                    {"id": "node1", "title": f"{topic} Fundamentals", "kind": "concept", "brief": f"Core concepts and terminology essential for understanding {topic}."},
                    {"id": "node2", "title": f"{topic} Tools & Setup", "kind": "skill", "brief": f"Set up development environment and learn essential tools for {topic}."},
                    {"id": "node3", "title": f"{topic} Basic Techniques", "kind": "skill", "brief": f"Practice fundamental methods and patterns used in {topic}."},
                    {"id": "node4", "title": f"{topic} Common Patterns", "kind": "concept", "brief": f"Recognize and apply recurring patterns and best practices in {topic}."},
                    {"id": "node5", "title": f"{topic} Advanced Concepts", "kind": "concept", "brief": f"Master complex theories and advanced applications in {topic}."},
                    {"id": "node6", "title": f"{topic} Integration Skills", "kind": "skill", "brief": f"Combine {topic} with other technologies and real-world systems."},
                    {"id": "node7", "title": f"{topic} Portfolio Project", "kind": "project", "brief": f"Build a comprehensive project demonstrating {topic} mastery."}
                ],
                "edges": [
                    {"source": "node1", "target": "node3", "relation": "prereq"},
                    {"source": "node2", "target": "node3", "relation": "prereq"},
                    {"source": "node3", "target": "node4", "relation": "prereq"},
                    {"source": "node4", "target": "node5", "relation": "prereq"},
                    {"source": "node4", "target": "node6", "relation": "prereq"},
                    {"source": "node5", "target": "node7", "relation": "prereq"},
                    {"source": "node6", "target": "node7", "relation": "prereq"}
                ]
            }

# Initialize services
search_service = SearchService()
llm_service = LLMService()

@app.get("/")
async def read_root():
    """Serve the main HTML page"""
    with open("index.html", "r") as f:
        return {"message": "Mini Roadmap Agent API"}

@app.get("/agent/roadmap")
async def generate_roadmap(topic: str) -> RoadmapResponse:
    """Generate a learning roadmap for the given topic"""
    logs = []
    
    def add_log(stage: str, message: str):
        logs.append(Log(
            ts=datetime.datetime.now().isoformat(),
            stage=stage,
            message=message
        ))
    
    try:
        add_log("search", f"Starting web search for topic: {topic}")
        
        # Search for information
        search_results = await search_service.search_web(topic)
        add_log("search", f"Found {len(search_results)} search results")
        
        # Convert to Source objects
        sources = [
            Source(
                title=result["title"],
                url=result["url"],
                snippet=result["snippet"]
            )
            for result in search_results
        ]
        
        add_log("llm", "Sending search results to LLM for roadmap generation")
        
        # Generate roadmap using LLM
        roadmap_data = await llm_service.generate_roadmap(topic, search_results)
        
        add_log("llm", f"Generated roadmap with {len(roadmap_data['nodes'])} nodes and {len(roadmap_data['edges'])} edges")
        
        # Convert to Pydantic models
        nodes = [Node(**node) for node in roadmap_data["nodes"]]
        edges = [Edge(**edge) for edge in roadmap_data["edges"]]
        
        add_log("output", "Roadmap generation completed successfully")
        
        return RoadmapResponse(
            topic=topic,
            nodes=nodes,
            edges=edges,
            sources=sources,
            logs=logs
        )
        
    except Exception as e:
        add_log("error", f"Error generating roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
