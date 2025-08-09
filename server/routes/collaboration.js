/**
 * Collaboration Routes - Real-time Collaboration Features
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for demo
let collaborationSessions = [];
let comments = [];
let notifications = [];

/**
 * GET /api/collaboration/sessions
 * Get active collaboration sessions
 */
router.get('/sessions', (req, res) => {
    try {
        const { questionId, userId } = req.query;

        let sessions = [...collaborationSessions];

        if (questionId) {
            sessions = sessions.filter(s => s.questionId === questionId);
        }

        if (userId) {
            sessions = sessions.filter(s => 
                s.participants.some(p => p.userId === userId)
            );
        }

        res.json({
            success: true,
            data: sessions,
            count: sessions.length
        });

    } catch (error) {
        console.error('❌ Error getting collaboration sessions:', error);
        res.status(500).json({
            error: 'Failed to get collaboration sessions',
            message: error.message
        });
    }
});

/**
 * POST /api/collaboration/sessions
 * Create new collaboration session
 */
router.post('/sessions', (req, res) => {
    try {
        const { questionId, title, description, invitees } = req.body;

        if (!questionId || !title) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['questionId', 'title']
            });
        }

        const session = {
            id: uuidv4(),
            questionId,
            title,
            description: description || '',
            createdBy: req.user?.id || 'system',
            createdAt: new Date().toISOString(),
            status: 'active',
            participants: [
                {
                    userId: req.user?.id || 'system',
                    role: 'owner',
                    joinedAt: new Date().toISOString(),
                    isOnline: true
                }
            ],
            invitees: invitees || [],
            settings: {
                allowComments: true,
                allowEditing: true,
                requireApproval: false
            }
        };

        collaborationSessions.push(session);

        console.log(`👥 Collaboration session created: ${title} (${session.id})`);

        res.status(201).json({
            success: true,
            data: session,
            message: 'Collaboration session created'
        });

    } catch (error) {
        console.error('❌ Error creating collaboration session:', error);
        res.status(500).json({
            error: 'Failed to create collaboration session',
            message: error.message
        });
    }
});

/**
 * POST /api/collaboration/sessions/:id/join
 * Join collaboration session
 */
router.post('/sessions/:id/join', (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userName } = req.body;

        const sessionIndex = collaborationSessions.findIndex(s => s.id === id);
        
        if (sessionIndex === -1) {
            return res.status(404).json({
                error: 'Collaboration session not found'
            });
        }

        const session = collaborationSessions[sessionIndex];
        
        // Check if user already in session
        const existingParticipant = session.participants.find(p => p.userId === userId);
        
        if (existingParticipant) {
            // Update online status
            existingParticipant.isOnline = true;
            existingParticipant.lastSeen = new Date().toISOString();
        } else {
            // Add new participant
            session.participants.push({
                userId: userId || uuidv4(),
                userName: userName || `User ${session.participants.length + 1}`,
                role: 'collaborator',
                joinedAt: new Date().toISOString(),
                isOnline: true
            });
        }

        collaborationSessions[sessionIndex] = session;

        console.log(`👤 User joined session: ${userName} -> ${session.title}`);

        res.json({
            success: true,
            data: session,
            message: 'Joined collaboration session'
        });

    } catch (error) {
        console.error('❌ Error joining collaboration session:', error);
        res.status(500).json({
            error: 'Failed to join collaboration session',
            message: error.message
        });
    }
});

/**
 * POST /api/collaboration/sessions/:id/leave
 * Leave collaboration session
 */
router.post('/sessions/:id/leave', (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const sessionIndex = collaborationSessions.findIndex(s => s.id === id);
        
        if (sessionIndex === -1) {
            return res.status(404).json({
                error: 'Collaboration session not found'
            });
        }

        const session = collaborationSessions[sessionIndex];
        const participant = session.participants.find(p => p.userId === userId);
        
        if (participant) {
            participant.isOnline = false;
            participant.leftAt = new Date().toISOString();
        }

        console.log(`👋 User left session: ${userId} -> ${session.title}`);

        res.json({
            success: true,
            data: session,
            message: 'Left collaboration session'
        });

    } catch (error) {
        console.error('❌ Error leaving collaboration session:', error);
        res.status(500).json({
            error: 'Failed to leave collaboration session',
            message: error.message
        });
    }
});

/**
 * GET /api/collaboration/comments
 * Get comments for a question
 */
router.get('/comments', (req, res) => {
    try {
        const { questionId, sessionId } = req.query;

        if (!questionId && !sessionId) {
            return res.status(400).json({
                error: 'Either questionId or sessionId is required'
            });
        }

        let filteredComments = comments.filter(comment => {
            if (questionId && comment.questionId === questionId) return true;
            if (sessionId && comment.sessionId === sessionId) return true;
            return false;
        });

        // Sort by creation time
        filteredComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.json({
            success: true,
            data: filteredComments,
            count: filteredComments.length
        });

    } catch (error) {
        console.error('❌ Error getting comments:', error);
        res.status(500).json({
            error: 'Failed to get comments',
            message: error.message
        });
    }
});

