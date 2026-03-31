from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Portfolio API")

# Enable CORS for the frontend to fetch data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Portfolio API"}

@app.get("/api/stats")
def get_stats():
    # Dynamic stats that can be updated here or from a database
    return {
        "projects_built": "10+",
        "ai_models_used": "5+",
        "impact_driven": "Impact Focused"
    }

@app.get("/api/projects")
def get_projects():
    return [
        {
            "title": "Aura Med: Patient Health Hub",
            "role": "Lead Product Designer",
            "year": "2024",
            "impact": "15% increase in patient adherence"
        },
        {
            "title": "Aura Med: Practitioner Dashboard",
            "role": "Product Manager",
            "year": "2024",
            "impact": "30% reduction in admin overhead"
        }
    ]
