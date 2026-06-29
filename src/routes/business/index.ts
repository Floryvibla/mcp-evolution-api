import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';
import logger from '../../utils/logger.js';

export function createBusinessRouter(evolutionAPI: EvolutionAPI): Router {
  const router = Router();

  // Business Profile
  router.get('/:instanceName/profile', async (req, res) => {
    try {
      const { number } = req.query;
      if (!number) {
        return res.status(400).json({ error: 'Missing number query param' });
      }
      const result = await evolutionAPI.getBusinessProfile(req.params.instanceName, number as string);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error getting business profile', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  router.put('/:instanceName/profile', async (req, res) => {
    try {
      const result = await evolutionAPI.updateBusinessProfile(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating business profile', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Business Hours
  router.get('/:instanceName/hours', async (req, res) => {
    try {
      const result = await evolutionAPI.getBusinessHours(req.params.instanceName);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error getting business hours', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  router.put('/:instanceName/hours', async (req, res) => {
    try {
      const result = await evolutionAPI.updateBusinessHours(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating business hours', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Business Catalog
  router.get('/:instanceName/catalog', async (req, res) => {
    try {
      const result = await evolutionAPI.getBusinessCatalog(req.params.instanceName);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error getting business catalog', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/catalog', async (req, res) => {
    try {
      const result = await evolutionAPI.createBusinessCatalogProduct(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error creating catalog product', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  router.put('/:instanceName/catalog/:productId', async (req, res) => {
    try {
      const result = await evolutionAPI.updateBusinessCatalogProduct(req.params.instanceName, req.params.productId, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error updating catalog product', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:instanceName/catalog/:productId', async (req, res) => {
    try {
      const result = await evolutionAPI.deleteBusinessCatalogProduct(req.params.instanceName, req.params.productId);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error deleting catalog product', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
