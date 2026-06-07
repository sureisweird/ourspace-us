export interface ConfigPinGate {
  title: string;
  subtitle: string;
  buttonText: string;
  errorText: string;
  hintButtonShow: string;
  hintButtonHide: string;
  pinHint: string;
}

export interface ConfigGiftBox {
  envelopeSub: string;
  envelopeTitle: string;
  envelopeRetry: string;
  letterDear: string;
  letterSub: string;
  letterText: string;
}

export interface ConfigPage {
  brandName: string;
  navLinks: { id: string; label: string }[];
  dateEst: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroButton1: string;
  heroButton2: string;
}

export interface ConfigMilestones {
  chapter: string;
  titleLine1: string;
  titleHighlight: string;
  cards: { year: string; milestone: string; title: string; message: string }[];
}

export interface ConfigLoveLetter {
  envelopeSub: string;
  letterDear: string;
  paragraphs: string[];
  signature: string;
}

export interface ConfigSoundtrack {
  title: string;
  hintText: string;
}

export const CONFIG_PINGATE: ConfigPinGate = {
  title: "Your Special Day",
  subtitle: "Enter the birthday PIN to continue",
  buttonText: "UNLOCK YOUR SURPRISE",
  errorText: "Incorrect PIN. Try again 💖",
  hintButtonShow: "Need a hint?",
  hintButtonHide: "Hide hint",
  pinHint: "Your birth date (MMDD) 🎂"
};

export const CONFIG_GIFTBOX: ConfigGiftBox = {
  envelopeSub: "A birthday letter just for you",
  envelopeTitle: "Tap to open your birthday surprise",
  envelopeRetry: "Tap once more to open",
  letterDear: "Happy Birthday, Sunshine!",
  letterSub: "Today is all about celebrating you.",
  letterText: "Let's open the pages of our beautiful memories..."
};

export const CONFIG_PAGE: ConfigPage = {
  brandName: "YOUR HAVEN",
  navLinks: [
    { id: "#memories", label: "01 / MEMORIES" },
    { id: "#milestones", label: "02 / JOURNEY" },
    { id: "#letter", label: "03 / WISHES" }
  ],
  dateEst: "Happy Birthday!",
  heroTitleLine1: "Celebrating",
  heroTitleHighlight: "your beautiful existence.",
  heroDescription: "A digital sanctuary filled with our milestones, golden memories, and melodies that speak of how much brighter you make the world. Welcome to your space.",
  heroButton1: "EXPLORE MEMORIES",
  heroButton2: "READ MY WISHES"
};

export const CONFIG_MILESTONES: ConfigMilestones = {
  chapter: "Chapter II",
  titleLine1: "A journey decorated with",
  titleHighlight: "moments of joy",
  cards: [
    {
      year: "Chapter 1",
      milestone: "The Spark",
      title: "Finding Your Light",
      message: "The moment you entered my life, everything felt brighter. Seeing you celebrate your milestones and witnessing your passion first-hand was a reminder of how lucky I am to know you."
    },
    {
      year: "Chapter 2",
      milestone: "The Growth",
      title: "Growing Together",
      message: "Through every laugh, inside joke, and quiet moment, we've built a bond that keeps growing stronger. Sharing life's simple joys with you is my absolute favorite thing."
    },
    {
      year: "Chapter 3",
      milestone: "The Strength",
      title: "Standing Strong",
      message: "We've shared sunny days and weathered storms together. Seeing you overcome challenges with grace and strength makes me incredibly proud of the person you are."
    },
    {
      year: "Future",
      milestone: "The Horizon",
      title: "To Many More Adventures",
      message: "Today we celebrate another wonderful year of your life. I look forward to supporting your dreams, sharing more laughter, and being by your side for every chapter ahead."
    }
  ]
};

export const CONFIG_LOVELETTER: ConfigLoveLetter = {
  envelopeSub: "A Letter for the Birthday Girl",
  letterDear: "Dearest Sweetheart,",
  paragraphs: [
    "On this beautiful day, I want to remind you of how incredibly special you are to me. You bring warmth, kindness, and so much light into this world just by being in it.",
    "Thank you for all the laughter we've shared, the quiet moments of comfort, and the endless support you give. You are my happiness, my peace, and my greatest blessing.",
    "May this new year of your life bring you endless joy, love, and the fulfillment of all your dreams. I promise to be here, cheering you on every single step of the way."
  ],
  signature: "With all my love, Always 🌸"
};

export const CONFIG_SOUNDTRACK: ConfigSoundtrack = {
  title: "Your Birthday Playlist",
  hintText: "Add your favorite track to /public/music/our-song.mp3 to play real audio."
};
