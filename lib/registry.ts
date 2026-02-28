export type ApiTool = {
  id: string
  name: string
  category: string
  description: string
  endpoint: string
  priceUsd: number
  tags: string[]
  docsUrl?: string
}

export const API_REGISTRY: ApiTool[] = [
  // Weather
  { id: 'weather_openmeteo', name: 'Live Weather (Open-Meteo)', category: 'Weather', description: 'Free real-time weather data — temperature, wind, precipitation for any coordinates.', endpoint: '/tools/weather', priceUsd: 0.01, tags: ['weather', 'temperature', 'wind', 'rain', 'open-meteo', 'forecast'] },
  { id: 'weather_openweather', name: 'Global Weather (OpenWeather)', category: 'Weather', description: 'Weather data for 200,000+ cities with hourly and daily forecasts.', endpoint: '/tools/openweather', priceUsd: 0.02, tags: ['weather', 'forecast', 'city', 'openweather', 'climate', 'temperature'] },
  { id: 'weather_forecast', name: '7-Day Forecast', category: 'Weather', description: 'Extended weekly forecast with daily highs, lows, and precipitation probability.', endpoint: '/tools/forecast', priceUsd: 0.02, tags: ['forecast', 'weekly', '7day', 'weather', 'climate'] },

  // Finance
  { id: 'finance_crypto', name: 'Crypto Price Oracle', category: 'Finance', description: 'Live SOL/USD, BTC/USD, ETH/USD prices with 1-minute granularity via CoinGecko.', endpoint: '/tools/crypto', priceUsd: 0.01, tags: ['crypto', 'bitcoin', 'solana', 'ethereum', 'price', 'coingecko', 'defi'] },
  { id: 'finance_stocks', name: 'Stock Quotes', category: 'Finance', description: 'Live equity prices, volume, and market cap from NYSE and NASDAQ.', endpoint: '/tools/stocks', priceUsd: 0.02, tags: ['stocks', 'equity', 'price', 'market', 'trading', 'finance', 'shares'] },
  { id: 'finance_forex', name: 'Forex Exchange Rates', category: 'Finance', description: 'Real-time foreign exchange rates for 170+ currency pairs.', endpoint: '/tools/forex', priceUsd: 0.01, tags: ['forex', 'currency', 'exchange', 'rate', 'USD', 'EUR', 'GBP'] },

  // News
  { id: 'news_breaking', name: 'Breaking News', category: 'News', description: 'Top headlines and breaking news from 80,000+ sources via Newsdata.io.', endpoint: '/tools/news', priceUsd: 0.01, tags: ['news', 'headlines', 'breaking', 'sports', 'current', 'today', 'latest', 'events', 'articles', 'media', 'newsdata'] },
  { id: 'news_search', name: 'News Search', category: 'News', description: 'Search across millions of news articles by keyword, source, or date.', endpoint: '/tools/news-search', priceUsd: 0.02, tags: ['news', 'search', 'articles', 'keyword', 'journalism', 'media'] },

  // Web Search
  { id: 'search_web', name: 'Web Search', category: 'Web Search', description: 'Returns top 10 search results for any query with titles, URLs, and snippets.', endpoint: '/tools/search', priceUsd: 0.05, tags: ['search', 'web', 'google', 'results', 'query', 'internet'] },
  { id: 'search_images', name: 'Image Search', category: 'Web Search', description: 'Search and return relevant images for any keyword or concept.', endpoint: '/tools/image-search', priceUsd: 0.03, tags: ['image', 'search', 'photo', 'visual', 'pictures', 'google images'] },

  // AI & NLP / LLM
  { id: 'openai_chat', name: 'OpenAI Chat', category: 'LLM / AI', description: 'Full GPT-4o chat completions. Send any prompt, get an intelligent response. Powered by OpenAI.', endpoint: '/tools/openai-chat', priceUsd: 0.05, tags: ['openai', 'gpt', 'chat', 'llm', 'text', 'assistant', 'ai', 'completion', 'gpt4'] },
  { id: 'nlp_sentiment', name: 'Sentiment Analyzer', category: 'AI & NLP', description: 'Returns positive/negative/neutral sentiment score and confidence for any text.', endpoint: '/tools/sentiment', priceUsd: 0.02, tags: ['sentiment', 'nlp', 'text', 'analysis', 'emotion', 'opinion', 'ai'] },
  { id: 'nlp_summarize', name: 'Summarize Webpage', category: 'AI & NLP', description: 'Pass any URL or text block and receive a concise bullet-point summary.', endpoint: '/tools/summarize', priceUsd: 0.03, tags: ['summarize', 'summary', 'nlp', 'text', 'ai', 'article', 'url', 'document'] },
  { id: 'nlp_translate', name: 'Language Translator', category: 'AI & NLP', description: 'Translates text between 50+ languages with dialect and formality support.', endpoint: '/tools/translate', priceUsd: 0.02, tags: ['translate', 'language', 'nlp', 'text', 'multilingual', 'localization'] },
  { id: 'nlp_extract', name: 'Entity Extractor', category: 'AI & NLP', description: 'Extracts people, places, organizations, and dates from any text.', endpoint: '/tools/extract', priceUsd: 0.02, tags: ['entity', 'extraction', 'nlp', 'ner', 'names', 'places', 'dates', 'ai'] },

  // Sports
  { id: 'sports_scores', name: 'Sports Scores', category: 'Sports', description: 'Live scores, fixtures, and standings for NFL, NBA, Premier League, and more.', endpoint: '/tools/sports', priceUsd: 0.01, tags: ['sports', 'score', 'scores', 'news', 'game', 'nba', 'nfl', 'soccer', 'football', 'basketball', 'match', 'league', 'live', 'standings'] },
  { id: 'sports_stats', name: 'Player Stats', category: 'Sports', description: 'Career and season statistics for professional athletes across major leagues.', endpoint: '/tools/player-stats', priceUsd: 0.02, tags: ['sports', 'stats', 'player', 'athlete', 'performance', 'season', 'career'] },

  // Food
  { id: 'food_recipes', name: 'Recipe Finder', category: 'Food', description: 'Search 2M+ recipes by ingredient, cuisine, or dietary restriction via Spoonacular.', endpoint: '/tools/recipes', priceUsd: 0.01, tags: ['recipe', 'food', 'cooking', 'ingredient', 'cuisine', 'diet', 'spoonacular'] },
  { id: 'food_nutrition', name: 'Nutrition Data', category: 'Food', description: 'Calorie counts, macros, and micronutrient data for any food or meal.', endpoint: '/tools/nutrition', priceUsd: 0.01, tags: ['nutrition', 'calories', 'food', 'macros', 'diet', 'health', 'protein'] },

  // Travel
  { id: 'travel_flights', name: 'Flight Status', category: 'Travel', description: 'Real-time flight tracking, gate info, and delay notifications for any flight number.', endpoint: '/tools/flights', priceUsd: 0.03, tags: ['flight', 'travel', 'airport', 'delay', 'airline', 'status', 'gate'] },
  { id: 'travel_hotels', name: 'Hotel Availability', category: 'Travel', description: 'Live hotel availability and pricing for any city and date range.', endpoint: '/tools/hotels', priceUsd: 0.03, tags: ['hotel', 'travel', 'accommodation', 'booking', 'price', 'airbnb'] },

  // Blockchain Data
  { id: 'blockchain_wallet', name: 'Solana Wallet Lookup', category: 'Blockchain Data', description: 'Returns SOL balance, token holdings, and recent transactions for any wallet address.', endpoint: '/tools/wallet', priceUsd: 0.01, tags: ['solana', 'wallet', 'blockchain', 'balance', 'on-chain', 'crypto', 'defi'] },
  { id: 'blockchain_nft', name: 'NFT Metadata', category: 'Blockchain Data', description: 'Ownership history, traits, and floor price for any Solana NFT by mint address.', endpoint: '/tools/nft', priceUsd: 0.02, tags: ['nft', 'solana', 'blockchain', 'metadata', 'ownership', 'floor price', 'mint'] },
  { id: 'blockchain_defi', name: 'DeFi Pool Stats', category: 'Blockchain Data', description: 'TVL, APY, and volume data for Solana DeFi pools on Raydium and Orca.', endpoint: '/tools/defi', priceUsd: 0.02, tags: ['defi', 'solana', 'pool', 'tvl', 'apy', 'raydium', 'orca', 'liquidity'] },

  // Data & Stats
  { id: 'data_demographics', name: 'City Demographics', category: 'Data & Stats', description: 'Population, income, age distribution, and growth stats for any US city.', endpoint: '/tools/demographics', priceUsd: 0.02, tags: ['demographics', 'population', 'city', 'stats', 'income', 'census', 'data'] },
  { id: 'data_github', name: 'GitHub Repo Stats', category: 'Data & Stats', description: 'Stars, forks, contributors, commit activity for any public GitHub repository.', endpoint: '/tools/github', priceUsd: 0.01, tags: ['github', 'repo', 'stars', 'code', 'developer', 'open source', 'commits'] },
]

