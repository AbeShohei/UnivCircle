import { GoogleGenAI, Type } from "@google/genai";
import { CircleCategory } from '../types';
import { MOCK_UNIVERSITIES } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface SmartSearchResponse {
  university: string | null;
  category: string | null;
  campus: string | null;
  tags: string[];
  reasoning: string;
}

export const getSmartSearchFilters = async (userInput: string): Promise<SmartSearchResponse> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Returning default.");
    return { university: null, category: null, campus: null, tags: [], reasoning: "API Key missing." };
  }

  // 1. Structure the knowledge base so AI knows which campus belongs to which university.
  // We separate detailed universities (with specific campuses) from generic ones.
  
  const detailedUniversities = MOCK_UNIVERSITIES
    .filter(u => u.campuses.length > 0 && u.campuses[0] !== 'キャンパス')
    .map(u => `- ${u.name}: [${u.campuses.join(', ')}]`)
    .join('\n');

  // For generic universities, we just list names to save tokens/reduce noise, 
  // but we provide the full list so AI recognizes the university name.
  const genericUniversities = MOCK_UNIVERSITIES
    .filter(u => u.campuses.length === 1 && u.campuses[0] === 'キャンパス')
    .map(u => u.name)
    .join(', ');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Search Query: "${userInput}"

      Your task is to interpret the user's search intent for a university circle platform and extract filters.

      ### Knowledge Base
      
      **Universities with specific campuses:**
      ${detailedUniversities}
      
      **Other Known Universities (Generic Campus):**
      ${genericUniversities}
      
      **Categories:**
      ${Object.values(CircleCategory).join(', ')}

      ### Instructions
      1. **University**: Identify the university name. Use the exact name from the Knowledge Base.
      2. **Campus**: 
         - If a specific campus is mentioned (e.g., "Toyama"), ensure it belongs to the identified university.
         - If the user implies a location or faculty that strongly suggests a specific campus (based on your general knowledge of these universities), you may infer the campus.
         - **CRITICAL**: Do not hallucinate a campus. Only return a campus if it is valid for that university.
      3. **Category**: Map to the closest Category enum.
      4. **Tags**: Extract 1-3 short, relevant tags (e.g. "初心者歓迎", "テニス").
      5. **Reasoning**: Briefly explain why you chose these filters in Japanese.

      ### Output Format (JSON)
      {
        "university": string | null,
        "category": string | null,
        "campus": string | null,
        "tags": string[],
        "reasoning": string
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            university: { type: Type.STRING, nullable: true },
            category: { type: Type.STRING, nullable: true },
            campus: { type: Type.STRING, nullable: true },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text;
    if (!text) return { university: null, category: null, campus: null, tags: [], reasoning: "Failed to parse." };
    
    return JSON.parse(text) as SmartSearchResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { university: null, category: null, campus: null, tags: [], reasoning: "Error analyzing request." };
  }
};

/**
 * Refines the circle description text to be more attractive for new students.
 */
export const refineDescription = async (currentText: string): Promise<string> => {
  if (!apiKey) return currentText;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        あなたは大学サークルの新歓担当リーダーであり、プロのコピーライターです。
        以下のサークル紹介文を、新入生にとって「親しみやすく」「楽しそうで」「参加したくなる」文章にリライトしてください。
        
        **要件:**
        - 日本語で出力すること。
        - 絵文字を適度に使用して雰囲気を明るくすること。
        - 重要な情報は消さずに保持すること。
        - 読みやすいように適度な改行を入れること。
        - 300文字〜500文字程度にまとめること。

        **元の文章:**
        ${currentText}
      `,
    });

    return response.text || currentText;
  } catch (error) {
    console.error("Gemini Refine Error:", error);
    throw new Error("AIによる推敲に失敗しました");
  }
};