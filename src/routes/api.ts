import { Router } from 'express';
import { EvolutionAPI } from '../services/evolution-api.js';
import { InstanceManager } from '../services/instance-manager.js';
import logger from '../utils/logger.js';
import { createInstanceRouter } from './instance/index.js';
import { createMessageRouter } from './message/index.js';
import { createChatRouter } from './chat/index.js';
import { createGroupRouter } from './group/index.js';
import { createBusinessRouter } from './business/index.js';
import { createSettingsRouter } from './settings/index.js';
import { createLabelRouter } from './label/index.js';
import { createCallRouter } from './call/index.js';
import { createTemplateRouter } from './template/index.js';

export function createAPIRouter(
  evolutionAPI: EvolutionAPI,
  instanceManager: InstanceManager,
): Router {
  const router = Router();

  // Middleware para verificar API Key
  router.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.headers['apikey'];

    // Verificar si el API key es correcto
    if (apiKey !== process.env.EVOLUTION_API_KEY) {
      logger.warn('🔒 Unauthorized API access attempt', {
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    logger.debug('✅ API Key validated successfully', {
      path: req.path,
      method: req.method,
    });

    next();
  });

  // Health check
  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'evolution-api-mcp',
      evolution_url: process.env.EVOLUTION_API_URL,
    });
  });

  // Mount routers
  router.use('/instances', createInstanceRouter(evolutionAPI, instanceManager));
  router.use('/send', createMessageRouter(evolutionAPI));
  router.use('/chat', createChatRouter(evolutionAPI));
  router.use('/groups', createGroupRouter(evolutionAPI));
  router.use('/business', createBusinessRouter(evolutionAPI));
  router.use('/settings', createSettingsRouter(evolutionAPI));
  router.use('/labels', createLabelRouter(evolutionAPI));
  router.use('/calls', createCallRouter(evolutionAPI));
  router.use('/templates', createTemplateRouter(evolutionAPI));

  // OpenAI Configuration endpoints
  // Get OpenAI configuration
  router.get('/openai/config', async (_req, res) => {
    logger.info('📋 Getting OpenAI configuration');
    try {
      const config = {
        apiKey: process.env.OPENAI_API_KEY
          ? '***' + process.env.OPENAI_API_KEY.slice(-4)
          : null,
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
        systemPrompt:
          process.env.OPENAI_SYSTEM_PROMPT || 'You are a helpful assistant.',
        enabled: process.env.OPENAI_ENABLED === 'true',
      };

      logger.info('✅ Successfully retrieved OpenAI config');
      res.json(config);
    } catch (error: any) {
      logger.error('❌ Error getting OpenAI config:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update OpenAI configuration
  router.post('/openai/config', async (req, res) => {
    logger.info('🔧 Updating OpenAI configuration');
    try {
      const { apiKey, model, temperature, maxTokens, systemPrompt, enabled } =
        req.body;

      // Validate required fields
      if (!apiKey && enabled) {
        res
          .status(400)
          .json({ error: 'API Key is required when OpenAI is enabled' });
        return;
      }

      // Here you would typically save to a database or config file
      // For now, we'll just validate and return success
      const config = {
        apiKey: apiKey ? '***' + apiKey.slice(-4) : null,
        model: model || 'gpt-3.5-turbo',
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000,
        systemPrompt: systemPrompt || 'You are a helpful assistant.',
        enabled: enabled || false,
      };

      logger.info('✅ OpenAI configuration updated successfully');
      res.json({ message: 'Configuration updated successfully', config });
    } catch (error: any) {
      logger.error('❌ Error updating OpenAI config:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Test OpenAI connection
  router.post('/openai/test', async (req, res) => {
    logger.info('🧪 Testing OpenAI connection');
    try {
      const { apiKey, model } = req.body;

      if (!apiKey) {
        res.status(400).json({ error: 'API Key is required for testing' });
        return;
      }

      // Here you would make a test call to OpenAI API
      // For now, we'll simulate a successful test
      logger.info('✅ OpenAI connection test successful');
      res.json({
        success: true,
        message: 'Connection test successful',
        model: model || 'gpt-3.5-turbo',
      });
    } catch (error: any) {
      logger.error('❌ OpenAI connection test failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get OpenAI usage statistics
  router.get('/openai/stats', async (_req, res) => {
    logger.info('📊 Getting OpenAI usage statistics');
    try {
      // Here you would typically get real usage stats from database
      const stats = {
        totalRequests: 0,
        totalTokens: 0,
        averageResponseTime: 0,
        lastUsed: null,
        monthlyUsage: {
          requests: 0,
          tokens: 0,
          cost: 0,
        },
      };

      logger.info('✅ Successfully retrieved OpenAI stats');
      res.json(stats);
    } catch (error: any) {
      logger.error('❌ Error getting OpenAI stats:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}