import type { Question } from "../types";
import { shuffle } from "../shuffle";

export const QUESTION_POOLS = {
  "krishna-lila-kids": [
    {
      question: "Krishna was born in prison and taken by Vasudeva to which place?",
      options: ["Mathura", "Gokul", "Vrindavan", "Dvaraka"],
      correctIndex: 1,
    },
    {
      question: "Who raised Krishna in Gokul?",
      options: ["Vasudeva and Devaki", "Dasharatha and Kaushalya", "Nanda Maharaja and Mother Yashoda", "Arjuna and Draupadi"],
      correctIndex: 2,
    },
    {
      question: "Who was Krishna's elder brother?",
      options: ["Arjuna", "Balarama", "Bhima", "Sudama"],
      correctIndex: 1,
    },
    {
      question: "Which demon appeared as a cart to kill Krishna?",
      options: ["Shakatasura", "Aghasura", "Trinavarta", "Kaliya"],
      correctIndex: 0,
    },
    {
      question: "Who witnessed galaxies inside the mouth of infant Krishna?",
      options: ["Rohini", "Devaki", "Yashoda", "Nanda Maharaja"],
      correctIndex: 2,
    },
    {
      question: "What did Krishna do on the hoods of Kaliya?",
      options: ["Slept", "Danced", "Played His flute", "Hid"],
      correctIndex: 1,
    },
    {
      question: "Why did Krishna lift Govardhan Hill?",
      options: ["To build a palace", "To find treasure", "To protect the people and cows from heavy rain", "To cross the Yamuna"],
      correctIndex: 2,
    },
    {
      question: "Who sent devastating rainfall to Vrindavan?",
      options: ["Varuna", "Vayu", "Brahma", "Indra"],
      correctIndex: 3,
    },
    {
      question: "For how long did Krishna expand Himself as the calves and cowherd boys?",
      options: ["One week", "Two months", "Eight months", "One year"],
      correctIndex: 3,
    },
    {
      question: "Who was the younger brother of Putana and Bakasura?",
      options: ["Trinavarta", "Vyomasura", "Aghasura", "Shakatasura"],
      correctIndex: 2,
    },
  ],
  "bhagavad-gita-adults": [
    {
      question: "According to the purport to Bhagavad-gita 1.1, why did Dhritarashtra fear losing the battle?",
      options: ["Kurukshetra was a sacred place of pilgrimage", "The Pandavas were virtuous by nature", "Both A and B", "Neither A nor B"],
      correctIndex: 2,
    },
    {
      question: "According to the purport to Bhagavad-gita 1.1, what is the significance of the words dharma-ksetre and kuru-ksetre?",
      options: ["Krishna, the father of religion, was present at Kurukshetra", "Unwanted persons such as Duryodhana would be destroyed there", "Religious persons headed by Yudhishthira would be established by the Lord", "All of the above"],
      correctIndex: 3,
    },
    {
      question: "Why did Duryodhana point out to Dronacharya that the Pandava army had been arranged by Dhrishtadyumna?",
      options: ["To make Dronacharya alert and uncompromising", "To prevent Dronacharya from being lenient toward the Pandavas", "Because such leniency could lead to the Kauravas' defeat", "All of the above"],
      correctIndex: 3,
    },
    {
      question: "According to the purport to Bhagavad-gita 1.12, what did Bhishma's loud conch-blowing indirectly signal to Duryodhana?",
      options: ["Bhishma was simply cheering him", "Duryodhana had no chance of victory", "Duryodhana's victory was certain", "It had no particular meaning"],
      correctIndex: 1,
    },
    {
      question: "Why did Krishna carry out Arjuna's order to place the chariot between the two armies?",
      options: ["Arjuna was a pure devotee of the Lord", "The Lord takes transcendental pleasure in serving His pure devotee", "Both A and B", "Neither A nor B"],
      correctIndex: 2,
    },
    {
      question: "According to Bhagavad-gita 2.47, what should one avoid claiming ownership over?",
      options: ["One's prescribed duty", "The fruits of one's work", "Spiritual knowledge", "One's senses"],
      correctIndex: 1,
    },
    {
      question: "In which chapter does Krishna reveal His universal form?",
      options: ["Chapter 4", "Chapter 7", "Chapter 11", "Chapter 18"],
      correctIndex: 2,
    },
    {
      question: "What are the three modes of material nature?",
      options: ["Dharma, artha and kama", "Goodness, passion and ignorance", "Creation, maintenance and destruction", "Body, mind and intelligence"],
      correctIndex: 1,
    },
    {
      question: "Which chapter is titled \"Devotional Service\"?",
      options: ["Chapter 6", "Chapter 9", "Chapter 12", "Chapter 15"],
      correctIndex: 2,
    },
    {
      question: "What is Krishna's concluding instruction in Bhagavad-gita 18.66?",
      options: ["Abandon all work", "Worship the demigods", "Surrender unto Him", "Retire to the forest"],
      correctIndex: 2,
    },
  ],
  "mahabharata-adults": [
    {
      question: "What was the name of Arjuna's bow?",
      options: ["Vijaya", "Gandiva", "Pinaka", "Sharanga"],
      correctIndex: 1,
    },
    {
      question: "Who was the eldest of the Pandavas?",
      options: ["Bhima", "Yudhishthira", "Arjuna", "Nakula"],
      correctIndex: 1,
    },
    {
      question: "What was Draupadi born from?",
      options: ["Fire", "Water", "Earth", "A lotus"],
      correctIndex: 0,
    },
    {
      question: "How many years were the Pandavas required to live in exile, including the incognito year?",
      options: ["12", "13", "14", "15"],
      correctIndex: 1,
    },
    {
      question: "What disguise did Arjuna adopt during the incognito year?",
      options: ["Cook", "Charioteer", "Dance teacher", "Horse keeper"],
      correctIndex: 2,
    },
    {
      question: "Who was the son of Bhima and Hidimba?",
      options: ["Barbarika", "Jatasura", "Iravan", "Ghatotkacha"],
      correctIndex: 3,
    },
    {
      question: "What was the name of Krishna's conch?",
      options: ["Panchajanya", "Devadatta", "Sughosha", "Anantavijaya"],
      correctIndex: 0,
    },
    {
      question: "Who was responsible for killing Dronacharya?",
      options: ["Arjuna", "Bhima", "Dhrishtadyumna", "Yudhishthira"],
      correctIndex: 2,
    },
    {
      question: "What was Shikhandi's identity in a previous birth?",
      options: ["A Gandharva", "A Yaksha", "Amba", "A cursed king"],
      correctIndex: 2,
    },
    {
      question: "Who narrated the Mahabharata to King Janamejaya?",
      options: ["Vyasa", "Vaisampayana", "Narada", "Lomaharshana"],
      correctIndex: 1,
    },
  ],
  "srimad-bhagavatam-adults": [
    {
      question: "Who compiled the Srimad-Bhagavatam?",
      options: ["Valmiki", "Vyasadeva", "Narada Muni", "Sukadeva Goswami"],
      correctIndex: 1,
    },
    {
      question: "Who spoke the Bhagavatam to Maharaja Parikshit?",
      options: ["Suta Goswami", "Narada Muni", "Sukadeva Goswami", "Maitreya Rishi"],
      correctIndex: 2,
    },
    {
      question: "For how many days did Parikshit hear the Bhagavatam?",
      options: ["Three days", "Seven days", "Twelve days", "Eighteen days"],
      correctIndex: 1,
    },
    {
      question: "Who cursed Maharaja Parikshit to die within seven days?",
      options: ["Shamika Rishi", "Shringi", "Takshaka", "Kali"],
      correctIndex: 1,
    },
    {
      question: "How did Maharaja Parikshit offend the meditating sage Shamika Rishi?",
      options: ["He interrupted the sage's sacrifice", "He took away the sage's water pot", "He placed a dead snake around the sage's neck", "He insulted the sage's son"],
      correctIndex: 2,
    },
    {
      question: "Which sage instructed Dhruva Maharaja in mantra meditation?",
      options: ["Vyasadeva", "Narada Muni", "Durvasa Muni", "Maitreya Rishi"],
      correctIndex: 1,
    },
    {
      question: "Which name did Ajamila call at the time of death?",
      options: ["Govinda", "Madhava", "Narayana", "Keshava"],
      correctIndex: 2,
    },
    {
      question: "Who was the mother of Lord Kapiladeva?",
      options: ["Kunti", "Devahuti", "Aditi", "Suniti"],
      correctIndex: 1,
    },
    {
      question: "Whom did Krishna send from Mathura to deliver His message to the residents of Vrindavan?",
      options: ["Akrura", "Balarama", "Uddhava", "Narada Muni"],
      correctIndex: 2,
    },
    {
      question: "Because of his attachment to a young animal, what did Maharaja Bharata become in his next life?",
      options: ["A deer", "An elephant", "A swan", "A lion"],
      correctIndex: 0,
    },
  ],
  "general-krishna-trivia-adults": [
    {
      question: "What does the name \"Krishna\" mean?",
      options: ["All-attractive", "Great warrior", "Lord of fire", "King of heaven"],
      correctIndex: 0,
    },
    {
      question: "Which festival celebrates Krishna's appearance?",
      options: ["Gaura Purnima", "Rama Navami", "Janmashtami", "Narasimha Chaturdashi"],
      correctIndex: 2,
    },
    {
      question: "How many wives did Lord Krishna have?",
      options: ["16,100", "16,000", "16,108", "16,001"],
      correctIndex: 2,
    },
    {
      question: "Which sacred river is closely associated with Krishna's Vrindavan pastimes?",
      options: ["Ganga", "Godavari", "Yamuna", "Kaveri"],
      correctIndex: 2,
    },
    {
      question: "Dantavakra wanted to kill Krishna to avenge the death of which friend?",
      options: ["Shalva", "Shishupala", "Paundraka", "Kamsa"],
      correctIndex: 0,
    },
    {
      question: "Which goddess is Krishna's eternal consort and foremost devotee?",
      options: ["Sita", "Rukmini", "Subhadra", "Srimati Radharani"],
      correctIndex: 3,
    },
    {
      question: "Who was the spiritual master of Krishna and Balarama during Their studies?",
      options: ["Garga Muni", "Sandipani Muni", "Durvasa Muni", "Akrura"],
      correctIndex: 1,
    },
    {
      question: "Who founded ISKCON?",
      options: ["Sri Chaitanya Mahaprabhu", "Srila A. C. Bhaktivedanta Swami Prabhupada", "Bhaktivinoda Thakura", "Madhvacharya"],
      correctIndex: 1,
    },
    {
      question: "In which city was ISKCON founded in 1966?",
      options: ["London", "Mumbai", "New York City", "Los Angeles"],
      correctIndex: 2,
    },
    {
      question: "To which spiritual tradition does ISKCON belong?",
      options: ["Gaudiya Vaishnavism", "Buddhism", "Jainism", "Shaivism"],
      correctIndex: 0,
    },
  ],
} satisfies Record<string, Question[]>;

export type QuizTopic = keyof typeof QUESTION_POOLS;

export function getQuestions(topic: QuizTopic): Question[] {
  return shuffle(QUESTION_POOLS[topic]).slice(0, 5);
}