export function discoverTools(intent: string, limit = 3): ApiTool[] {
  const tokens = intent.toLowerCase().split(/\s+/)
  return API_REGISTRY
    .map(tool => {
      const haystack = [...tool.tags, tool.name.toLowerCase(), tool.category.toLowerCase()].join(' ')
      const score = tokens.filter(t => haystack.includes(t)).length
      return { ...tool, score }
    })
    .filter(t => (t as any).score > 0)
    .sort((a, b) => (b as any).score - (a as any).score)
    .slice(0, limit)
}

export function getMockResponse(toolId: string, query: string): string {
  const responses: Record<string, string> = {
    weather_openmeteo: `Current conditions for your query: 68°F, partly cloudy. Humidity: 54%. Wind: 8mph NW. UV Index: 3. Data via Open-Meteo.`,
    weather_openweather: `Temperature: 71°F. Feels like 69°F. Clear skies expected through evening. Sunrise: 6:42 AM. Sunset: 7:18 PM.`,
    weather_forecast: `7-Day Forecast: Mon 72/58°F ☀️ | Tue 68/55°F 🌧️ | Wed 65/52°F ⛅ | Thu 74/60°F ☀️ | Fri 70/57°F ⛅ | Sat 66/54°F 🌧️ | Sun 69/56°F ☀️`,
    finance_crypto: `BTC: $67,420 (+2.3%) | ETH: $3,180 (+1.8%) | SOL: $142.50 (+4.1%) | BNB: $412.30 (-0.5%) — Updated 30 seconds ago.`,
    finance_stocks: `AAPL: $189.50 (+0.8%) | MSFT: $415.20 (+1.2%) | NVDA: $875.30 (+3.4%) | GOOGL: $175.40 (+0.6%) | TSLA: $245.80 (-1.2%)`,
    finance_forex: `EUR/USD: 1.0842 (+0.12%) | GBP/USD: 1.2654 (+0.08%) | USD/JPY: 149.23 (-0.31%) | USD/CAD: 1.3621 (+0.05%)`,
    news_breaking: `Top headlines: (1) Fed holds interest rates steady amid inflation concerns. (2) Tech stocks surge on AI earnings beats. (3) UN climate summit reaches new emissions agreement. (4) SpaceX launches 25th Starlink mission of the year.`,
    news_search: `Found 847 articles matching "${query}". Top sources: Reuters, BBC, AP News, Bloomberg. Most recent: 12 minutes ago.`,
    search_web: `Top results for "${query}": (1) Wikipedia — comprehensive overview. (2) Official documentation. (3) Recent news coverage. (4) Expert analysis. (5) Related forum discussion.`,
    search_images: `Found 2,400 images matching "${query}". Returning top 10 results with titles, dimensions, and source URLs.`,
    nlp_sentiment: `Sentiment Analysis: POSITIVE (confidence: 94.2%). Tone: Enthusiastic. Subjectivity: 0.67. Key positive phrases detected: 3. Key negative phrases: 0.`,
    nlp_summarize: `Summary: The content discusses ${query}. Key points: (1) Main topic introduced with context. (2) Supporting evidence provided. (3) Conclusion drawn with actionable insights. Reading time saved: ~8 minutes.`,
    nlp_translate: `Translation complete. Detected language: English. Target: Spanish. Result: "${query}" → "Resultado traducido aquí." Confidence: 99.1%.`,
    nlp_extract: `Entities extracted — People: 2 found | Organizations: 3 found | Locations: 1 found | Dates: 2 found | Key concepts: AI, technology, innovation.`,
    sports_scores: `NBA: Lakers 112 - Celtics 108 (Final) | NFL: Chiefs 24 - Ravens 17 (Final) | EPL: Arsenal 2 - Chelsea 1 (FT) | NHL: Rangers 4 - Bruins 2 (Final)`,
    sports_stats: `Player stats retrieved. Season averages: 28.4 PPG, 7.2 RPG, 6.8 APG. Last 5 games: 31, 24, 28, 35, 22 points. Efficiency rating: 31.2.`,
    food_recipes: `Found 847 recipes for "${query}". Top result: 4.9★ — Prep: 15 min | Cook: 30 min | Calories: 420 | Ingredients: 12 | Difficulty: Medium.`,
    food_nutrition: `Nutrition data: Calories: 320kcal | Protein: 28g | Carbs: 42g | Fat: 8g | Fiber: 6g | Sugar: 12g | Sodium: 480mg per serving.`,
    travel_flights: `Flight AA1234: ✅ On Time. Departs Gate B22 at 3:45 PM. Arrives 6:20 PM. Aircraft: Boeing 737. Seat availability: 23 remaining.`,
    travel_hotels: `Found 142 hotels for your dates. Top pick: 4.8★ Downtown Hotel — $189/night. Free cancellation. Breakfast included. 0.3mi from city center.`,
    blockchain_wallet: `Wallet balance: 2.451 SOL ($349.26 USD). Tokens: 3 SPL tokens. Recent transactions: 5 retrieved. Last activity: 2 hours ago.`,
    blockchain_nft: `NFT Metadata: Collection: DeGods #4821. Owner: 8x2...a9B. Floor price: 42 SOL. Last sale: 38 SOL (3 days ago). Rarity rank: #412/10,000.`,
    blockchain_defi: `Raydium SOL-USDC Pool: TVL $48.2M | APY 12.4% | 24h Volume $3.1M. Orca SOL-USDT Pool: TVL $22.1M | APY 9.8% | 24h Volume $1.4M.`,
    data_demographics: `City demographics loaded. Population: 2.7M (+1.2% YoY). Median income: $67,400. Age distribution: 18-34: 28% | 35-54: 31% | 55+: 24%. Growth rate: 2.1%.`,
    data_github: `Repository stats: ⭐ 42,180 stars | 🍴 3,241 forks | 👥 187 contributors | 📝 2,847 commits this year | Last commit: 3 hours ago.`,
  }
  return responses[toolId] || `Data retrieved via ${toolId} for query: "${query}". Result processed successfully.`
}
