import { Request, Response } from 'express';
import { reportService } from '../services/reportService';

export const ReportController = {
    async getCarbonReport(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const userData = await reportService.getUserFootprintData(userId);
            const report = await reportService.generateAIReport(userData);
            const suggestions = reportService.generateGreenSuggestions(userData);

            res.json({
                success: true,
                data: {
                    ...userData,
                    report,
                    suggestions
                }
            });
        } catch (error) {
            console.error('Report Error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate carbon report'
            });
        }
    },

    async downloadPDFReport(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=carbon_report_${userId}.pdf`);

            const pdfStream = await reportService.generatePDFReport(userId);
            pdfStream.pipe(res);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate PDF report'
            });
        }
    }
};