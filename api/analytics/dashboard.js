/**
 * Vercel Serverless Function - Analytics Dashboard
 */

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // Mock analytics data
        const mockData = {
            totalQuestions: 1247,
            questionsToday: 23,
            avgQualityScore: 0.87,
            activeUsers: 45,
            questionTypes: {
                multiple_choice: 67,
                scenario_based: 23,
                case_study: 8,
                calculation: 2
            },
            recentActivity: [
                {
                    id: 1,
                    type: 'question_generated',
                    specialty: 'internal_medicine',
                    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                    quality: 0.89
                },
                {
                    id: 2,
                    type: 'question_generated', 
                    specialty: 'surgery',
                    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
                    quality: 0.92
                },
                {
                    id: 3,
                    type: 'question_generated',
                    specialty: 'nursing',
                    timestamp: new Date(Date.now() - 1000 * 60 * 67).toISOString(),
                    quality: 0.84
                }
            ],
            qualityTrends: {
                daily: [0.85, 0.87, 0.89, 0.88, 0.90, 0.87, 0.89],
                weekly: [0.86, 0.88, 0.87, 0.89]
            },
            specialtyStats: [
                { name: '내과학', count: 342, avgQuality: 0.89 },
                { name: '외과학', count: 289, avgQuality: 0.85 },
                { name: '간호학', count: 198, avgQuality: 0.88 },
                { name: '약학', count: 156, avgQuality: 0.90 },
                { name: '치의학', count: 134, avgQuality: 0.86 }
            ]
        };

        res.status(200).json({
            success: true,
            data: mockData,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}