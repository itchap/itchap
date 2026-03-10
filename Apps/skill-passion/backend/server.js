require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// --- SCHEMAS ---
const skillSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true }, 
  name: { type: String, required: true },
  category: { type: String, default: 'Custom' }, // NEW: Category tracking
  x: { type: Number, default: 0 }, 
  y: { type: Number, default: 0 },
  status: { type: String, default: 'unplotted' }
});
const Skill = mongoose.model('Skill', skillSchema);

const masterSkillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, default: 'Custom' } // NEW: Category tracking
});
const MasterSkill = mongoose.model('MasterSkill', masterSkillSchema);


// --- AUTO-SEEDER FOR MASTER SKILLS (CATEGORIZED) ---
const MASTER_SKILLS_LIST = [
  // Cat1: PreSales
  { name: "pocs", category: "PreSales" }, { name: "competitor diffs", category: "PreSales" }, { name: "tco analysis", category: "PreSales" }, { name: "business cases", category: "PreSales" }, { name: "bv messaging", category: "PreSales" }, { name: "optimise t-2-market", category: "PreSales" }, { name: "enable competitive adv", category: "PreSales" }, { name: "ops cost reduction", category: "PreSales" }, { name: "bus. risk reduction", category: "PreSales" }, { name: "demos", category: "PreSales" }, { name: "demo scripting", category: "PreSales" }, { name: "tfws", category: "PreSales" }, { name: "pre-onboarding", category: "PreSales" }, { name: "webinars", category: "PreSales" }, { name: "skill badges", category: "PreSales" }, { name: "multi-wl management", category: "PreSales" }, { name: "proactive risk assess", category: "PreSales" }, { name: "publish whitepapers", category: "PreSales" }, { name: "continuous learning", category: "PreSales" }, { name: "certifications", category: "PreSales" },
  
  // Cat2: Database
  { name: "db admin", category: "Database" }, { name: "data models", category: "Database" }, { name: "access patterns", category: "Database" }, { name: "schema designs", category: "Database" }, { name: "index strategies", category: "Database" }, { name: "sizing", category: "Database" }, { name: "analytics", category: "Database" }, { name: "bi tools", category: "Database" }, { name: "stream processing", category: "Database" }, { name: "batch processing", category: "Database" }, { name: "sql", category: "Database" }, { name: "ops manager", category: "Database" }, { name: "dml auditing", category: "Database" }, { name: "global writes", category: "Database" }, { name: "sharding", category: "Database" }, { name: "changestreams", category: "Database" }, { name: "wiredtiger", category: "Database" }, { name: "concurrency", category: "Database" }, { name: "cap theorem", category: "Database" }, { name: "acid transactions", category: "Database" },
  
  // Cat3: Architecture
  { name: "cross-region", category: "Architecture" }, { name: "cross-cloud", category: "Architecture" }, { name: "arch patterns", category: "Architecture" }, { name: "ref arch creation", category: "Architecture" }, { name: "multi-tenant", category: "Architecture" }, { name: "kafka", category: "Architecture" }, { name: "monolith", category: "Architecture" }, { name: "microservices", category: "Architecture" }, { name: "api-first design", category: "Architecture" }, { name: "event driven", category: "Architecture" }, { name: "domain driven", category: "Architecture" }, { name: "data mesh", category: "Architecture" }, { name: "data product", category: "Architecture" }, { name: "mach", category: "Architecture" }, { name: "odl", category: "Architecture" }, { name: "data lake", category: "Architecture" }, { name: "data warehouse", category: "Architecture" }, { name: "zero trust arch", category: "Architecture" }, { name: "graphql", category: "Architecture" }, { name: "data platform", category: "Architecture" },
  
  // Cat4: IT
  { name: "data privacy", category: "IT" }, { name: "data residency", category: "IT" }, { name: "aws services", category: "IT" }, { name: "gcp services", category: "IT" }, { name: "azure services", category: "IT" }, { name: "sysadmin", category: "IT" }, { name: "dba", category: "IT" }, { name: "devops", category: "IT" }, { name: "monitoring", category: "IT" }, { name: "backup/restore", category: "IT" }, { name: "cybersec", category: "IT" }, { name: "data security", category: "IT" }, { name: "hashicorp vault", category: "IT" }, { name: "kubernetes", category: "IT" }, { name: "terraform", category: "IT" }, { name: "cli", category: "IT" }, { name: "admin apis", category: "IT" }, { name: "sso/oauth", category: "IT" }, { name: "networking", category: "IT" }, { name: "storage", category: "IT" },
  
  // Cat5: Development
  { name: "aggregations", category: "Development" }, { name: "design reviews", category: "Development" }, { name: "sequence diagrams", category: "Development" }, { name: "app mod", category: "Development" }, { name: "programming", category: "Development" }, { name: "rdb migrations", category: "Development" }, { name: "timeseries", category: "Development" }, { name: "spark", category: "Development" }, { name: "etl", category: "Development" }, { name: "troubleshooting", category: "Development" }, { name: "perf tuning", category: "Development" }, { name: "text search", category: "Development" }, { name: "vector search", category: "Development" }, { name: "hybrid search", category: "Development" }, { name: "rag", category: "Development" }, { name: "ai/ml", category: "Development" }, { name: "genai app dev", category: "Development" }, { name: "agentic systems", category: "Development" }, { name: "api integrations", category: "Development" }, { name: "agile dev", category: "Development" },
  
  // Cat6: Sales
  { name: "sales process", category: "Sales" }, { name: "cxo engagement", category: "Sales" }, { name: "acc planning", category: "Sales" }, { name: "account povs", category: "Sales" }, { name: "ddp pitching", category: "Sales" }, { name: "discovery", category: "Sales" }, { name: "proof points", category: "Sales" }, { name: "trap setting", category: "Sales" }, { name: "medppic", category: "Sales" }, { name: "cotm", category: "Sales" }, { name: "value framework", category: "Sales" }, { name: "value drivers", category: "Sales" }, { name: "value pyramid", category: "Sales" }, { name: "sourcing new wls", category: "Sales" }, { name: "opp qualifing", category: "Sales" }, { name: "deal strategy", category: "Sales" }, { name: "persona awareness", category: "Sales" }, { name: "navigate org politics", category: "Sales" }, { name: "nbm prep", category: "Sales" }, { name: "3 whys", category: "Sales" },
  
  // Cat7: SoftSkills
  { name: "credibility", category: "SoftSkills" }, { name: "reliability", category: "SoftSkills" }, { name: "rapport building", category: "SoftSkills" }, { name: "customer orientation", category: "SoftSkills" }, { name: "ae collab", category: "SoftSkills" }, { name: "sales leader align", category: "SoftSkills" }, { name: "building slides", category: "SoftSkills" }, { name: "presenting slides", category: "SoftSkills" }, { name: "objection handling", category: "SoftSkills" }, { name: "storytelling", category: "SoftSkills" }, { name: "sa mentoring", category: "SoftSkills" }, { name: "tech champ building", category: "SoftSkills" }, { name: "conf speaking", category: "SoftSkills" }, { name: "product feedback", category: "SoftSkills" }, { name: "challenging customers", category: "SoftSkills" }, { name: "cross-func partnering", category: "SoftSkills" }, { name: "verbal communication", category: "SoftSkills" }, { name: "written communication", category: "SoftSkills" }, { name: "meeting execution", category: "SoftSkills" }, { name: "zoom presence", category: "SoftSkills" }
];

