# ⚔️ NoteQuest: Syllabus Monster Slayer

> **Built during the KHDA x Lovable Higher Education Hackathon — Dubai Future Week 2026**

**NoteQuest** is an interactive, synthwave-styled educational RPG that transforms dry lecture notes and study guides into a fast-paced monster-slaying battle arena. Designed to make exam revision genuinely engaging, players can upload their own `.pdf`, `.docx`, or `.txt` study files—or jump straight into built-in academic quests—to defeat waves of syllabus monsters and complex Bosses.

---

## ✨ Key Features

- **📄 Client-Side Study Note Parser (`PDF`, `DOCX`, `TXT`):**
  - Extracts text directly in the browser using `pdfjs-dist` and `mammoth` with zero external API dependencies or server latency.
  - Dynamically analyzes key concepts, definitions, and technical terms to generate randomized Multiple Choice Question (MCQ) waves.
- **🎮 5 Built-In Academic Quests (Instant Play):**
  - Pre-loaded with handcrafted university-level question decks including **Data Science & Machine Learning**, **Python & Algorithms**, **Business & FinTech**, **Space & Astrophysics**, and **General Logic**.
- **👾 Mob Waves & Multi-Stage Boss Battles:**
  - Standard concepts spawn animated **Mob Monsters** (e.g., *Syntax Goblin*, *Overfitting Ogre*).
  - Complex, multi-concept analytical questions trigger dramatic **Boss Waves** (e.g., *The Grand Neural Overlord*, *Arch-Demon of Legacy Code*) with multi-segment health bars and dynamic arena shifts (*Vice Beach*, *Crimson Storm*, *Neon Downtown*).
- **🛡️ Real-Time Projectile Combat & Shield Mechanics:**
  - Correct answers trigger projectile attacks, critical damage numbers, screen shake, and combo streak multipliers (`x1`, `x2`, `x3`) that recharge energy shields.
  - Wrong answers or timer expirations trigger monster counter-attacks that shatter player shields.
- **🎨 Hero Avatar Customizer:**
  - Personalize your character class (*Neon Knight*, *Cyber Scholar*, *AI Mage*, *Robo-Ranger*), outfit colors, and weapon aura before entering the arena.
- **🏆 GTA-Inspired End Screens & Real-Player Leaderboard:**
  - Features dramatic **"MISSION PASSED! +RESPECT"** and **"WASTED"** end screens, post-game missed-question review logs, synthesized Web Audio API arcade sound effects, and a `localStorage` leaderboard.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling & UI:** Tailwind CSS, Lucide Icons, Custom CSS Keyframe Animations
- **Document Parsing:** `pdfjs-dist` (PDF extraction), `mammoth` (Word `.docx` extraction)
- **Audio Engine:** Native Web Audio API (procedural retro-arcade sound synthesis)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/NoteQuest-Syllabus-Monster-Slayer.git
   cd NoteQuest-Syllabus-Monster-Slayer
