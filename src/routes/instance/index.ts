import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';
import { InstanceManager } from '../../services/instance-manager.js';
import logger from '../../utils/logger.js';

export function createInstanceRouter(evolutionAPI: EvolutionAPI, instanceManager: InstanceManager): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    logger.info('📋 Getting instances list');
    try {
      const managedInstances = instanceManager.getAllInstances();
      const stats = instanceManager.getInstanceStats();
      return res.json({ instances: managedInstances, stats });
    } catch (error) {
      logger.error('❌ Failed to get instances', { error });
      return res.status(500).json({ error: 'Failed to fetch instances' });
    }
  });

  router.get('/:instanceName', async (req, res) => {
    const { instanceName } = req.params;
    logger.info('📱 Getting instance details', { instanceName });
    try {
      const instance = instanceManager.getInstance(instanceName);
      if (!instance) {
        return res.status(404).json({ error: 'Instance not found' });
      }
      return res.json(instance);
    } catch (error) {
      logger.error('❌ Failed to get instance', { instanceName, error });
      return res.status(500).json({ error: 'Failed to fetch instance' });
    }
  });

  router.post('/', async (req, res) => {
    const { instanceName, webhookUrl } = req.body;
    if (!instanceName) {
      return res.status(400).json({ error: 'Instance name is required' });
    }
    try {
      const instance = await instanceManager.createInstance(instanceName, webhookUrl);
      return res.status(201).json(instance);
    } catch (error) {
      logger.error('❌ Failed to create instance', { instanceName, error });
      return res.status(500).json({ error: 'Failed to create instance' });
    }
  });

  router.post('/:instanceName/connect', async (req, res) => {
    const { instanceName } = req.params;
    try {
      await instanceManager.connectInstance(instanceName);
      return res.json({ message: 'Connection initiated', instanceName });
    } catch (error) {
      logger.error('❌ Failed to connect instance', { instanceName, error });
      return res.status(500).json({ error: 'Failed to connect instance' });
    }
  });

  router.post('/:instanceName/disconnect', async (req, res) => {
    const { instanceName } = req.params;
    try {
      await instanceManager.disconnectInstance(instanceName);
      return res.json({ message: 'Instance disconnected', instanceName });
    } catch (error) {
      logger.error('❌ Failed to disconnect instance', { instanceName, error });
      return res.status(500).json({ error: 'Failed to disconnect instance' });
    }
  });

  router.delete('/:instanceName', async (req, res) => {
    const { instanceName } = req.params;
    try {
      await instanceManager.deleteInstance(instanceName);
      return res.json({ message: 'Instance deleted', instanceName });
    } catch (error) {
      logger.error('❌ Failed to delete instance', { instanceName, error });
      return res.status(500).json({ error: 'Failed to delete instance' });
    }
  });

  router.post('/:instanceName/refresh', async (req, res) => {
    const { instanceName } = req.params;
    try {
      await instanceManager.refreshInstanceStatus(instanceName);
      const instance = instanceManager.getInstance(instanceName);
      return res.json(instance);
    } catch (error) {
      logger.error('❌ Failed to refresh instance status', { instanceName, error });
      return res.status(500).json({ error: 'Failed to refresh instance status' });
    }
  });

  router.post('/:instanceName/auto-reply', async (req, res) => {
    const { instanceName } = req.params;
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled field must be a boolean' });
    }
    try {
      instanceManager.setAutoReply(instanceName, enabled);
      const instance = instanceManager.getInstance(instanceName);
      return res.json(instance);
    } catch (error) {
      logger.error('❌ Failed to set auto-reply', { instanceName, error });
      return res.status(500).json({ error: 'Failed to set auto-reply' });
    }
  });

  router.get('/:instanceName/status', async (req, res) => {
    try {
      const status = await evolutionAPI.getConnectionStatus(req.params.instanceName);
      return res.json(status);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/restart', async (req, res) => {
    try {
      const result = await evolutionAPI.restartInstance(req.params.instanceName);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/logout', async (req, res) => {
    try {
      const result = await evolutionAPI.logoutInstance(req.params.instanceName);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/presence', async (req, res) => {
    try {
      const { presence } = req.body;
      const result = await evolutionAPI.setPresence(req.params.instanceName, presence);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
