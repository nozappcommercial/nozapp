import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { config } from "@/lib/config";

const RAPIDAPI_URL = "https://streaming-availability.p.rapidapi.com/shows/search/title";

export async function GET(req: Request) {
  const RAPIDAPI_KEY = config.RAPIDAPI_KEY;
  const CRON_SECRET = config.CRON_SECRET;

  if (!RAPIDAPI_KEY || !CRON_SECRET) {
      console.error("❌ Missing critical configuration (RAPIDAPI_KEY or CRON_SECRET). Sync aborted.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const supabaseUrl = config.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = config.SUPABASE_SERVICE_ROLE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 1. Fetch movies that don't have streaming_providers set yet.
  // Since you are running this locally, we can increase the limit to process up to 100 movies at once.
  const { data: movies, error: fetchError } = await supabase
    .from('films')
    .select('id, title, year')
    .is('streaming_providers', null)
    .limit(100);

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
      
      let providersMap = new Map<string, any>();

      // Extract streaming info for Italy ('it').
      // We check the first match that roughly matches the year.
      if (result && result.length > 0) {
        const bestMatch = result.find((item: any) => Math.abs(item.releaseYear - parseInt(movie.year)) <= 2) || result[0];
        
        if (bestMatch && bestMatch.streamingOptions && bestMatch.streamingOptions.it) {
            const itProviders = bestMatch.streamingOptions.it;
            for (const p of itProviders) {
               if (p.service && p.service.name) {
                 // The API returns p.service as an object { id: "netflix", name: "Netflix" }
                 const name = p.service.name;
                 const type = p.type; // 'subscription', 'rent', 'buy', 'free', 'addon'
                 const link = p.link;
                 const price = p.price?.formatted; // e.g. "3.99 EUR"

                 // We use a Map keyed by service name to avoid duplicates 
                 // (e.g. if it's available for both rent and buy on Prime, we could store 'rent/buy' or just the lowest price).
                 // For simplicity, if we already saw it as subscription, we keep that. Otherwise we overwrite.
                 if (!providersMap.has(name) || type === 'subscription') {
                     providersMap.set(name, {
                         name,
                         type,
                         price: type === 'subscription' ? undefined : price,
                         link
                     });
                 }
               }
            }
        }
      }

      const providersArray = Array.from(providersMap.values());

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
