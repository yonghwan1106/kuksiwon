/**
 * Questions Routes - CRUD Operations for Generated Questions
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for demo (in production, use proper database)
let questions = [];
let questionStats = {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0
};

/**
 * GET /api/questions
 * Get all questions with filtering and pagination
 */
router.get('/', (req, res) => {
    try {
        const {
            specialty,
            difficulty,
            status,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let filteredQuestions = [...questions];

        // Apply filters
        if (specialty) {
            filteredQuestions = filteredQuestions.filter(q => 
                q.metadata?.specialty === specialty
            );
        }

        if (difficulty) {
            filteredQuestions = filteredQuestions.filter(q => 
                q.metadata?.difficulty === difficulty
            );
        }

        if (status) {
            filteredQuestions = filteredQuestions.filter(q => 
                q.status === status
            );
        }

        // Sort questions
        filteredQuestions.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        // Pagination
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: paginatedQuestions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredQuestions.length,
                pages: Math.ceil(filteredQuestions.length / parseInt(limit))
            },
            filters: {
                specialty,
                difficulty,
                status
            }
        });

    } catch (error) {
        console.error('❌ Error getting questions:', error);
        res.status(500).json({
            error: 'Failed to get questions',
            message: error.message
        });
    }
});

/**
 * GET /api/questions/:id
 * Get specific question by ID
 */
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const question = questions.find(q => q.id === id);

        if (!question) {
            return res.status(404).json({
                error: 'Question not found',
                id: id
            });
        }

        res.json({
            success: true,
            data: question
        });

    } catch (error) {
        console.error('❌ Error getting question:', error);
        res.status(500).json({
            error: 'Failed to get question',
            message: error.message
        });
    }
});

/**
 * POST /api/questions
 * Create/Save a new question
 */
router.post('/', (req, res) => {
    try {
        const questionData = req.body;

        // Generate unique ID
        const id = uuidv4();
        
        // Create question object
        const question = {
            id,
            ...questionData,
            status: questionData.status || 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: req.user?.id || 'system', // In real app, get from auth
            version: 1,
            history: []
        };

        // Add to storage
        questions.push(question);
        
        // Update stats
        questionStats.total++;
        questionStats[question.status] = (questionStats[question.status] || 0) + 1;

        console.log(`📝 Question created: ${question.title} (${question.id})`);

        res.status(201).json({
            success: true,
            data: question,
            message: 'Question created successfully'
        });

    } catch (error) {
        console.error('❌ Error creating question:', error);
        res.status(500).json({
            error: 'Failed to create question',
            message: error.message
        });
    }
});

/**
 * PUT /api/questions/:id
 * Update existing question
 */
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const questionIndex = questions.findIndex(q => q.id === id);
        
        if (questionIndex === -1) {
            return res.status(404).json({
                error: 'Question not found',
                id: id
            });
        }

        const currentQuestion = questions[questionIndex];
        
        // Store current version in history
        const historyEntry = {
            version: currentQuestion.version,
            data: { ...currentQuestion },
            updatedAt: currentQuestion.updatedAt,
            updatedBy: currentQuestion.updatedBy || 'system'
        };

        // Update question
        const updatedQuestion = {
            ...currentQuestion,
            ...updates,
            updatedAt: new Date().toISOString(),
            updatedBy: req.user?.id || 'system',
            version: currentQuestion.version + 1,
            history: [...(currentQuestion.history || []), historyEntry]
        };

        questions[questionIndex] = updatedQuestion;

        // Update stats if status changed
        if (updates.status && updates.status !== currentQuestion.status) {
            questionStats[currentQuestion.status]--;
            questionStats[updates.status] = (questionStats[updates.status] || 0) + 1;
        }

        console.log(`📝 Question updated: ${updatedQuestion.title} (${id})`);

        res.json({
            success: true,
            data: updatedQuestion,
            message: 'Question updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating question:', error);
        res.status(500).json({
            error: 'Failed to update question',
            message: error.message
        });
    }
});

