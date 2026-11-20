import type { Question } from "./game";
type Q = [string, string[], string];
const mk = (mobs: Q[], bosses: Q[]): Question[] => [
  ...mobs.map(([q, options, explain]) => ({ q, options, answer: 0, explain, kind: "mob" as const })),
  ...bosses.map(([q, options, explain]) => ({ q, options, answer: 0, explain, kind: "boss" as const })),
];
export interface Quest { id: string; title: string; icon: string; difficulty: "Easy" | "Medium" | "Hard"; blurb: string; bosses: string[]; questions: Question[]; }

export const QUESTS: Quest[] = [
  { id: "ds", title: "Data Science & Machine Learning", icon: "🧠", difficulty: "Hard", blurb: "Overfitting, forests, 3NF & metrics", bosses: ["The Grand Neural Overlord", "Gradient Hydra"], questions: mk([
    ["A model scores 99% on training data but 60% on test data. This is:", ["Overfitting", "Underfitting", "Regularization", "Data leakage"], "Overfitting = memorizing training noise, failing to generalize."],
    ["Random Forest reduces variance mainly by:", ["Averaging many decorrelated trees", "Using one very deep tree", "Gradient boosting residuals", "Removing all features"], "Bagging + random feature subsets → decorrelated trees whose average is stable."],
    ["A table is in 3NF when it is in 2NF and has no:", ["Transitive dependencies on the key", "Primary key", "Foreign keys", "Duplicate column names"], "3NF: non-key attributes depend only on the key, not on other non-key attributes."],
    ["Precision is defined as:", ["TP / (TP + FP)", "TP / (TP + FN)", "TN / (TN + FP)", "(TP + TN) / Total"], "Precision = of everything predicted positive, how many were actually positive."],
    ["Which technique standardizes features to mean 0, std 1?", ["Z-score scaling", "One-hot encoding", "Min-max to [0,10]", "Label encoding"], "Z-score: (x − μ) / σ."],
    ["K-Means is an example of:", ["Unsupervised clustering", "Supervised regression", "Reinforcement learning", "Dimensionality labeling"], "K-Means groups unlabeled data into k clusters."],
  ], [
    ["A cancer screening model must miss as few sick patients as possible, even if it raises false alarms. Which metric do you prioritize and why?", ["Recall — it minimizes false negatives", "Precision — it minimizes false positives", "Accuracy — it balances everything", "Specificity — it maximizes true negatives"], "Missing a sick patient (FN) is costliest, so maximize Recall = TP/(TP+FN)."],
    ["Your validation loss falls then rises while training loss keeps falling. Best combined fix?", ["Early stopping + regularization (L2/dropout)", "Train longer with higher learning rate", "Remove the validation set", "Add more layers and no dropout"], "Diverging val loss signals overfitting; stop early and regularize."],
  ]) },
  { id: "py", title: "Python & Algorithms", icon: "🐍", difficulty: "Medium", blurb: "Big-O, comprehensions, async/await", bosses: ["Arch-Demon of Legacy Code", "The Recursion Wyrm"], questions: mk([
    ["Time complexity of binary search on a sorted list:", ["O(log n)", "O(n)", "O(n log n)", "O(1)"], "Each step halves the search space → log₂ n steps."],
    ["`[x*2 for x in range(3)]` evaluates to:", ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "(0, 2, 4)"], "range(3) = 0,1,2 each doubled."],
    ["Which Python structure gives average O(1) membership lookup?", ["set", "list", "tuple", "str"], "Sets are hash tables → constant-time average lookup."],
    ["`await` can only be used directly inside:", ["An async def function", "Any lambda", "A class body", "A list comprehension at module level"], "await suspends a coroutine — it must live in async def."],
    ["What does `len({'a':1, 'b':2})` return?", ["2", "4", "1", "Error"], "len of a dict counts its keys."],
    ["A stack follows which order?", ["LIFO", "FIFO", "Random", "Sorted"], "Last In, First Out — like a pile of plates."],
  ], [
    ["You fetch 100 URLs: sequential takes 50s. Using `asyncio.gather` on async requests most likely gives:", ["~0.5–2s, since I/O waits overlap", "Still 50s, the GIL blocks it", "5000s due to overhead", "Exactly 25s, two cores"], "Async overlaps network I/O waits; the GIL doesn't block I/O-bound concurrency."],
    ["A nested loop over n items, inside which you do a binary search on a sorted list of n, has complexity:", ["O(n² log n)", "O(n log n)", "O(n²)", "O(log n)"], "n × n iterations × log n per search."],
  ]) },
  { id: "biz", title: "Business & FinTech Basics", icon: "💰", difficulty: "Easy", blurb: "ROI, OTIF, unit economics", bosses: ["Leviathan of Burn Rate", "The Ledger Lich"], questions: mk([
    ["ROI is calculated as:", ["(Gain − Cost) / Cost", "Cost / Gain", "Revenue − Expenses", "Profit × Cost"], "ROI measures return relative to what you invested."],
    ["OTIF in supply chains stands for:", ["On Time In Full", "Order Taken In Finance", "Output Total In Factory", "Open Trade International Fee"], "OTIF = delivered on schedule with the complete quantity."],
    ["CAC means:", ["Customer Acquisition Cost", "Cash And Credit", "Capital Asset Charge", "Customer Account Code"], "CAC = sales + marketing spend / new customers."],
    ["A 'neobank' is best described as:", ["A digital-only bank with no branches", "A central bank", "A crypto exchange only", "An insurance broker"], "Neobanks operate entirely online/app-based."],
    ["KYC in FinTech refers to:", ["Know Your Customer identity checks", "Keep Your Cash", "Key Yield Calculation", "Kiosk Your Card"], "KYC verifies customer identity to prevent fraud & money laundering."],
    ["Gross margin equals:", ["(Revenue − COGS) / Revenue", "Net profit / Assets", "Revenue / COGS", "COGS − Revenue"], "Share of revenue kept after direct costs."],
  ], [
    ["A startup has CAC of AED 400, monthly profit per customer of AED 50, and average lifetime of 6 months. Its unit economics are:", ["Unhealthy — LTV 300 < CAC 400", "Healthy — LTV 300 > CAC", "Healthy — LTV 2400", "Neutral — LTV equals CAC"], "LTV = 50 × 6 = 300; losing AED 100 per customer. Aim for LTV:CAC ≥ 3."],
    ["Invest AED 10,000, get back AED 13,000 after 1 year, while inflation is 5%. Approximate real ROI?", ["~25%", "30%", "35%", "5%"], "Nominal ROI 30% minus ~5% inflation ≈ 25% real return."],
  ]) },
  { id: "space", title: "Space & Astrophysics", icon: "🪐", difficulty: "Hard", blurb: "Event horizons, exoplanets, orbits", bosses: ["The Singularity Titan", "Nebula Behemoth"], questions: mk([
    ["The event horizon of a black hole is:", ["The boundary beyond which nothing, not even light, escapes", "Its glowing accretion disk", "The center singularity", "A wormhole entrance"], "Escape velocity at the event horizon equals light speed."],
    ["An exoplanet is a planet that:", ["Orbits a star other than the Sun", "Has no atmosphere", "Is larger than Jupiter", "Has left its orbit"], "Exo- = outside our solar system."],
    ["The transit method detects exoplanets by measuring:", ["Dips in a star's brightness", "Radio signals", "Planet's own light", "Changes in planet color"], "A planet crossing its star blocks a tiny fraction of light."],
    ["Kepler's 1st law says planetary orbits are:", ["Ellipses with the Sun at one focus", "Perfect circles", "Spirals", "Parabolas"], "Orbits are ellipses, the Sun sits at a focus."],
    ["A light-year measures:", ["Distance", "Time", "Brightness", "Speed"], "Distance light travels in one year ≈ 9.46 trillion km."],
    ["The closest star to Earth is:", ["The Sun", "Proxima Centauri", "Sirius", "Polaris"], "Trick! The Sun is a star — Proxima is the closest *other* star."],
  ], [
    ["A satellite moves to a higher circular orbit. What happens to its orbital speed and period?", ["Speed decreases, period increases", "Speed increases, period decreases", "Both increase", "Both stay the same"], "v = √(GM/r) falls with r; Kepler's 3rd law: T² ∝ r³ rises."],
    ["Why does time appear to slow for an object near a black hole, as seen by a distant observer?", ["Gravitational time dilation from strong spacetime curvature", "The object moves faster than light", "Light gets absorbed completely", "The object's clocks break"], "General relativity: deeper gravity wells run slower clocks."],
  ]) },
  { id: "logic", title: "General Logic & Brain Teasers", icon: "🧩", difficulty: "Easy", blurb: "Quick-thinking puzzles for everyone", bosses: ["The Riddle Sphinx", "Paradox Golem"], questions: mk([
    ["What comes next: 2, 4, 8, 16, …?", ["32", "24", "18", "20"], "Each term doubles."],
    ["If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are:", ["Lazzies", "Not Lazzies", "Sometimes Razzies", "Unknown"], "Transitive syllogism: A⊂B⊂C → A⊂C."],
    ["How many months have 28 days?", ["12", "1", "2", "6"], "Every month has at least 28 days!"],
    ["A rooster lays an egg on a roof. Which way does it roll?", ["Roosters don't lay eggs", "Left", "Right", "Straight down"], "Read the question carefully — roosters are male."],
    ["Which is heavier: 1 kg of feathers or 1 kg of steel?", ["Same weight", "Steel", "Feathers", "Depends on gravity"], "1 kg = 1 kg."],
    ["Mary's father has 5 daughters: Nana, Nene, Nini, Nono. The 5th is:", ["Mary", "Nunu", "Nina", "Unknown"], "It's Mary's father — she's the fifth."],
  ], [
    ["A bat and a ball cost AED 1.10 total. The bat costs AED 1.00 more than the ball. How much is the ball?", ["AED 0.05", "AED 0.10", "AED 0.01", "AED 0.15"], "Ball x, bat x+1 → 2x+1 = 1.10 → x = 0.05."],
    ["5 machines make 5 widgets in 5 minutes. How long do 100 machines take to make 100 widgets?", ["5 minutes", "100 minutes", "20 minutes", "1 minute"], "Each machine makes 1 widget per 5 minutes, regardless of count."],
  ]) },
  { id: "games", title: "Video Game Legends", icon: "🎮", difficulty: "Easy", blurb: "Mario, Minecraft, GTA & esports", bosses: ["The Final Boss.exe", "Lag Lord"], questions: mk([
    ["Which company created Super Mario?", ["Nintendo", "Sega", "Sony", "Atari"], "Mario debuted in Nintendo's Donkey Kong (1981)."],
    ["In Minecraft, which mob explodes when it gets close?", ["Creeper", "Enderman", "Zombie", "Skeleton"], "Creepers hiss, then explode — RIP your house."],
    ["GTA Vice City is inspired by which real city?", ["Miami", "Los Angeles", "New York", "Las Vegas"], "Vice City = 1980s Miami vibes."],
    ["What does 'GG' mean in gaming chat?", ["Good game", "Get going", "Great gold", "Game glitch"], "Said at the end of a match as good sportsmanship."],
    ["Which game features a battle bus dropping players on an island?", ["Fortnite", "Valorant", "FIFA", "Tetris"], "Fortnite's battle bus starts every Battle Royale."],
    ["Pac-Man eats dots while avoiding:", ["Ghosts", "Zombies", "Aliens", "Dragons"], "Blinky, Pinky, Inky and Clyde."],
  ], [
    ["In The Legend of Zelda series, what is the name of the usual playable hero?", ["Link", "Zelda", "Ganon", "Navi"], "Classic mix-up: Zelda is the princess, Link is the hero."],
    ["Tetris was originally created in which country?", ["Soviet Union (Russia)", "Japan", "USA", "Finland"], "Alexey Pajitnov made Tetris in Moscow in 1984."],
  ]) },
  { id: "movies", title: "Movies & Pop Culture", icon: "🎬", difficulty: "Easy", blurb: "Marvel, Pixar, memes & blockbusters", bosses: ["Spoiler Kraken", "The Sequel Titan"], questions: mk([
    ["Who is Iron Man's alter ego?", ["Tony Stark", "Steve Rogers", "Bruce Wayne", "Peter Parker"], "Tony Stark: genius, billionaire, playboy, philanthropist."],
    ["Which Pixar film features a rat who loves cooking?", ["Ratatouille", "Up", "Cars", "Coco"], "Remy the rat chefs it up in Paris."],
    ["In Harry Potter, what house is Harry sorted into?", ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"], "He asked the Sorting Hat 'not Slytherin'."],
    ["'May the Force be with you' comes from:", ["Star Wars", "Star Trek", "Dune", "Avatar"], "A Star Wars classic line."],
    ["What colour pill does Neo take in The Matrix?", ["Red", "Blue", "Green", "Yellow"], "Red pill = see the truth."],
    ["Which movie features the song 'Let It Go'?", ["Frozen", "Moana", "Tangled", "Encanto"], "Elsa's anthem from Frozen (2013)."],
  ], [
    ["What is the highest-grossing film of all time (not adjusting for inflation)?", ["Avatar (2009)", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"], "Avatar reclaimed #1 after its 2021 re-release (~$2.9B)."],
    ["In Inception, what object does Cobb use to check if he's dreaming?", ["A spinning top", "A coin", "A chess piece", "A watch"], "His totem: if it keeps spinning, he's in a dream."],
  ]) },
  { id: "football", title: "Football & Sports Mania", icon: "⚽", difficulty: "Medium", blurb: "World Cup, legends, F1 & Olympics", bosses: ["The VAR Overlord", "Offside Golem"], questions: mk([
    ["How many players does a football team have on the pitch?", ["11", "10", "9", "12"], "10 outfield players + 1 goalkeeper."],
    ["Which country won the 2022 FIFA World Cup?", ["Argentina", "France", "Brazil", "Croatia"], "Argentina beat France on penalties in Qatar."],
    ["How many rings are on the Olympic flag?", ["5", "4", "6", "7"], "Five rings for five inhabited continents."],
    ["In basketball, a shot from beyond the arc is worth:", ["3 points", "2 points", "4 points", "1 point"], "The three-pointer."],
    ["Which F1 circuit is in Abu Dhabi?", ["Yas Marina", "Silverstone", "Monza", "Suzuka"], "Yas Marina hosts the season finale."],
    ["A 'hat-trick' in football means:", ["3 goals by one player", "3 red cards", "3 own goals", "3 wins in a row"], "One player, three goals, one match."],
  ], [
    ["Which player has won the most Ballon d'Or awards (as of 2024)?", ["Lionel Messi", "Cristiano Ronaldo", "Michel Platini", "Johan Cruyff"], "Messi has 8 Ballon d'Ors."],
    ["Usain Bolt's 100m world record time is:", ["9.58 seconds", "9.69 seconds", "9.81 seconds", "10.01 seconds"], "Set in Berlin, 2009."],
  ]) },
  { id: "food", title: "Food & World Cuisine", icon: "🍕", difficulty: "Easy", blurb: "Dishes, spices & food science", bosses: ["The Spice Hydra", "Burnt Toast Behemoth"], questions: mk([
    ["Sushi originated in which country?", ["Japan", "China", "Korea", "Thailand"], "Modern sushi comes from Japan."],
    ["What is the main ingredient in guacamole?", ["Avocado", "Peas", "Cucumber", "Spinach"], "Mashed avocado + lime + salt."],
    ["Which spice gives biryani its golden colour?", ["Saffron", "Cinnamon", "Pepper", "Cloves"], "Saffron (or turmeric) tints the rice."],
    ["Machboos is a traditional dish from:", ["The Gulf (UAE, Kuwait, Bahrain)", "Mexico", "Italy", "Korea"], "Spiced rice with meat — a Gulf classic."],
    ["Pizza Margherita's colours represent which flag?", ["Italy", "France", "Mexico", "Ireland"], "Tomato, mozzarella, basil = red, white, green."],
    ["Which nut is used to make marzipan?", ["Almond", "Peanut", "Cashew", "Walnut"], "Almond paste + sugar."],
  ], [
    ["What chemical reaction browns a steak and toast?", ["Maillard reaction", "Oxidation", "Fermentation", "Hydrolysis"], "Amino acids + sugars + heat = flavourful browning."],
    ["Capsaicin, which makes chillies hot, is measured on which scale?", ["Scoville scale", "Richter scale", "pH scale", "Kelvin scale"], "Scoville Heat Units — Carolina Reaper ~2M SHU."],
  ]) },
  { id: "music", title: "Music & Synthwave Hits", icon: "🎧", difficulty: "Medium", blurb: "Artists, instruments & music theory", bosses: ["The Bass Drop Dragon", "Autotune Archon"], questions: mk([
    ["How many keys does a standard piano have?", ["88", "76", "61", "100"], "52 white + 36 black."],
    ["Which band sang 'Bohemian Rhapsody'?", ["Queen", "The Beatles", "ABBA", "Coldplay"], "Freddie Mercury & Queen, 1975."],
    ["BPM in music stands for:", ["Beats per minute", "Bass per measure", "Beat pitch mode", "Bars per music"], "It's the tempo."],
    ["Which instrument has 6 strings in its standard form?", ["Guitar", "Violin", "Cello", "Harp"], "Standard guitar tuning: E A D G B E."],
    ["Who is known as the 'King of Pop'?", ["Michael Jackson", "Elvis Presley", "Prince", "Justin Bieber"], "Michael Jackson — Thriller is the best-selling album ever."],
    ["Synthwave music is mostly inspired by which decade?", ["1980s", "1950s", "1970s", "2000s"], "Neon, synths, VHS — pure '80s."],
  ], [
    ["How many semitones are in an octave?", ["12", "8", "7", "10"], "C to C covers 12 half steps."],
    ["A major chord is built from the root plus which intervals?", ["Major 3rd + perfect 5th", "Minor 3rd + perfect 5th", "Perfect 4th + octave", "Major 2nd + minor 6th"], "e.g. C major = C, E, G."],
  ]) },
];
