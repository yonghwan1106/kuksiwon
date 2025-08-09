/**
 * Vercel Serverless Function - Questions Management
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
        // Mock questions data
        const mockQuestions = [
            {
                id: 'q_001',
                title: '급성 심근경색 진단',
                specialty: 'internal_medicine',
                difficulty: 'medium',
                questionType: 'multiple_choice',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                qualityScore: 0.89,
                status: 'approved'
            },
            {
                id: 'q_002',
                title: '수술 전 환자 준비',
                specialty: 'surgery',
                difficulty: 'hard',
                questionType: 'scenario_based',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
                qualityScore: 0.92,
                status: 'approved'
            },
            {
                id: 'q_003',
                title: '간호 계획 수립',
                specialty: 'nursing',
                difficulty: 'easy',
                questionType: 'case_study',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
                qualityScore: 0.84,
                status: 'pending'
            }
        ];

        res.status(200).json({
            success: true,
            data: mockQuestions,
            total: mockQuestions.length,
            timestamp: new Date().toISOString()
        });
    } else if (req.method === 'POST') {
        // Handle question creation/update
        const { action, questionData } = req.body;
        
        res.status(200).json({
            success: true,
            message: `Question ${action} successful`,
            data: {
                id: `q_${Date.now()}`,
                ...questionData,
                createdAt: new Date().toISOString()
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}