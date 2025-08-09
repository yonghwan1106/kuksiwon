/**
 * WebSocket Service - Real-time Collaboration
 */

import { v4 as uuidv4 } from 'uuid';

export class WebSocketService {
    constructor(wss) {
        this.wss = wss;
        this.clients = new Map(); // clientId -> { ws, userId, metadata }
        this.rooms = new Map(); // roomId -> Set of clientIds
        this.userSessions = new Map(); // userId -> Set of clientIds

        this.setupEventHandlers();
        console.log('🔌 WebSocket Service initialized');
    }

    setupEventHandlers() {
        this.wss.on('connection', (ws, req) => {
            const clientId = uuidv4();
            console.log(`👤 New WebSocket connection: ${clientId}`);

            // Store client info
            this.clients.set(clientId, {
                ws,
                userId: null,
                rooms: new Set(),
                metadata: {
                    connectedAt: new Date().toISOString(),
                    userAgent: req.headers['user-agent'],
                    ip: req.connection.remoteAddress
                }
            });

            // Send welcome message
            this.sendToClient(clientId, {
                type: 'connection',
                data: {
                    clientId,
                    message: 'WebSocket connection established',
                    timestamp: new Date().toISOString()
                }
            });

            // Handle incoming messages
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(clientId, message);
                } catch (error) {
                    console.error('❌ Invalid WebSocket message:', error);
                    this.sendError(clientId, 'Invalid message format');
                }
            });

            // Handle client disconnect
            ws.on('close', () => {
                this.handleDisconnect(clientId);
            });

