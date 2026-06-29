import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';
import logger from '../../utils/logger.js';

export function createCallRouter(evolutionAPI: EvolutionAPI): Router {
  const router = Router();

  // Get Call History
  router.get('/:instanceName/history', async (req, res) => {
    try {
      const result = await evolutionAPI.getCallHistory(req.params.instanceName);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error getting call history', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Make Voice Call
  router.post('/:instanceName/voice', async (req, res) => {
    try {
      const result = await evolutionAPI.makeVoiceCall(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error making voice call', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Make Video Call
  router.post('/:instanceName/video', async (req, res) => {
    try {
      const result = await evolutionAPI.makeVideoCall(req.params.instanceName, req.body);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error making video call', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // Accept Call
  router.post('/:instanceName/accept', async (req, res) => {
    try {
      const { callId } = req.body;
      if (!callId) {
        return res.status(400).json({ error: 'Missing callId field' });
      }
      const result = await evolutionAPI.acceptCall(req.params.instanceName, callId);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error accepting call', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  // End Call
  router.post('/:instanceName/end', async (req, res) => {
    try {
      const { callId } = req.body;
      if (!callId) {
        return res.status(400).json({ error: 'Missing callId field' });
      }
      const result = await evolutionAPI.endCall(req.params.instanceName, callId);
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error ending call', { error });
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