async function seedMasterSkills() {
  try {
    const validNames = MASTER_SKILLS_LIST.map(s => s.name.toLowerCase());
    
    // Clean up any old skills from the DB that are no longer in your strict master list
    await MasterSkill.deleteMany({ name: { $nin: validNames } });

    for (let s of MASTER_SKILLS_LIST) {
      await MasterSkill.updateOne(
        { name: s.name.toLowerCase() },
        { $set: { name: s.name.toLowerCase(), category: s.category } },
        { upsert: true }
      );
    }
    console.log("Master skills list synced perfectly!");
  } catch (err) { 
    console.error("Failed to seed master skills:", err); 
  }
}

// --- API ENDPOINTS ---

app.post('/api/skills/init', async (req, res) => {
  try {
    const sessionId = new mongoose.Types.ObjectId().toString();
    const masterSkills = await MasterSkill.find();
    if (masterSkills.length > 0) {
      const sessionSkills = masterSkills.map(ms => ({
        sessionId, name: ms.name, category: ms.category, x: 0, y: 0, status: 'unplotted'
      }));
      const newlyCreated = await Skill.insertMany(sessionSkills);
      res.json({ sessionId, skills: newlyCreated });
    } else { res.json({ sessionId, skills: [] }); }
  } catch (error) { res.status(500).json({ error: 'Failed to init session' }); }
});

