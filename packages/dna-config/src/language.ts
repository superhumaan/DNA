const TERMS = [
  "fuck",
  "fucking",
  "fucker",
  "motherfucker",
  "shit",
  "bullshit",
  "shitty",
  "bitch",
  "bastard",
  "asshole",
  "dickhead",
  "cock",
  "pussy",
  "cunt",
  "whore",
  "slut",
  "nigger",
  "nigga",
  "faggot",
  "fag",
  "retard",
  "retarded",
  "damn",
  "goddamn",
  "crap",
];

const OBFUSCATED = [
  String.raw`f[\W_]*u?[\W_]*c[\W_]*k\w*`,
  String.raw`s[\W_]*h[\W_]*i[\W_]*t\w*`,
  String.raw`b[\W_]*i[\W_]*t[\W_]*c[\W_]*h\w*`,
  String.raw`c[\W_]*u[\W_]*n[\W_]*t\w*`,
];

/** Replace profanity, slurs, and common obfuscations. Leaves the rest of the text. */
export function stripInappropriateLanguage(text: string): string {
  const words = new RegExp(`\\b(?:${TERMS.join("|")})\\b`, "gi");
  const disguised = new RegExp(`\\b(?:${OBFUSCATED.join("|")})`, "gi");
  return text.replace(words, "[removed]").replace(disguised, "[removed]");
}
