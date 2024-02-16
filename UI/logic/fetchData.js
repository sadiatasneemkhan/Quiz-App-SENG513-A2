async function fetchData(currentDifficulty) {
  const maxRetries = 3; // Max number of retries
  let retryCount = 0;

  while (1) {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=9&difficulty=${currentDifficulty}&type=multiple`
      );

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || 10; // Default to 10 seconds
        console.log(
          `Rate limit exceeded. Retrying after ${retryAfter} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Waiting before retrying
        retryCount++;
      } else {
        const data = await response.json();
        return data.results;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  throw new Error("Max retries exceeded. Unable to fetch data."); // Throw an error if max retries are reached
}

export default fetchData;
