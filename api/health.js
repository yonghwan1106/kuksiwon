/**
 * Vercel Serverless Function - Health Check
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
        res.status(200).json({
            status: 'OK',
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            uptime: 300,
            environment: 'production',
            platform: 'vercel'
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}