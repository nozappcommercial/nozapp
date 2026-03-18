import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_URL = "https://streaming-availability.p.rapidapi.com/shows/search/title";

export async function GET(req: Request) {
  // Admin only or secret-protected route ideally.
  // For now, we protect it with the RAPIDAPI_KEY existence.
  if (!RAPIDAPI_KEY) {
    return NextResponse.json({ error: "Missing RAPIDAPI_KEY in .env.local" }, { status: 500 });
  }

  const supabase = await createClient();

  // 1. Fetch movies that don't have streaming_providers set yet.
  // We limit to 5 per request to avoid Vercel Serverless Function 10s timeout.
  const { data: movies, error: fetchError } = await supabase
    .from('films')
    .select('id, title, year')
    .is('streaming_providers', null)
    .limit(5);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!movies || movies.length === 0) {
    return NextResponse.json({ message: "No movies need syncing right now." });
  }

  const updatedMovies = [];

  // 2. Loop and hit RapidAPI
  for (const movie of movies) {
    try {
      // Small delay between calls to respect rate limits
      await new Promise(r => setTimeout(r, 600));

      const response = await fetch(`${RAPIDAPI_URL}?title=${encodeURIComponent(movie.title)}&country=it&show_type=movie`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch API for ${movie.title}: ${response.status}`);
        continue;
      }

      const result = await response.json();
      
      let providersMap = new Set<string>();

      // Extract streaming info for Italy ('it'). We just grab the service names (e.g. 'netflix', 'prime').
      // The exact path depends on the API version, but typically it returns a list of matching shows.
      // We check the first match that roughly matches the year.
      if (result && result.length > 0) {
        const bestMatch = result.find((item: any) => Math.abs(item.releaseYear - parseInt(movie.year)) <= 2) || result[0];
        
        if (bestMatch && bestMatch.streamingInfo && bestMatch.streamingInfo.it) {
            // It could be an array of objects or just an array depending on the plan.
            const itProviders = bestMatch.streamingInfo.it;
            for (const p of itProviders) {
               if (p.service) {
                 // Clean up names for UI (e.g. 'prime' -> 'Prime Video')
                 const name = p.service.toLowerCase();
                 providersMap.add(name);
               }
            }
        }
      }

      const providersArray = Array.from(providersMap);

      // 3. Update Supabase
      const { error: updateError } = await supabase
        .from('films')
        .update({ streaming_providers: providersArray })
        .eq('id', movie.id);

      if (updateError) {
         console.error(`DB Update failed for ${movie.title}`, updateError);
      } else {
         updatedMovies.push({ title: movie.title, providers: providersArray });
      }

    } catch (e) {
      console.error(`Error processing ${movie.title}`, e);
    }
  }

  return NextResponse.json({
    message: `Processed ${updatedMovies.length} movies.`,
    updated: updatedMovies
  });
}
