import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';
import logger from '../../utils/logger.js';

export function createTemplateRouter(evolutionAPI: EvolutionAPI): Router {
  const router = Router();

  // Get All Templates
  router.get('/:instanceName', async (req, res) => {
    try {
      const result = await evolutionAPI.getTemplates(req.params.instanceName);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error getting templates', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Create Template
  router.post('/:instanceName', async (req, res) => {
    try {
      const result = await evolutionAPI.createTemplate(req.params.instanceName, req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      logger.error('❌ Error creating template', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Update Template
  router.put('/:instanceName/:templateId', async (req, res) => {
    try {
      const result = await evolutionAPI.updateTemplate(req.params.instanceName, req.params.templateId, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating template', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Delete Template
  router.delete('/:instanceName/:templateId', async (req, res) => {
    try {
      const result = await evolutionAPI.deleteTemplate(req.params.instanceName, req.params.templateId);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error deleting template', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Send Template Message
  router.post('/:instanceName/send', async (req, res) => {
    try {
      const result = await evolutionAPI.sendTemplate(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error sending template message', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
