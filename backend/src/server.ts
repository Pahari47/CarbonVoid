import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import stream from 'stream';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface UserData {
  videoHours: number;
  cloudStorage: number; // in GB
  videoCalls: number;   // in hours
  screenTime?: number;  // optional
}

// Generate carbon footprint summary using Gemini
async function getGeminiAIResponse(userData: UserData): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Calculate the carbon footprint based on:
- Video streaming hours: ${userData.videoHours}
- Cloud storage used: ${userData.cloudStorage} GB
- Video calls: ${userData.videoCalls} hours

Add fun and helpful analogies like:
- Car travel equivalent
- Number of trees needed to offset
- Electricity consumption
Then give helpful green suggestions to reduce digital carbon footprint.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error: any) {
    console.error('Gemini Error:', error.message);
    throw new Error('Failed to fetch AI response');
  }
}

// Custom suggestions
function generateGreenSuggestions(userData: UserData): string[] {
  const suggestions: string[] = [];

  if (userData.cloudStorage > 50) {
    suggestions.push("🧹 Clean up unused cloud files to save energy!");
  }
  if (userData.videoHours > 5) {
    suggestions.push("📺 Reduce HD/4K streaming to save carbon emissions.");
  }
  if (userData.screenTime && userData.screenTime > 6) {
    suggestions.push("💡 Take screen breaks for your health and the planet!");
  }

  if (suggestions.length === 0) {
    suggestions.push("✅ You're already managing digital habits well!");
  }

  return suggestions;
}

// === API ROUTES ===

// Get AI + suggestions (JSON)
app.post('/api/getCarbonReport', async (req: Request<{}, {}, UserData>, res: Response) => {
  const userData = req.body;

  if (
    typeof userData.videoHours !== 'number' ||
    typeof userData.cloudStorage !== 'number' ||
    typeof userData.videoCalls !== 'number'
  ) {
    return res.status(400).json({ message: 'Invalid input types' });
  }

  try {
    const report = await getGeminiAIResponse(userData);
    const suggestions = generateGreenSuggestions(userData);

    res.status(200).json({
      message: 'Carbon report generated!',
      carbonReport: report,
      greenSuggestions: suggestions
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get same report in PDF format
app.post('/api/downloadCarbonReportPDF', async (req: Request<{}, {}, UserData>, res: Response) => {
  const userData = req.body;

  try {
    const report = await getGeminiAIResponse(userData);
    const suggestions = generateGreenSuggestions(userData);

    const doc = new PDFDocument();
    const bufferStream = new stream.PassThrough();
    doc.pipe(bufferStream);

    doc.fontSize(20).text('📝 Carbon Report Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`📺 Video Streaming: ${userData.videoHours} hrs`);
    doc.text(`☁️ Cloud Storage: ${userData.cloudStorage} GB`);
    doc.text(`📞 Video Calls: ${userData.videoCalls} hrs`);
    doc.moveDown();
    doc.fontSize(14).text('🌍 AI-Generated Report:', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(report);

    doc.moveDown();
    doc.fontSize(14).text('♻️ Green Suggestions:', { underline: true });
    doc.moveDown();
    suggestions.forEach(s => doc.fontSize(12).text(`- ${s}`));

    doc.end();

    res.setHeader('Content-disposition', 'attachment; filename=carbon_report.pdf');
    res.setHeader('Content-type', 'application/pdf');

    bufferStream.on('data', chunk => res.write(chunk));
    bufferStream.on('end', () => res.end());
  } catch (error: any) {
    res.status(500).json({ message: 'PDF generation failed', error: error.message });
  }
});

// Stub route for declutter API (future feature)
app.post('/api/declutter', (req: Request, res: Response) => {
  const mockSuggestions = [
    '🧹 Delete old screenshots from Downloads folder.',
    '🗃️ Archive unused emails older than 1 year.',
    '🔕 Unsubscribe from newsletters you don’t read.',
  ];
  res.json({ declutterSuggestions: mockSuggestions });
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
