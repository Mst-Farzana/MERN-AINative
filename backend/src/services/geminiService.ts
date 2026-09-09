import { GoogleGenAI } from '@google/genai';

interface DashboardData {
  todayOrders: { count: number; total: number };
  monthOrders: { count: number; total: number };
  totalOrders: { count: number; total: number };
  statusCounts: {
    pending: number;
    processing: number;
    delivered: number;
  };
  categoryRevenue: Array<{ category: string; revenue: number }>;
  recentOrders: Array<{
    customerName: string;
    orderAmount: number;
    status: string;
    orderDate: Date;
  }>;
}

export interface DashboardInsight {
  summary: string;
  highlights: string[];
  recommendations: string[];
  risk: string;
  source?: 'gemini' | 'fallback';
}

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  return new GoogleGenAI({ apiKey });
};

export const generateDashboardInsight = async (
  dashboardData: DashboardData
): Promise<DashboardInsight> => {
  try {
    const ai = getClient();
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const prompt = `You are an e-commerce operations analyst. Analyze the following dashboard data and return ONLY valid JSON matching this exact shape:
{"summary":"short summary","highlights":["3 concise observations"],"recommendations":["3 actionable recommendations"],"risk":"one key risk or say No immediate risk"}
Use clear business language. Do not invent facts or numbers. Currency values are in the store's default currency.

Dashboard data:
${JSON.stringify(dashboardData)}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.2 },
    });

    const text = response.text;
    if (!text) throw new Error('Gemini returned an empty response');

    const parsed = JSON.parse(text) as DashboardInsight;
    if (
      typeof parsed.summary !== 'string' ||
      !Array.isArray(parsed.highlights) ||
      !Array.isArray(parsed.recommendations) ||
      typeof parsed.risk !== 'string'
    )
      throw new Error('Gemini returned an invalid insight format');

    return { ...parsed, source: 'gemini' };
  } catch (error: unknown) {
    console.error('Gemini unavailable, using dashboard fallback:', error);
    const orders = dashboardData.totalOrders.count;
    const revenue = dashboardData.monthOrders.total;
    return {
      summary:
        orders === 0
          ? 'Your workspace has no recorded orders yet, so there is no sales trend to analyze.'
          : `${orders} orders have been recorded with ${revenue} in revenue this month.`,
      highlights: [
        `${dashboardData.todayOrders.count} orders were recorded today.`,
        `${dashboardData.monthOrders.count} orders were recorded this month.`,
        `${dashboardData.statusCounts.pending} orders are currently pending.`,
      ],
      recommendations: [
        'Connect your booking and payment events so new activity appears here.',
        'Review pending bookings daily and follow up with clients.',
        'Use the calendar to fill open slots with follow-up appointments.',
      ],
      risk:
        orders === 0 ? 'No sales activity is available yet.' : 'Pending orders may need attention.',
      source: 'fallback',
    };
  }
};
