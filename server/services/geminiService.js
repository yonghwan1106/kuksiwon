/**
 * Gemini AI Service - Enhanced Question Generation
 * Specialized for Korean Medical Examination Questions
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
        
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY is required');
        }
        
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: this.modelName });
        
        // Medical specialties mapping
        this.specialties = {
            'internal_medicine': '내과학',
            'surgery': '외과학', 
            'nursing': '간호학',
            'pharmacy': '약학',
            'dentistry': '치의학',
            'korean_medicine': '한의학',
            'pediatrics': '소아과학',
            'obstetrics': '산부인과학',
            'psychiatry': '정신과학',
            'radiology': '영상의학과'
        };
        
        // Question types
        this.questionTypes = {
            'multiple_choice': '객관식 5지선다',
            'scenario_based': '상황형 문제',
            'case_study': '증례 기반',
            'image_based': '이미지 기반',
            'calculation': '계산 문제'
        };
    }

    /**
     * Generate medical exam question using Gemini AI
     */
    async generateQuestion(params) {
        try {
            const {
                specialty = 'nursing',
                difficulty = 'medium',
                questionType = 'multiple_choice',
                topic = '',
                keywords = [],
                learningObjectives = [],
                language = 'korean'
            } = params;

            const prompt = this._buildPrompt({
                specialty,
                difficulty,
                questionType,
                topic,
                keywords,
                learningObjectives,
                language
            });

            console.log('🧠 Generating question with Gemini AI...');
            console.log('📝 Specialty:', this.specialties[specialty] || specialty);
            console.log('🎯 Topic:', topic);
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Parse and validate the response
            const questionData = this._parseResponse(text);
            
            // Add metadata
            questionData.metadata = {
                aiModel: this.modelName,
                specialty: specialty,
                difficulty: difficulty,
                questionType: questionType,
                generatedAt: new Date().toISOString(),
                language: language,
                topic: topic,
                keywords: keywords,
                learningObjectives: learningObjectives
            };
            
            // Quality validation
            const qualityScore = await this._validateQuality(questionData);
            questionData.qualityScore = qualityScore;
            
            console.log('✅ Question generated successfully');
            console.log('📊 Quality Score:', qualityScore.overall);
            
            return questionData;
            
        } catch (error) {
            console.error('❌ Error generating question:', error);
            throw new Error(`Question generation failed: ${error.message}`);
        }
    }

    /**
     * Generate multiple questions in batch
     */
    async generateBatch(params) {
        try {
            const { count = 5, ...questionParams } = params;
            
            console.log(`🔄 Generating batch of ${count} questions...`);
            
            const questions = [];
            const errors = [];
            
            for (let i = 0; i < count; i++) {
                try {
                    console.log(`📝 Generating question ${i + 1}/${count}...`);
                    const question = await this.generateQuestion(questionParams);
                    questions.push(question);
                    
                    // Small delay to respect rate limits
                    if (i < count - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error(`❌ Error generating question ${i + 1}:`, error.message);
                    errors.push({ index: i + 1, error: error.message });
                }
            }
            
            console.log(`✅ Batch generation complete: ${questions.length} successful, ${errors.length} failed`);
            
            return {
                questions,
                errors,
                summary: {
                    total: count,
                    successful: questions.length,
                    failed: errors.length
                }
            };
            
        } catch (error) {
            console.error('❌ Batch generation error:', error);
            throw new Error(`Batch generation failed: ${error.message}`);
        }
    }

    /**
     * Enhance existing question using AI
     */
    async enhanceQuestion(questionData, enhancements = []) {
        try {
            const prompt = this._buildEnhancementPrompt(questionData, enhancements);
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            const enhancedQuestion = this._parseResponse(text);
            
            // Preserve original metadata and add enhancement info
            enhancedQuestion.metadata = {
                ...questionData.metadata,
                enhanced: true,
                enhancedAt: new Date().toISOString(),
                enhancements: enhancements
            };
            
            return enhancedQuestion;
            
        } catch (error) {
            console.error('❌ Error enhancing question:', error);
            throw new Error(`Question enhancement failed: ${error.message}`);
        }
    }

    /**
     * Build AI prompt for question generation
     */
    _buildPrompt(params) {
        const {
            specialty,
            difficulty,
            questionType,
            topic,
            keywords,
            learningObjectives,
            language
        } = params;

        const difficultyMap = {
            'easy': '하급 (기초적인 내용)',
            'medium': '중급 (임상 적용)',
            'hard': '상급 (복합적 사고)'
        };

        return `
당신은 한국보건의료인국가시험원의 전문 출제위원입니다. 
의료진 국가시험 문제를 출제하는 전문가로서, 다음 조건에 맞는 고품질 문제를 생성해주세요.

## 출제 조건
- **전문 분야**: ${this.specialties[specialty] || specialty}
- **난이도**: ${difficultyMap[difficulty] || difficulty}
- **문제 유형**: ${this.questionTypes[questionType] || questionType}
- **주제**: ${topic}
${keywords.length > 0 ? `- **핵심 키워드**: ${keywords.join(', ')}` : ''}
${learningObjectives.length > 0 ? `- **학습 목표**: ${learningObjectives.join(', ')}` : ''}

## 출제 기준
1. **의학적 정확성**: 최신 임상 가이드라인과 의학 지식 반영
2. **실무 연관성**: 실제 임상 상황과 연결되는 문제
3. **적절한 난이도**: 해당 수준의 의료진이 알아야 할 내용
4. **명확한 언어**: 전문용어 사용 시 정확한 한국어 표현
5. **논리적 구성**: 정답과 오답의 명확한 구분

## 응답 형식 (JSON)
다음 JSON 형식으로 정확히 응답해주세요:

\`\`\`json
{
  "title": "문제 제목 (간단명료)",
  "content": "문제 본문 (상황 제시, 질문 포함)",
  "choices": [
    {
      "id": 1,
      "text": "선택지 1",
      "isCorrect": false,
      "explanation": "이 선택지가 틀린 이유"
    },
    {
      "id": 2, 
      "text": "선택지 2",
      "isCorrect": true,
      "explanation": "이 선택지가 정답인 이유"
    },
    {
      "id": 3,
      "text": "선택지 3", 
      "isCorrect": false,
      "explanation": "이 선택지가 틀린 이유"
    },
    {
      "id": 4,
      "text": "선택지 4",
      "isCorrect": false,
      "explanation": "이 선택지가 틀린 이유"
    },
    {
      "id": 5,
      "text": "선택지 5",
      "isCorrect": false,
      "explanation": "이 선택지가 틀린 이유"
    }
  ],
  "overallExplanation": "문제 전체에 대한 상세 해설 (의학적 근거 포함)",
  "references": ["참고문헌 1", "참고문헌 2"],
  "clinicalPearls": ["임상적 팁 1", "임상적 팁 2"],
  "relatedTopics": ["연관 주제 1", "연관 주제 2"],
  "estimatedDifficulty": 0.7,
  "estimatedAnswerTime": "2-3분",
  "bloomTaxonomy": "분석" 
}
\`\`\`

**중요**: 반드시 완전한 JSON 형식으로만 응답하고, 추가 설명이나 다른 텍스트는 포함하지 마세요.
        의학적으로 정확하고 실제 시험에 출제 가능한 수준의 문제를 만들어주세요.`;
    }

    /**
     * Build enhancement prompt for existing questions
     */
    _buildEnhancementPrompt(questionData, enhancements) {
        return `
기존 의료시험 문제를 다음과 같이 개선해주세요:

## 기존 문제
${JSON.stringify(questionData, null, 2)}

## 개선 요청사항
${enhancements.map(e => `- ${e}`).join('\n')}

## 개선 후 JSON 형식으로 응답
완전한 JSON 형식으로 개선된 문제를 제공해주세요. 기존 구조를 유지하되 요청된 부분만 개선하세요.
        `;
    }

    /**
     * Parse AI response and extract question data
     */
    _parseResponse(text) {
        try {
            // Extract JSON from response
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const questionData = JSON.parse(jsonStr);
            
            // Validate required fields
            this._validateQuestionData(questionData);
            
            return questionData;
            
        } catch (error) {
            console.error('❌ Failed to parse AI response:', error);
            console.error('📄 Raw response:', text.substring(0, 500) + '...');
            throw new Error(`Failed to parse question data: ${error.message}`);
        }
    }

    /**
     * Validate question data structure
     */
    _validateQuestionData(data) {
        const required = ['title', 'content', 'choices'];
        
        for (const field of required) {
            if (!data[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        if (!Array.isArray(data.choices) || data.choices.length !== 5) {
            throw new Error('Must have exactly 5 choices');
        }
        
        const correctAnswers = data.choices.filter(choice => choice.isCorrect);
        if (correctAnswers.length !== 1) {
            throw new Error('Must have exactly one correct answer');
        }
        
        return true;
    }

    /**
     * Validate question quality using AI
     */
    async _validateQuality(questionData) {
        try {
            const validationPrompt = `
다음 의료시험 문제의 품질을 평가해주세요:

${JSON.stringify(questionData, null, 2)}

다음 기준으로 0.0-1.0 점수를 매기고 JSON으로 응답하세요:

\`\`\`json
{
  "medicalAccuracy": 0.95,
  "languageQuality": 0.90, 
  "difficultyAppropriate": 0.85,
  "uniqueness": 0.92,
  "clinicalRelevance": 0.88,
  "overall": 0.90,
  "feedback": ["개선점 1", "개선점 2"],
  "strengths": ["장점 1", "장점 2"]
}
\`\`\`
            `;

            const result = await this.model.generateContent(validationPrompt);
            const response = await result.response;
            const text = response.text();
            
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                const qualityData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
                return qualityData;
            }
            
            // Fallback quality score
            return {
                overall: 0.85,
                medicalAccuracy: 0.85,
                languageQuality: 0.85,
                feedback: ['AI validation not available'],
                strengths: ['Generated successfully']
            };
            
        } catch (error) {
            console.warn('⚠️ Quality validation failed:', error.message);
            return {
                overall: 0.80,
                medicalAccuracy: 0.80,
                languageQuality: 0.80,
                feedback: ['Validation error occurred'],
                strengths: ['Basic generation successful']
            };
        }
    }

    /**
     * Get available specialties
     */
    getSpecialties() {
        return this.specialties;
    }

    /**
     * Get available question types
     */
    getQuestionTypes() {
        return this.questionTypes;
    }

    /**
     * Check API health
     */
    async checkHealth() {
        try {
            const testPrompt = "Hello, please respond with 'OK' to confirm the API is working.";
            const result = await this.model.generateContent(testPrompt);
            const response = await result.response;
            return {
                status: 'healthy',
                model: this.modelName,
                response: response.text().substring(0, 100)
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
}

export default GeminiService;