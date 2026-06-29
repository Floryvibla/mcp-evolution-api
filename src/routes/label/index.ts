import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';
import logger from '../../utils/logger.js';

export function createLabelRouter(evolutionAPI: EvolutionAPI): Router {
  const router = Router();

  // Get All Labels
  router.get('/:instanceName', async (req, res) => {
    try {
      const result = await evolutionAPI.getLabels(req.params.instanceName);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error getting labels', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Create Label
  router.post('/:instanceName', async (req, res) => {
    try {
      const result = await evolutionAPI.createLabel(req.params.instanceName, req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      logger.error('❌ Error creating label', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Update Label
  router.put('/:instanceName/:labelId', async (req, res) => {
    try {
      const result = await evolutionAPI.updateLabel(req.params.instanceName, req.params.labelId, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating label', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Delete Label
  router.delete('/:instanceName/:labelId', async (req, res) => {
    try {
      const result = await evolutionAPI.deleteLabel(req.params.instanceName, req.params.labelId);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error deleting label', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Add Label to Chat
  router.post('/:instanceName/add-to-chat', async (req, res) => {
    try {
      const result = await evolutionAPI.addLabelToChat(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error adding label to chat', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Remove Label from Chat
  router.delete('/:instanceName/remove-from-chat', async (req, res) => {
    try {
      const result = await evolutionAPI.removeLabelFromChat(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error removing label from chat', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
