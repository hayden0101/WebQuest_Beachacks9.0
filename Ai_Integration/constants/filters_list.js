// Filter Lists - ASI:One
// NSFW words and safe substitutes

export const NSFW_WORDS = [
  'badword1', 'badword2', 'badword3', 
  // Add actual NSFW words here in production
  // These are placeholders for demonstration
];

export const SAFE_SUBSTITUTES = {
  'badword1': 'awesome',
  'badword2': 'wonderful',
  'badword3': 'fantastic',
  // Map NSFW words to safe alternatives
  'stupid': 'uninformed',
  'dumb': 'unknowledgeable',
  'hate': 'dislike',
  'kill': 'defeat',
  'die': 'fail'
};
