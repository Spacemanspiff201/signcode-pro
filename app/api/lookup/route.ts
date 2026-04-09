import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const JURISDICTIONS: Record<string, { name: string; urls: string[] }> = {
  "miami-dade": {
    name: "Miami-Dade County, FL",
    urls: [
      "https://library.municode.com/fl/miami_-_dade_county/codes/code_of_ordinances?nodeId=PTIIICOOR_CH33ZO_ARTIVSIAG_S33-84GESI",
      "https://library.municode.com/fl/miami_-_dade_county/codes/code_of_ordinances?nodeId=PTIIICOOR_CH33ZO_ARTIVSIAG_S33-88SISP",
    ],
  },
  "broward": {
    name: "Broward County, FL",
    urls: [
      "https://library.municode.com/fl/broward_county/codes/code_of_ordinances?nodeId=PTIICOOR_CH4BURE_ARTXXIVSI",
    ],
  },
  "fort-lauderdale": {
    name: "City of Fort Lauderdale, FL",
    urls: [
      "https://library.municode.com/fl/fort_lauderdale/codes/unified_land_development_regulations?nodeId=SPBECO_CH47SI_S47-3GERE",
      "https://library.municode.com/fl/fort_lauderdale/codes/unified_land_development_regulations?nodeId=SPBECO_CH47SI_S47-4SIST",
    ],
  },
  "pompano-beach": {
    name: "City of Pompano Beach, FL",
    urls: [
      "https://library.municode.com/fl/pompano_beach/codes/code_of_ordinances?nodeId=PTIICOOR_CH155SI",
    ],
  },
  "boca-raton": {
    name: "City of Boca Raton, FL",
    urls: [
      "https://library.municode.com/fl/boca_raton/codes/code_of_ordinances?nodeId=PTIICOOR_CH28SI_ARTIIISIRE",
    ],
  },
  "palm-beach": {
    name: "Palm Beach County, FL",
    urls: [
      "https://library.municode.com/fl/palm_beach_county/codes/unified_land_development_code?nodeId=ULDC_ART8SI",
    ],
  },
  "orlando": {
    name: "City of Orlando, FL",
    urls: [
      "https://library.municode.com/fl/orlando/codes/code_of_ordinances?nodeId=COOR_CH64LAUSDERE_ARTIVISICO_S64.601GERE",
      "https://library.municode.com/fl/orlando/codes/code_of_ordinances?nodeId=COOR_CH64LAUSDERE_ARTIVISICO_S64.608SIOB",
    ],
  },
  "tampa": {
    name: "City of Tampa, FL",
    urls: [
      "https://library.municode.com/fl/tampa/codes/code_of_ordinances?nodeId=COOR_CH20.5SI_ARTIIISIRE",
    ],
  },
  "hillsborough": {
    name: "Hillsborough County, FL",
    urls: [
      "https://library.municode.com/fl/hillsborough_county/codes/code_of_ordinances?nodeId=HILLSBOROUGH_CO_OR_CH6LAUS_ARTVISIRE",
    ],
  },
  "miami-beach": {
    name: "City of Miami Beach, FL",
    urls: [
      "https://library.municode.com/fl/miami_beach/codes/code_of_ordinances?nodeId=PTIIICOOR_CH142ZORE_ARTXIIISI",
    ],
  },
};

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);
    return text;
  } catch (e) {
    console.error("fetch error:", e);
    return "";
  }
}

export async function GET(req: NextRequest) {
  const jurisdiction = req.nextUrl.searchParams.get("jurisdiction");

  if (!jurisdiction) {
    return NextResponse.json({ error: "Jurisdiction required" }, { status: 400 });
  }

  const jData = JURISDICTIONS[jurisdiction];
  if (!jData) {
    return NextResponse.json({ error: "Jurisdiction not found" }, { status: 404 });
  }

  const pageTexts = await Promise.all(jData.urls.map(fetchPageText));
  const combinedText = pageTexts.filter(t => t.length > 200).join("\n\n---\n\n");

  if (!combinedText || combinedText.length < 200) {
    // Fall back to asking Claude from its training knowledge
    const fallbackPrompt = `You are a sign permit expert with deep knowledge of Florida municipal sign codes.

Based on your knowledge of ${jData.name}'s sign code regulations, provide the following information in JSON format. Be as accurate as possible based on the official code.

Return ONLY a valid JSON object:
{
  "name": "${jData.name}",
  "maxPylonHeight": <number in feet>,
  "maxMonumentHeight": <number in feet>,
  "maxSignArea": <number in sq ft for commercial B-2 zone>,
  "minSetback": <number in feet from ROW>,
  "emcAllowed": <true or false>,
  "emcNotes": <string with EMC requirements if allowed, or null>,
  "permitFee": <string describing fee structure>,
  "turnaround": <string like "4-6 weeks">,
  "requiredDocs": <array of required document strings>,
  "keyRestrictions": <2 sentence plain English summary of main restrictions>,
  "confidence": "medium",
  "source": "training-knowledge"
}`;

    try {
      const message = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: fallbackPrompt }],
      });
      const text = message.content[0].type === "text" ? message.content[0].text : "";
      const clean = text.replace(/```json|```/g, "").trim();
      const data = JSON.parse(clean);
      return NextResponse.json({ success: true, data, scrapedAt: new Date().toISOString(), source: "ai-knowledge" });
    } catch {
      return NextResponse.json({ error: "Failed to get jurisdiction data" }, { status: 500 });
    }
  }

  const prompt = `You are a sign permit expert. Extract sign code requirements from this official municipal code text for ${jData.name}.

Return ONLY a valid JSON object with exactly these fields (use null only if genuinely not found anywhere in the text):
{
  "name": "${jData.name}",
  "maxPylonHeight": <number in feet or null>,
  "maxMonumentHeight": <number in feet or null>,
  "maxSignArea": <number in sq ft or null>,
  "minSetback": <number in feet or null>,
  "emcAllowed": <true/false or null>,
  "emcNotes": <string or null>,
  "permitFee": <string or null>,
  "turnaround": <string or null>,
  "requiredDocs": <array of strings or null>,
  "keyRestrictions": <2 sentence plain English summary>,
  "confidence": <"high" if most fields found, "medium" if some, "low" if few>,
  "source": "scraped"
}

Municipal code text:
${combinedText}`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);
    return NextResponse.json({ success: true, data, scrapedAt: new Date().toISOString(), source: "scraped" });
  } catch (err) {
    console.error("[lookup] error:", err);
    return NextResponse.json({ error: "Failed to parse data" }, { status: 500 });
  }
}