/**
 * POST /api/collaboration/comments
 * Add comment to question
 */
router.post('/comments', (req, res) => {
    try {
        const { questionId, sessionId, content, parentId } = req.body;

        if (!content || (!questionId && !sessionId)) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['content', 'questionId or sessionId']
            });
        }

        const comment = {
            id: uuidv4(),
            questionId,
            sessionId,
            content,
            parentId: parentId || null,
            authorId: req.user?.id || 'anonymous',
            authorName: req.user?.name || 'Anonymous User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            replies: [],
            reactions: {}
        };

        comments.push(comment);

        console.log(`💬 Comment added: ${content.substring(0, 50)}...`);

        res.status(201).json({
            success: true,
            data: comment,
            message: 'Comment added'
        });

    } catch (error) {
        console.error('❌ Error adding comment:', error);
        res.status(500).json({
            error: 'Failed to add comment',
            message: error.message
        });
    }
});

/**
 * PUT /api/collaboration/comments/:id
 * Update comment
 */
router.put('/comments/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                error: 'Content is required'
            });
        }

        const commentIndex = comments.findIndex(c => c.id === id);
        
        if (commentIndex === -1) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        comments[commentIndex] = {
            ...comments[commentIndex],
            content,
            updatedAt: new Date().toISOString(),
            edited: true
        };

        res.json({
            success: true,
            data: comments[commentIndex],
            message: 'Comment updated'
        });

    } catch (error) {
        console.error('❌ Error updating comment:', error);
        res.status(500).json({
            error: 'Failed to update comment',
            message: error.message
        });
    }
});

/**
 * DELETE /api/collaboration/comments/:id
 * Delete comment
 */
router.delete('/comments/:id', (req, res) => {
    try {
        const { id } = req.params;
        const commentIndex = comments.findIndex(c => c.id === id);

        if (commentIndex === -1) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        const deletedComment = comments.splice(commentIndex, 1)[0];

        res.json({
            success: true,
            message: 'Comment deleted',
            deletedComment: {
                id: deletedComment.id,
                content: deletedComment.content.substring(0, 50) + '...'
            }
        });

    } catch (error) {
        console.error('❌ Error deleting comment:', error);
        res.status(500).json({
            error: 'Failed to delete comment',
            message: error.message
        });
    }
});

/**
 * GET /api/collaboration/notifications
 * Get user notifications
 */
router.get('/notifications', (req, res) => {
    try {
        const { userId, unreadOnly } = req.query;

        let userNotifications = notifications.filter(n => 
            n.recipientId === userId || n.recipientId === 'all'
        );

        if (unreadOnly === 'true') {
            userNotifications = userNotifications.filter(n => !n.read);
        }

        // Sort by creation time (newest first)
        userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            data: userNotifications,
            count: userNotifications.length,
            unreadCount: userNotifications.filter(n => !n.read).length
        });

    } catch (error) {
        console.error('❌ Error getting notifications:', error);
        res.status(500).json({
            error: 'Failed to get notifications',
            message: error.message
        });
    }
});

/**
 * POST /api/collaboration/notifications
 * Create notification
 */
router.post('/notifications', (req, res) => {
    try {
        const { type, title, message, recipientId, data } = req.body;

        if (!type || !title || !message || !recipientId) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['type', 'title', 'message', 'recipientId']
            });
        }

        const notification = {
            id: uuidv4(),
            type, // 'comment', 'approval', 'collaboration', 'system'
            title,
            message,
            recipientId,
            senderId: req.user?.id || 'system',
            data: data || {},
            read: false,
            createdAt: new Date().toISOString()
        };

        notifications.push(notification);

        console.log(`🔔 Notification created: ${title} -> ${recipientId}`);

        res.status(201).json({
            success: true,
            data: notification,
            message: 'Notification created'
        });

    } catch (error) {
        console.error('❌ Error creating notification:', error);
        res.status(500).json({
            error: 'Failed to create notification',
            message: error.message
        });
    }
});

/**
 * PUT /api/collaboration/notifications/:id/read
 * Mark notification as read
 */
router.put('/notifications/:id/read', (req, res) => {
    try {
        const { id } = req.params;
        const notificationIndex = notifications.findIndex(n => n.id === id);

        if (notificationIndex === -1) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }

        notifications[notificationIndex].read = true;
        notifications[notificationIndex].readAt = new Date().toISOString();

        res.json({
            success: true,
            data: notifications[notificationIndex],
            message: 'Notification marked as read'
        });

    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
        res.status(500).json({
            error: 'Failed to mark notification as read',
            message: error.message
        });
    }
});

export default router;