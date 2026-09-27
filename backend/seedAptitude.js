const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const AptitudeQuestion = require("./models/AptitudeQuestion");

const questions = [
  // =========================================================================
  // EASY LEVEL (20 QUESTIONS)
  // =========================================================================
  // Quantitative (7)
  {
    question: "If a shirt costs $40 after a 20% discount, what was its original price?",
    options: ["$45", "$48", "$50", "$60"],
    correctAnswer: "$50",
    difficulty: "easy",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "What is the average of 12, 18, 24, 30, and 36?",
    options: ["22", "24", "26", "28"],
    correctAnswer: "24",
    difficulty: "easy",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "If 5 workers can build a wall in 12 days, how many days will 6 workers take at the same pace?",
    options: ["8 days", "10 days", "11 days", "14 days"],
    correctAnswer: "10 days",
    difficulty: "easy",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "A train travels 180 km in 3 hours. What is its speed in meters per second?",
    options: ["15 m/s", "16.67 m/s", "20 m/s", "25 m/s"],
    correctAnswer: "16.67 m/s",
    difficulty: "easy",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "The ratio of boys to girls in a class of 45 students is 3:2. How many girls are there in the class?",
    options: ["15", "18", "21", "27"],
    correctAnswer: "18",
    difficulty: "easy",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "Find the simple interest on $2,000 for 3 years at an annual interest rate of 5%.",
    options: ["$250", "$300", "$320", "$350"],
    correctAnswer: "$300",
    difficulty: "easy",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "What is 15% of 240?",
    options: ["32", "34", "36", "38"],
    correctAnswer: "36",
    difficulty: "easy",
    category: "quantitative",
    marks: 3,
  },

  // Logical (7)
  {
    question: "Find the next number in the sequence: 3, 6, 12, 24, ?",
    options: ["36", "42", "48", "54"],
    correctAnswer: "48",
    difficulty: "easy",
    category: "logical",
    marks: 3,
  },
  {
    question: "In a certain code, if CAT is represented as 3120, how is DOG represented?",
    options: ["4157", "4147", "3157", "4158"],
    correctAnswer: "4157",
    difficulty: "easy",
    category: "logical",
    marks: 3,
  },
  {
    question: "Pointing to a photograph, a man says, 'She is the daughter of my mother\\'s only son.' How is the woman related to the man?",
    options: ["Sister", "Daughter", "Niece", "Mother"],
    correctAnswer: "Daughter",
    difficulty: "easy",
    category: "logical",
    marks: 3,
  },
  {
    question: "Which of the following items does NOT belong with the others?",
    options: ["Apple", "Banana", "Carrot", "Mango"],
    correctAnswer: "Carrot",
    difficulty: "easy",
    category: "logical",
    marks: 3,
  },
  {
    question: "If South-East becomes North, and North-East becomes West, what will West become?",
    options: ["South-East", "North-East", "South-West", "North-West"],
    correctAnswer: "South-East",
    difficulty: "easy",
    category: "logical",
    marks: 3,
  },
  {
    question: "Find the missing letter in the alphabetical series: B, D, G, K, ?",
    options: ["N", "O", "P", "Q"],
    correctAnswer: "P",
    difficulty: "easy",
    category: "logical",
    marks: 3,
  },
  {
    question: "In a row of 30 students, Rahul is 12th from the left. What is his position from the right end?",
    options: ["18th", "19th", "20th", "21st"],
    correctAnswer: "19th",
    difficulty: "easy",
    category: "logical",
    marks: 3,
  },

  // Verbal (6)
  {
    question: "Choose the word that is most nearly a SYNONYM for 'CANDID':",
    options: ["Secretive", "Frank", "Deceptive", "Timid"],
    correctAnswer: "Frank",
    difficulty: "easy",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Choose the word that is the ANTONYM of 'ARROGANT':",
    options: ["Proud", "Humble", "Boastful", "Stubborn"],
    correctAnswer: "Humble",
    difficulty: "easy",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Select the correct preposition: 'She has been residing in Seattle _____ 2018.'",
    options: ["for", "since", "from", "by"],
    correctAnswer: "since",
    difficulty: "easy",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Identify the one-word substitution for: 'A person who knows everything.'",
    options: ["Omnipresent", "Omnipotent", "Omniscient", "Polyglot"],
    correctAnswer: "Omniscient",
    difficulty: "easy",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Choose the correctly spelled word:",
    options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"],
    correctAnswer: "Accommodate",
    difficulty: "easy",
    category: "verbal",
    marks: 3,
  },
  {
    question: "What is the meaning of the idiom: 'A blessing in disguise'?",
    options: [
      "A tragedy that keeps getting worse",
      "An apparent misfortune that yields unexpected good results",
      "A secret gift from a friend",
      "A costume worn at a gathering"
    ],
    correctAnswer: "An apparent misfortune that yields unexpected good results",
    difficulty: "easy",
    category: "verbal",
    marks: 3,
  },

  // =========================================================================
  // MEDIUM LEVEL (20 QUESTIONS)
  // =========================================================================
  // Quantitative (7)
  {
    question: "A principal sum of $5,000 amounts to $5,832 in 2 years at annual compound interest. Find the annual interest rate.",
    options: ["6%", "7%", "8%", "9%"],
    correctAnswer: "8%",
    difficulty: "medium",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "Pipe A can fill a tank in 6 hours, while Pipe B empties it in 8 hours. If both operate simultaneously, in how many hours will the tank fill?",
    options: ["18 hours", "20 hours", "24 hours", "28 hours"],
    correctAnswer: "24 hours",
    difficulty: "medium",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "A boat covers 24 km upstream in 6 hours and 36 km downstream in 4 hours. What is the speed of the water current?",
    options: ["2 km/h", "2.5 km/h", "3 km/h", "3.5 km/h"],
    correctAnswer: "2.5 km/h",
    difficulty: "medium",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "In how many distinct ways can the letters of the word 'LEADER' be arranged?",
    options: ["120", "360", "720", "1440"],
    correctAnswer: "360",
    difficulty: "medium",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "A box contains 4 red, 5 blue, and 6 green marbles. If two are drawn at random without replacement, what is the probability that both are red?",
    options: ["2/35", "4/35", "1/15", "2/15"],
    correctAnswer: "2/35",
    difficulty: "medium",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "In what ratio must a merchant mix coffee powder at $60/kg with coffee powder at $75/kg to produce a mixture worth $65/kg?",
    options: ["1:2", "2:1", "3:2", "2:3"],
    correctAnswer: "2:1",
    difficulty: "medium",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "A vendor sells a gadget at a 15% profit. Had it been sold for $24 more, the profit would have been 20%. Find the cost price of the gadget.",
    options: ["$420", "$450", "$480", "$500"],
    correctAnswer: "$480",
    difficulty: "medium",
    category: "quantitative",
    marks: 3,
  },

  // Logical (7)
  {
    question: "Statements: Some pens are books. All books are papers. Conclusion I: Some pens are papers. Conclusion II: All books are pens.",
    options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
    correctAnswer: "Only I follows",
    difficulty: "medium",
    category: "logical",
    marks: 3,
  },
  {
    question: "Six friends (P, Q, R, S, T, U) sit around a circular table facing center. P is opposite S. Q is immediately to the right of P. R is between S and Q. Who sits opposite Q?",
    options: ["R", "T", "U", "Cannot be determined"],
    correctAnswer: "Cannot be determined",
    difficulty: "medium",
    category: "logical",
    marks: 3,
  },
  {
    question: "What is the angle formed between the hour hand and the minute hand of a clock at 3:30?",
    options: ["70 degrees", "75 degrees", "80 degrees", "85 degrees"],
    correctAnswer: "75 degrees",
    difficulty: "medium",
    category: "logical",
    marks: 3,
  },
  {
    question: "If today is Monday, what day of the week will it be after exactly 61 days?",
    options: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
    correctAnswer: "Saturday",
    difficulty: "medium",
    category: "logical",
    marks: 3,
  },
  {
    question: "Statement: 'The public transit authority increased bus fares by 20%.' Assumption I: Ridership will plummet. Assumption II: The agency requires additional funds to cover escalating operating costs.",
    options: ["Only I is implicit", "Only II is implicit", "Either I or II is implicit", "Neither is implicit"],
    correctAnswer: "Only II is implicit",
    difficulty: "medium",
    category: "logical",
    marks: 3,
  },
  {
    question: "In a cryptographic code: '786' = 'study very hard', '958' = 'hard work pays', '645' = 'study and work'. Which digit represents 'very'?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "7",
    difficulty: "medium",
    category: "logical",
    marks: 3,
  },
  {
    question: "Five students A, B, C, D, and E took an aptitude test. A scored higher than B but lower than C. D scored higher than E but lower than B. Who secured the lowest score?",
    options: ["A", "B", "D", "E"],
    correctAnswer: "E",
    difficulty: "medium",
    category: "logical",
    marks: 3,
  },

  // Verbal (6)
  {
    question: "Spot the error: 'Neither of the two candidates (A) / are eligible (B) / for the executive fellowship (C) / No error (D)'",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B",
    difficulty: "medium",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Select the word that is the most accurate ANTONYM of 'PRAGMATIC':",
    options: ["Realistic", "Idealistic", "Efficient", "Practical"],
    correctAnswer: "Idealistic",
    difficulty: "medium",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Reorganize the parts into a coherent sentence: P: resulted in / Q: climate change / R: widespread droughts / S: has unseasonal",
    options: ["Q-S-P-R", "R-P-Q-S", "Q-S-R-P", "P-R-S-Q"],
    correctAnswer: "Q-S-P-R",
    difficulty: "medium",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Select the word to complete the sentence: 'The committee was unanimous in its vote, _____ the chairman expressed reservations.'",
    options: ["therefore", "although", "despite", "consequently"],
    correctAnswer: "although",
    difficulty: "medium",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Identify the analogy pair that matches 'LIGHT : BLIND'::",
    options: ["Sound : Deaf", "Voice : Mute", "Tongue : Taste", "Color : Vision"],
    correctAnswer: "Sound : Deaf",
    difficulty: "medium",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Select the most appropriate SYNONYM for 'EPHEMERAL':",
    options: ["Eternal", "Transient", "Puzzling", "Gigantic"],
    correctAnswer: "Transient",
    difficulty: "medium",
    category: "verbal",
    marks: 3,
  },

  // =========================================================================
  // HARD LEVEL (20 QUESTIONS)
  // =========================================================================
  // Quantitative (7)
  {
    question: "Two athletes run simultaneously from the same point on a 600m circular track in opposite directions at 4 m/s and 6 m/s. After how many seconds will they meet for the 3rd time?",
    options: ["120 s", "150 s", "180 s", "200 s"],
    correctAnswer: "180 s",
    difficulty: "hard",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "A container holds 80 liters of pure milk. 8 liters are extracted and replaced with water. This process is repeated 2 more times (total 3 cycles). How much pure milk remains?",
    options: ["58.32 liters", "56.40 liters", "60.00 liters", "52.48 liters"],
    correctAnswer: "58.32 liters",
    difficulty: "hard",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "A and B can complete a project together in 12 days, B and C in 15 days, and C and A in 20 days. In how many days can A complete the project working alone?",
    options: ["24 days", "30 days", "36 days", "40 days"],
    correctAnswer: "30 days",
    difficulty: "hard",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "If alpha and beta are the roots of the quadratic equation x^2 - 7x + 12 = 0, find the numerical value of (alpha^3 + beta^3).",
    options: ["91", "125", "133", "147"],
    correctAnswer: "91",
    difficulty: "hard",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "Four boys and four girls are to be seated around a circular conference table such that no two boys sit adjacent to each other. How many distinct seating arrangements exist?",
    options: ["144", "288", "576", "720"],
    correctAnswer: "144",
    difficulty: "hard",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "Three standard fair dice are rolled at the same time. What is the exact probability of obtaining a total sum of 15?",
    options: ["5/108", "7/108", "5/216", "7/216"],
    correctAnswer: "5/108",
    difficulty: "hard",
    category: "quantitative",
    marks: 3,
  },
  {
    question: "A high-speed train passes a roadside signal pole in 9 seconds and crosses a 260m long bridge platform in 22 seconds. What is the speed of the train in km/h?",
    options: ["60 km/h", "72 km/h", "80 km/h", "90 km/h"],
    correctAnswer: "72 km/h",
    difficulty: "hard",
    category: "quantitative",
    marks: 3,
  },

  // Logical (7)
  {
    question: "In a 7-person linear row (A to G facing North), D is third to the left of G. Exactly two people sit between G and B. A sits to the immediate left of C. If B is at the extreme right end, who sits at the extreme left end?",
    options: ["D", "E", "F", "A"],
    correctAnswer: "D",
    difficulty: "hard",
    category: "logical",
    marks: 3,
  },
  {
    question: "Statements: All philosophers are thinkers. No thinker is rash. Some mathematicians are philosophers. Conclusions: I. Some mathematicians are thinkers. II. No philosopher is rash. III. Some mathematicians are rash.",
    options: ["Only I and II follow", "Only II and III follow", "Only I and III follow", "All follow"],
    correctAnswer: "Only I and II follow",
    difficulty: "hard",
    category: "logical",
    marks: 3,
  },
  {
    question: "Input line: '42 yellow 15 apple 78 grape 33 zebra'. The rearrangement machine sorts numbers in ascending order and words in reverse alphabetical order alternately. How many total steps are needed to reach the final sorted sequence?",
    options: ["4", "5", "6", "7"],
    correctAnswer: "5",
    difficulty: "hard",
    category: "logical",
    marks: 3,
  },
  {
    question: "A large wooden cube painted blue on all exterior faces is cut into 125 small identical cubes. How many of the resulting small cubes have exactly two painted faces?",
    options: ["24", "36", "48", "60"],
    correctAnswer: "36",
    difficulty: "hard",
    category: "logical",
    marks: 3,
  },
  {
    question: "Point A is 10m North of Point B. Point C is 15m East of Point B. Point D is 20m South of Point C. What is the shortest displacement between Point A and Point D?",
    options: ["25m", "30m", "33.5m", "35m"],
    correctAnswer: "33.5m",
    difficulty: "hard",
    category: "logical",
    marks: 3,
  },
  {
    question: "Four consultants (X, Y, Z, W) specialize in Finance, Tech, HR, and Marketing, driving Audi, BMW, Mercedes, and Tesla. X drives neither Tesla nor Audi. The HR consultant drives BMW. Z is the Finance expert and does not drive Mercedes. W drives Audi. What field does Y specialize in?",
    options: ["HR", "Tech", "Marketing", "Finance"],
    correctAnswer: "HR",
    difficulty: "hard",
    category: "logical",
    marks: 3,
  },
  {
    question: "Which finding most severely WEAKENS the proposal: 'A university should replace traditional textbooks with tablets to reduce student costs, because digital textbook licenses are cheaper to produce'?",
    options: [
      "Tablets incur high initial procurement, repair, and annual recurring software subscription costs.",
      "Students report higher retention when reading paper textbooks.",
      "Some specialized publishers do not yet offer digital formats.",
      "Tablets can introduce recreational distractions during classroom lectures."
    ],
    correctAnswer: "Tablets incur high initial procurement, repair, and annual recurring software subscription costs.",
    difficulty: "hard",
    category: "logical",
    marks: 3,
  },

  // Verbal (6)
  {
    question: "Choose the statement that best captures the precise nuance of 'LACONIC':",
    options: [
      "Excessively talkative and prone to rambling",
      "Using very few words in speech or writing, concise to the point of seeming terse",
      "Experiencing rapid, erratic fluctuations in mood",
      "Displaying chronic physical lethargy and sluggishness"
    ],
    correctAnswer: "Using very few words in speech or writing, concise to the point of seeming terse",
    difficulty: "hard",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Identify the sentence that correctly employs the subjunctive mood:",
    options: [
      "The board insisted that the CEO attends the emergency hearing.",
      "The board insisted that the CEO attend the emergency hearing.",
      "The board insisted that the CEO attended the emergency hearing.",
      "The board insisted that the CEO must attend the emergency hearing."
    ],
    correctAnswer: "The board insisted that the CEO attend the emergency hearing.",
    difficulty: "hard",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Identify the rhetorical literary device in: 'The deafening silence roared inside the abandoned cathedral.'",
    options: ["Simile", "Metaphor", "Oxymoron", "Hyperbole"],
    correctAnswer: "Oxymoron",
    difficulty: "hard",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Choose the accurate meaning of 'OBSEQUIOUS':",
    options: [
      "Excessively obedient, servile, and eager to please in order to win favor",
      "Visibly bellicose and pugnacious",
      "Rigidly adhereing to orthodox religious practices",
      "Exceptionally lucid and expressive in debate"
    ],
    correctAnswer: "Excessively obedient, servile, and eager to please in order to win favor",
    difficulty: "hard",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Select the grammatically sound improvement: 'Had the team [prepared better, they would have won] the tournament.'",
    options: [
      "prepared better, they had won",
      "prepared better, they would have won",
      "had prepared better, they would win",
      "would have prepared, they would win"
    ],
    correctAnswer: "prepared better, they would have won",
    difficulty: "hard",
    category: "verbal",
    marks: 3,
  },
  {
    question: "Complete the analogical reasoning pair: 'INEFFABLE : EXPRESSION ::'",
    options: [
      "Irrevocable : Decision",
      "Inscrutable : Comprehension",
      "Audacious : Caution",
      "Tenacious : Strength"
    ],
    correctAnswer: "Inscrutable : Comprehension",
    difficulty: "hard",
    category: "verbal",
    marks: 3,
  },
];

async function seedAptitude() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding Aptitude questions...");

    // Remove any existing aptitude questions to ensure a clean state
    await AptitudeQuestion.deleteMany({});
    console.log("Cleared existing AptitudeQuestion records.");

    // Insert all 60 questions
    const inserted = await AptitudeQuestion.insertMany(questions);
    console.log(`Successfully seeded ${inserted.length} Aptitude questions!`);

    const easyCount = await AptitudeQuestion.countDocuments({ difficulty: "easy" });
    const mediumCount = await AptitudeQuestion.countDocuments({ difficulty: "medium" });
    const hardCount = await AptitudeQuestion.countDocuments({ difficulty: "hard" });

    console.log("Seeding breakdown:");
    console.log(`- Easy: ${easyCount}`);
    console.log(`- Medium: ${mediumCount}`);
    console.log(`- Hard: ${hardCount}`);
    console.log(`Total: ${easyCount + mediumCount + hardCount}`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB. Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed aptitude questions:", error);
    process.exit(1);
  }
}

seedAptitude();
