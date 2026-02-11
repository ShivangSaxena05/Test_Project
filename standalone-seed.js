// Standalone seed script - run with: node standalone-seed.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load environment variables
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!key) continue;
    const trimmedKey = key.trim();
    const value = rest.join("=").trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Define schemas inline
const languageSchema = new mongoose.Schema({
  language: { type: String, required: true, trim: true }
});

const candidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "candidate", required: true },
  isBlocked: { type: Boolean, default: false },
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
});

const qaSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "quality-assurance", required: true },
  isBlocked: { type: Boolean, default: false },
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }]
});

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin", required: true }
});

async function seed() {
  console.log("Connecting to MongoDB...");
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }

  // Create models
  const Language = mongoose.models.Language || mongoose.model("Language", languageSchema);
  const Candidate = mongoose.models.candidate || mongoose.model("Candidate", candidateSchema);
  const QA = mongoose.models.quality_assurance || mongoose.model("QA", qaSchema);
  const Admin = mongoose.models.admin || mongoose.model("Admin", adminSchema);

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await Candidate.deleteMany({});
    await QA.deleteMany({});
    await Admin.deleteMany({});
    await Language.deleteMany({});
    console.log("✅ Cleared existing data");

    // Insert languages
    console.log("Inserting languages...");
    const languages = await Language.insertMany([
      { _id: new mongoose.Types.ObjectId("6818c135515bec4eed672bf1"), language: "HINDI" },
      { _id: new mongoose.Types.ObjectId("6818c149515bec4eed672bf2"), language: "ENGLISH" },
      { _id: new mongoose.Types.ObjectId("6818c15b515bec4eed672bf3"), language: "MARATHI" },
      { _id: new mongoose.Types.ObjectId("6818c188515bec4eed672bf4"), language: "GUJRATI" },
    ]);
    console.log("✅ Inserted languages");

    // Insert QA user
    console.log("Inserting QA user...");
    await QA.create({
      fullName: "Aakash Tamboli",
      email: "aakashqa@teja.com",
      password: "12345678",
      role: "quality-assurance",
      isBlocked: false,
      languages: languages.map(l => l._id),
    });
    console.log("✅ Inserted QA user");

    // Insert Admin user
    console.log("Inserting Admin user...");
    await Admin.create({
      fullName: "Admin User",
      email: "admin@teja.com",
      password: "12345678",
      role: "admin",
    });
    console.log("✅ Inserted Admin user");

    // Insert Candidate user
    console.log("Inserting Candidate user...");
    await Candidate.create({
      fullName: "Aakash Tamboli",
      email: "aakash@teja.com",
      password: "12345678",
      role: "candidate",
      isBlocked: false,
      languages: languages.map(l => l._id),
    });
    console.log("✅ Inserted Candidate user");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nTest accounts created:");
    console.log("  - Admin: admin@teja.com / 12345678");
    console.log("  - QA: aakashqa@teja.com / 12345678");
    console.log("  - Candidate: aakash@teja.com / 12345678");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  }
}

seed();

