/**
 * Vercel Serverless Function - Collaboration Rooms
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
        // Mock collaboration rooms data
        const mockRooms = [
            {
                id: 'room_001',
                name: '내과학 문제 검토',
                description: '급성 질환 관련 문제들을 검토하는 룸',
                participants: [
                    { id: 'user_1', name: '김의사', role: 'reviewer' },
                    { id: 'user_2', name: '이교수', role: 'expert' }
                ],
                activeQuestions: 3,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                status: 'active'
            },
            {
                id: 'room_002', 
                name: '외과학 시나리오 개발',
                description: '수술 관련 시나리오 문제 개발',
                participants: [
                    { id: 'user_3', name: '박외과', role: 'creator' },
                    { id: 'user_4', name: '최간호사', role: 'collaborator' }
                ],
                activeQuestions: 1,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                status: 'active'
            }
        ];

        res.status(200).json({
            success: true,
            data: mockRooms,
            timestamp: new Date().toISOString()
        });
    } else if (req.method === 'POST') {
        const { action, roomData } = req.body;
        
        if (action === 'create') {
            res.status(200).json({
                success: true,
                message: 'Room created successfully',
                data: {
                    id: `room_${Date.now()}`,
                    ...roomData,
                    createdAt: new Date().toISOString(),
                    status: 'active'
                }
            });
        } else if (action === 'join') {
            res.status(200).json({
                success: true,
                message: 'Successfully joined room',
                roomId: roomData.roomId
            });
        } else {
            res.status(400).json({ error: 'Invalid action' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}