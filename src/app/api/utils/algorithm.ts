export function getNextRecommendedGenre(preferences: { genre: string; likes_count: number }[]): string {
  const defaultGenres = ['jpop', 'pop', 'hiphop', 'rock'];
  if (!preferences || preferences.length === 0) {
    return defaultGenres[Math.floor(Math.random() * defaultGenres.length)];
  }

  const totalLikes = preferences.reduce((sum, item) => sum + item.likes_count, 0);
  if (totalLikes === 0) return defaultGenres[Math.floor(Math.random() * defaultGenres.length)];

  const randomRoll = Math.random(); 
  let cumulativeProbability = 0;

  for (const pref of preferences) {
    const probability = pref.likes_count / totalLikes;
    cumulativeProbability += probability;
    if (randomRoll <= cumulativeProbability) {
      return pref.genre;
    }
  }

  return defaultGenres[Math.floor(Math.random() * defaultGenres.length)];
}