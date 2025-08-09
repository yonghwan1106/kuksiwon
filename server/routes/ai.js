/**
 * AI Routes - Question Generation API Endpoints
 * Enhanced with Gemini AI Integration
 */

import express from 'express';
import GeminiService from '../services/geminiService.js';

const router = express.Router();
const geminiService = new GeminiService();

/**
 * POST /api/ai/generate
 * Generate a single medical exam question
 */
router.post('/generate', async (req, res) => {
    try {
        const {
            specialty,
            difficulty,
            questionType,
            topic,
            keywords,
            learningObjectives,
            language
        } = req.body;

        // Validate required parameters
        if (!specialty || !topic) {
            return res.status(400).json({
                error: 'Missing required parameters',
                required: ['specialty', 'topic'],
                received: Object.keys(req.body)
            });
        }

        console.log('🚀 AI Generation Request:', {
            specialty,
            difficulty,
            questionType,
            topic,
            keywordsCount: keywords?.length || 0
        });

        // Generate question using Gemini AI
        const startTime = Date.now();
        const questionData = await geminiService.generateQuestion({
            specialty,
            difficulty: difficulty || 'medium',
            questionType: questionType || 'multiple_choice',
            topic,
            keywords: keywords || [],
            learningObjectives: learningObjectives || [],
            language: language || 'korean'
        });

        const generationTime = Date.now() - startTime;

        // Add request metadata
        const response = {
            success: true,
            data: questionData,
            generation: {
                timeMs: generationTime,
                model: geminiService.modelName,
                timestamp: new Date().toISOString()
            }
        };

        console.log(`✅ Question generated successfully in ${generationTime}ms`);
        res.json(response);

    } catch (error) {
        console.error('❌ AI generation error:', error);
        res.status(500).json({
            error: 'Question generation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * POST /api/ai/generate-batch
 * Generate multiple questions in batch
 */
router.post('/generate-batch', async (req, res) => {
    try {
        const { count, ...params } = req.body;

        if (!params.specialty || !params.topic) {
            return res.status(400).json({
                error: 'Missing required parameters',
                required: ['specialty', 'topic'],
                received: Object.keys(params)
            });
        }

        if (!count || count < 1 || count > 10) {
            return res.status(400).json({
                error: 'Invalid count parameter',
                message: 'Count must be between 1 and 10'
            });
        }

        console.log(`🔄 Batch AI Generation Request: ${count} questions`);

        const startTime = Date.now();
        const result = await geminiService.generateBatch({ count, ...params });
        const totalTime = Date.now() - startTime;

        const response = {
            success: true,
            data: result,
            generation: {
                totalTimeMs: totalTime,
                averageTimeMs: Math.round(totalTime / count),
                model: geminiService.modelName,
                timestamp: new Date().toISOString()
            }
        };

        console.log(`✅ Batch generation completed: ${result.questions.length}/${count} successful`);
        res.json(response);

    } catch (error) {
        console.error('❌ Batch generation error:', error);
        res.status(500).json({
            error: 'Batch generation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * POST /api/ai/enhance
 * Enhance existing question using AI
 */
router.post('/enhance', async (req, res) => {
    try {
        const { questionData, enhancements } = req.body;

        if (!questionData) {
            return res.status(400).json({
                error: 'Missing question data'
            });
        }

        if (!enhancements || !Array.isArray(enhancements)) {
            return res.status(400).json({
                error: 'Missing enhancement requests',
                message: 'enhancements must be an array of strings'
            });
        }

        console.log('🔧 AI Enhancement Request:', {
            questionId: questionData.id,
            enhancements: enhancements
        });

        const startTime = Date.now();
        const enhancedQuestion = await geminiService.enhanceQuestion(questionData, enhancements);
        const enhancementTime = Date.now() - startTime;

        const response = {
            success: true,
            data: enhancedQuestion,
            enhancement: {
                timeMs: enhancementTime,
                requests: enhancements,
                model: geminiService.modelName,
                timestamp: new Date().toISOString()
            }
        };

        console.log(`✅ Question enhanced successfully in ${enhancementTime}ms`);
        res.json(response);

    } catch (error) {
        console.error('❌ AI enhancement error:', error);
        res.status(500).json({
            error: 'Question enhancement failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/ai/specialties
 * Get available medical specialties
 */
router.get('/specialties', (req, res) => {
    try {
        const specialties = geminiService.getSpecialties();
        
        res.json({
            success: true,
            data: specialties,
            count: Object.keys(specialties).length
        });
    } catch (error) {
        console.error('❌ Error getting specialties:', error);
        res.status(500).json({
            error: 'Failed to get specialties',
            message: error.message
        });
    }
});

/**
 * GET /api/ai/question-types
 * Get available question types
 */
router.get('/question-types', (req, res) => {
    try {
        const questionTypes = geminiService.getQuestionTypes();
        
        res.json({
            success: true,
            data: questionTypes,
            count: Object.keys(questionTypes).length
        });
    } catch (error) {
        console.error('❌ Error getting question types:', error);
        res.status(500).json({
            error: 'Failed to get question types',
            message: error.message
        });
    }
});

/**
 * GET /api/ai/health
 * Check AI service health
 */
router.get('/health', async (req, res) => {
    try {
        const health = await geminiService.checkHealth();
        
        res.json({
            success: true,
            service: 'Gemini AI',
            ...health,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Health check error:', error);
        res.status(500).json({
            success: false,
            service: 'Gemini AI',
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/ai/models
 * Get AI model information
 */
router.get('/models', (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                primary: {
                    name: geminiService.modelName,
                    provider: 'Google',
                    type: 'Generative AI',
                    capabilities: [
                        'Medical Question Generation',
                        'Quality Enhancement',
                        'Batch Processing',
                        'Multi-language Support'
                    ]
                },
                specialized: {
                    medical_domains: Object.values(geminiService.getSpecialties()),
                    question_types: Object.values(geminiService.getQuestionTypes()),
                    languages: ['Korean', 'English']
                }
            }
        });
    } catch (error) {
        console.error('❌ Error getting model info:', error);
        res.status(500).json({
            error: 'Failed to get model information',
            message: error.message
        });
    }
});

/**
 * POST /api/ai/validate
 * Validate question quality using AI
 */
router.post('/validate', async (req, res) => {
    try {
        const { questionData } = req.body;

        if (!questionData) {
            return res.status(400).json({
                error: 'Missing question data'
            });
        }

        console.log('🔍 AI Validation Request for question:', questionData.title);

        // Use private method for validation (in real implementation, this should be public)
        const qualityScore = await geminiService._validateQuality(questionData);

        const response = {
            success: true,
            data: qualityScore,
            validation: {
                model: geminiService.modelName,
                timestamp: new Date().toISOString()
            }
        };

        console.log(`✅ Question validated with overall score: ${qualityScore.overall}`);
        res.json(response);

    } catch (error) {
        console.error('❌ AI validation error:', error);
        res.status(500).json({
            error: 'Question validation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

export default router;