/**
 * DELETE /api/questions/:id
 * Delete question
 */
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const questionIndex = questions.findIndex(q => q.id === id);

        if (questionIndex === -1) {
            return res.status(404).json({
                error: 'Question not found',
                id: id
            });
        }

        const deletedQuestion = questions[questionIndex];
        questions.splice(questionIndex, 1);

        // Update stats
        questionStats.total--;
        questionStats[deletedQuestion.status]--;

        console.log(`🗑️ Question deleted: ${deletedQuestion.title} (${id})`);

        res.json({
            success: true,
            message: 'Question deleted successfully',
            deletedQuestion: {
                id: deletedQuestion.id,
                title: deletedQuestion.title
            }
        });

    } catch (error) {
        console.error('❌ Error deleting question:', error);
        res.status(500).json({
            error: 'Failed to delete question',
            message: error.message
        });
    }
});

/**
 * POST /api/questions/:id/approve
 * Approve question
 */
router.post('/:id/approve', (req, res) => {
    try {
        const { id } = req.params;
        const { comment, approvedBy } = req.body;

        const questionIndex = questions.findIndex(q => q.id === id);
        
        if (questionIndex === -1) {
            return res.status(404).json({
                error: 'Question not found',
                id: id
            });
        }

        const question = questions[questionIndex];
        const oldStatus = question.status;

        // Update question status
        questions[questionIndex] = {
            ...question,
            status: 'approved',
            approvedAt: new Date().toISOString(),
            approvedBy: approvedBy || req.user?.id || 'system',
            approvalComment: comment,
            updatedAt: new Date().toISOString()
        };

        // Update stats
        if (oldStatus !== 'approved') {
            questionStats[oldStatus]--;
            questionStats.approved++;
        }

        console.log(`✅ Question approved: ${question.title} (${id})`);

        res.json({
            success: true,
            data: questions[questionIndex],
            message: 'Question approved successfully'
        });

    } catch (error) {
        console.error('❌ Error approving question:', error);
        res.status(500).json({
            error: 'Failed to approve question',
            message: error.message
        });
    }
});

/**
 * POST /api/questions/:id/reject
 * Reject question
 */
router.post('/:id/reject', (req, res) => {
    try {
        const { id } = req.params;
        const { reason, rejectedBy } = req.body;

        if (!reason) {
            return res.status(400).json({
                error: 'Rejection reason is required'
            });
        }

        const questionIndex = questions.findIndex(q => q.id === id);
        
        if (questionIndex === -1) {
            return res.status(404).json({
                error: 'Question not found',
                id: id
            });
        }

        const question = questions[questionIndex];
        const oldStatus = question.status;

        // Update question status
        questions[questionIndex] = {
            ...question,
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectedBy: rejectedBy || req.user?.id || 'system',
            rejectionReason: reason,
            updatedAt: new Date().toISOString()
        };

        // Update stats
        if (oldStatus !== 'rejected') {
            questionStats[oldStatus]--;
            questionStats.rejected++;
        }

        console.log(`❌ Question rejected: ${question.title} (${id})`);

        res.json({
            success: true,
            data: questions[questionIndex],
            message: 'Question rejected'
        });

    } catch (error) {
        console.error('❌ Error rejecting question:', error);
        res.status(500).json({
            error: 'Failed to reject question',
            message: error.message
        });
    }
});

/**
 * GET /api/questions/stats
 * Get question statistics
 */
router.get('/stats/overview', (req, res) => {
    try {
        // Calculate real-time stats
        const realTimeStats = questions.reduce((stats, question) => {
            stats.total++;
            stats[question.status] = (stats[question.status] || 0) + 1;
            return stats;
        }, { total: 0 });

        // Calculate quality distribution
        const qualityDistribution = questions.reduce((dist, question) => {
            if (question.qualityScore?.overall) {
                const score = question.qualityScore.overall;
                if (score >= 0.9) dist.excellent++;
                else if (score >= 0.8) dist.good++;
                else if (score >= 0.7) dist.average++;
                else dist.poor++;
            }
            return dist;
        }, { excellent: 0, good: 0, average: 0, poor: 0 });

        res.json({
            success: true,
            data: {
                status: realTimeStats,
                quality: qualityDistribution,
                recent: {
                    lastWeek: questions.filter(q => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(q.createdAt) > weekAgo;
                    }).length,
                    lastMonth: questions.filter(q => {
                        const monthAgo = new Date();
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return new Date(q.createdAt) > monthAgo;
                    }).length
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error getting stats:', error);
        res.status(500).json({
            error: 'Failed to get statistics',
            message: error.message
        });
    }
});

export default router;