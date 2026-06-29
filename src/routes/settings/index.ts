import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';
import logger from '../../utils/logger.js';

export function createSettingsRouter(evolutionAPI: EvolutionAPI): Router {
  const router = Router();

  // General Settings
  router.get('/:instanceName', async (req, res) => {
    try {
      const result = await evolutionAPI.getSettings(req.params.instanceName);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error getting settings', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  router.put('/:instanceName', async (req, res) => {
    try {
      const result = await evolutionAPI.updateSettings(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating settings', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Privacy Settings
  router.put('/:instanceName/privacy', async (req, res) => {
    try {
      const result = await evolutionAPI.setPrivacySettings(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error setting privacy settings', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Profile Settings
  router.post('/:instanceName/profile/name', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Missing name field' });
      }
      const result = await evolutionAPI.updateProfileName(req.params.instanceName, name);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating profile name', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/profile/picture', async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Missing image field' });
      }
      const result = await evolutionAPI.updateProfilePicture(req.params.instanceName, image);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating profile picture', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/profile/status', async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Missing status field' });
      }
      const result = await evolutionAPI.updateProfileStatus(req.params.instanceName, status);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating profile status', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