            // Handle errors
            ws.on('error', (error) => {
                console.error(`❌ WebSocket error for ${clientId}:`, error);
                this.handleDisconnect(clientId);
            });
        });
    }

    handleMessage(clientId, message) {
        const { type, data } = message;
        const client = this.clients.get(clientId);

        if (!client) {
            console.error(`❌ Client not found: ${clientId}`);
            return;
        }

        console.log(`📨 Message from ${clientId}: ${type}`);

        switch (type) {
            case 'auth':
                this.handleAuth(clientId, data);
                break;

            case 'join_room':
                this.handleJoinRoom(clientId, data);
                break;

            case 'leave_room':
                this.handleLeaveRoom(clientId, data);
                break;

            case 'collaboration_update':
                this.handleCollaborationUpdate(clientId, data);
                break;

            case 'comment':
                this.handleComment(clientId, data);
                break;

            case 'typing':
                this.handleTyping(clientId, data);
                break;

            case 'cursor_position':
                this.handleCursorPosition(clientId, data);
                break;

            case 'question_update':
                this.handleQuestionUpdate(clientId, data);
                break;

            case 'ping':
                this.handlePing(clientId, data);
                break;

            default:
                console.warn(`⚠️ Unknown message type: ${type}`);
                this.sendError(clientId, `Unknown message type: ${type}`);
        }
    }

    handleAuth(clientId, data) {
        const { userId, userName, userRole } = data;
        const client = this.clients.get(clientId);

        if (!client) return;

        // Update client info
        client.userId = userId;
        client.userName = userName;
        client.userRole = userRole;

        // Track user sessions
        if (!this.userSessions.has(userId)) {
            this.userSessions.set(userId, new Set());
        }
        this.userSessions.get(userId).add(clientId);

        console.log(`🔐 User authenticated: ${userName} (${userId})`);

        // Send authentication confirmation
        this.sendToClient(clientId, {
            type: 'auth_success',
            data: {
                userId,
                userName,
                userRole,
                timestamp: new Date().toISOString()
            }
        });

        // Notify about online status
        this.broadcastUserStatus(userId, 'online');
    }

    handleJoinRoom(clientId, data) {
        const { roomId, roomType } = data;
        const client = this.clients.get(clientId);

        if (!client) return;

        // Add to room
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(clientId);
        client.rooms.add(roomId);

        console.log(`🏠 Client ${clientId} joined room: ${roomId}`);

        // Send join confirmation
        this.sendToClient(clientId, {
            type: 'room_joined',
            data: {
                roomId,
                roomType,
                participants: Array.from(this.rooms.get(roomId)).map(cId => {
                    const c = this.clients.get(cId);
                    return {
                        clientId: cId,
                        userId: c?.userId,
                        userName: c?.userName,
                        userRole: c?.userRole
                    };
                }),
                timestamp: new Date().toISOString()
            }
        });

        // Notify room about new participant
        this.broadcastToRoom(roomId, {
            type: 'participant_joined',
            data: {
                clientId,
                userId: client.userId,
                userName: client.userName,
                userRole: client.userRole,
                timestamp: new Date().toISOString()
            }
        }, clientId);
    }

    handleLeaveRoom(clientId, data) {
        const { roomId } = data;
        const client = this.clients.get(clientId);

        if (!client) return;

        this.removeFromRoom(clientId, roomId);
    }

    handleCollaborationUpdate(clientId, data) {
        const { roomId, updateType, questionId, changes } = data;
        const client = this.clients.get(clientId);

        if (!client || !client.rooms.has(roomId)) {
            this.sendError(clientId, 'Not in specified room');
            return;
        }

        console.log(`🔄 Collaboration update in ${roomId}: ${updateType}`);

        // Broadcast update to room participants
        this.broadcastToRoom(roomId, {
            type: 'collaboration_update',
            data: {
                updateType,
                questionId,
                changes,
                author: {
                    clientId,
                    userId: client.userId,
                    userName: client.userName
                },
                timestamp: new Date().toISOString()
            }
        }, clientId);
    }

    handleComment(clientId, data) {
        const { roomId, questionId, content, parentId } = data;
        const client = this.clients.get(clientId);

        if (!client || !client.rooms.has(roomId)) {
            this.sendError(clientId, 'Not in specified room');
            return;
        }

        const comment = {
            id: uuidv4(),
            questionId,
            content,
            parentId: parentId || null,
            author: {
                clientId,
                userId: client.userId,
                userName: client.userName,
                userRole: client.userRole
            },
            timestamp: new Date().toISOString()
        };

        console.log(`💬 New comment in ${roomId}: ${content.substring(0, 50)}...`);

        // Broadcast comment to room
        this.broadcastToRoom(roomId, {
            type: 'new_comment',
            data: comment
        });
    }

    handleTyping(clientId, data) {
        const { roomId, isTyping, questionId } = data;
        const client = this.clients.get(clientId);

        if (!client || !client.rooms.has(roomId)) return;

        // Broadcast typing indicator to room
        this.broadcastToRoom(roomId, {
            type: 'typing_indicator',
            data: {
                userId: client.userId,
                userName: client.userName,
                isTyping,
                questionId,
                timestamp: new Date().toISOString()
            }
        }, clientId);
    }

    handleCursorPosition(clientId, data) {
        const { roomId, questionId, position, selection } = data;
        const client = this.clients.get(clientId);

        if (!client || !client.rooms.has(roomId)) return;

        // Broadcast cursor position to room
        this.broadcastToRoom(roomId, {
            type: 'cursor_position',
            data: {
                userId: client.userId,
                userName: client.userName,
                questionId,
                position,
                selection,
                timestamp: new Date().toISOString()
            }
        }, clientId);
    }

    handleQuestionUpdate(clientId, data) {
        const { roomId, questionId, field, value, operation } = data;
        const client = this.clients.get(clientId);

        if (!client || !client.rooms.has(roomId)) {
            this.sendError(clientId, 'Not in specified room');
            return;
        }

        console.log(`📝 Question update in ${roomId}: ${field} = ${value}`);

        // Broadcast question update to room
        this.broadcastToRoom(roomId, {
            type: 'question_updated',
            data: {
                questionId,
                field,
                value,
                operation,
                author: {
                    clientId,
                    userId: client.userId,
                    userName: client.userName
                },
                timestamp: new Date().toISOString()
            }
        }, clientId);
    }

    handlePing(clientId, data) {
        this.sendToClient(clientId, {
            type: 'pong',
            data: {
                timestamp: new Date().toISOString(),
                received: data?.timestamp
            }
        });
    }

    handleDisconnect(clientId) {
        const client = this.clients.get(clientId);
        if (!client) return;

        console.log(`👋 Client disconnected: ${clientId}`);

        // Remove from all rooms
        client.rooms.forEach(roomId => {
            this.removeFromRoom(clientId, roomId);
        });

        // Remove from user sessions
        if (client.userId && this.userSessions.has(client.userId)) {
            const userClients = this.userSessions.get(client.userId);
            userClients.delete(clientId);
            
            // If user has no more active connections, mark as offline
            if (userClients.size === 0) {
                this.userSessions.delete(client.userId);
                this.broadcastUserStatus(client.userId, 'offline');
            }
        }

        // Remove client
        this.clients.delete(clientId);
    }

    removeFromRoom(clientId, roomId) {
        const client = this.clients.get(clientId);
        if (!client) return;

        if (this.rooms.has(roomId)) {
            this.rooms.get(roomId).delete(clientId);
            
            // Clean up empty rooms
            if (this.rooms.get(roomId).size === 0) {
                this.rooms.delete(roomId);
            }
        }

        client.rooms.delete(roomId);

        console.log(`🚪 Client ${clientId} left room: ${roomId}`);

        // Notify room about participant leaving
        this.broadcastToRoom(roomId, {
            type: 'participant_left',
            data: {
                clientId,
                userId: client.userId,
                userName: client.userName,
                timestamp: new Date().toISOString()
            }
        });
    }

    sendToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === 1) { // WebSocket.OPEN
            try {
                client.ws.send(JSON.stringify(message));
            } catch (error) {
                console.error(`❌ Failed to send message to ${clientId}:`, error);
                this.handleDisconnect(clientId);
            }
        }
    }

    sendError(clientId, error) {
        this.sendToClient(clientId, {
            type: 'error',
            data: {
                error,
                timestamp: new Date().toISOString()
            }
        });
    }

    broadcastToRoom(roomId, message, excludeClientId = null) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        room.forEach(clientId => {
            if (clientId !== excludeClientId) {
                this.sendToClient(clientId, message);
            }
        });
    }

    broadcastUserStatus(userId, status) {
        // Broadcast to all relevant rooms where this user participates
        this.clients.forEach((client, clientId) => {
            if (client.userId && client.userId !== userId) {
                this.sendToClient(clientId, {
                    type: 'user_status_change',
                    data: {
                        userId,
                        status,
                        timestamp: new Date().toISOString()
                    }
                });
            }
        });
    }

    // Public methods for external use
    getStats() {
        return {
            connectedClients: this.clients.size,
            activeRooms: this.rooms.size,
            uniqueUsers: this.userSessions.size,
            timestamp: new Date().toISOString()
        };
    }

    getRoomInfo(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        return {
            roomId,
            participantCount: room.size,
            participants: Array.from(room).map(clientId => {
                const client = this.clients.get(clientId);
                return {
                    clientId,
                    userId: client?.userId,
                    userName: client?.userName,
                    userRole: client?.userRole,
                    connectedAt: client?.metadata.connectedAt
                };
            })
        };
    }

    getUserSessions(userId) {
        const sessions = this.userSessions.get(userId);
        if (!sessions) return [];

        return Array.from(sessions).map(clientId => {
            const client = this.clients.get(clientId);
            return {
                clientId,
                connectedAt: client?.metadata.connectedAt,
                rooms: Array.from(client?.rooms || [])
            };
        });
    }
}