app.get('/api/skills/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    let skills = await Skill.find({ sessionId });
    if (skills.length === 0) return res.status(404).json({ error: 'Session not found' });

    const masterSkills = await MasterSkill.find();
    const existingSkillNames = skills.map(s => s.name.toLowerCase());
    const missingMasterSkills = masterSkills.filter(ms => !existingSkillNames.includes(ms.name.toLowerCase()));
    
    if (missingMasterSkills.length > 0) {
      const newSessionSkills = missingMasterSkills.map(ms => ({
        sessionId, name: ms.name, category: ms.category, x: 0, y: 0, status: 'unplotted'
      }));
      const inserted = await Skill.insertMany(newSessionSkills);
      skills = [...skills, ...inserted]; 
    }
    res.json({ sessionId, skills });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch session' }); }
});

app.post('/api/skills/reset/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await Skill.deleteMany({ sessionId }); 
    const masterSkills = await MasterSkill.find();
    if (masterSkills.length > 0) {
      const sessionSkills = masterSkills.map(ms => ({
        sessionId, name: ms.name, category: ms.category, x: 0, y: 0, status: 'unplotted'
      }));
      const newlyCreated = await Skill.insertMany(sessionSkills);
      res.json({ sessionId, skills: newlyCreated });
    } else { res.json({ sessionId, skills: [] }); }
  } catch (error) { res.status(500).json({ error: 'Failed to reset session' }); }
});

app.post('/api/skills', async (req, res) => {
  let { name, sessionId, category } = req.body;
  name = name.toLowerCase();
  
  // Custom user skills default to the 'Custom' category
  const newSkill = new Skill({ sessionId, name, category: category || 'Custom', status: 'unplotted', x: 0, y: 0 }); 
  await newSkill.save();
  res.json(newSkill);
});

app.put('/api/skills/:id', async (req, res) => {
  const { x, y, status } = req.body;
  const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, { x, y, status }, { returnDocument: 'after' });
  res.json(updatedSkill);
});

app.delete('/api/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill removed' });
  } catch (error) { res.status(500).json({ error: 'Failed to delete' }); }
});

// AI Route
app.post('/api/skills/analyze', async (req, res) => {
  try {
    const { skills } = req.body;
    const plottedSkills = skills.filter(s => s.status === 'plotted');
    if (plottedSkills.length === 0) return res.status(400).json({ error: "Please plot some skills first!" });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = `You are an expert career coach for MongoDB Solutions Architects (SAs). Your client mapped their skills on a Skill/Passion Matrix.\n\nQuadrants:\n1. Top-Right (High Skill, High Passion): Zone of Genius.\n2. Top-Left (Low Skill, High Passion): Growth Areas.\n3. Bottom-Right (High Skill, Low Passion): Burnout Risk.\n4. Bottom-Left (Low Skill, Low Passion): Delegate/Drop.\n\nData (Coordinates map from -385 to +385):\n`;
    plottedSkills.forEach(s => {
      let quad = "";
      if(s.x >= 0 && s.y >= 0) quad = "Top-Right";
      if(s.x < 0 && s.y >= 0) quad = "Top-Left";
      if(s.x >= 0 && s.y < 0) quad = "Bottom-Right";
      if(s.x < 0 && s.y < 0) quad = "Bottom-Left";
      prompt += `- Task: "${s.name}" | Quadrant: ${quad} (x: ${Math.round(s.x)}, y: ${Math.round(s.y)})\n`;
    });
    prompt += `\nProvide a specific 3-paragraph analysis. 1. Summarize alignment. 2. Give 1 focus recommendation (Top-Left). 3. Give 1 energy-protection recommendation (Bottom-Half).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ analysis: response.text() });
  } catch (error) { res.status(500).json({ error: 'Failed to generate analysis' }); }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedMasterSkills(); 
});