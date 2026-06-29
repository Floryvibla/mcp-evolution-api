import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';

export function createChatRouter(evolutionAPI: EvolutionAPI): Router {
  const router = Router();

  router.get('/:instanceName/contacts', async (req, res) => {
    try {
      const contacts = await evolutionAPI.findContacts(req.params.instanceName);
      return res.json(contacts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get('/:instanceName/chats', async (req, res) => {
    try {
      const chats = await evolutionAPI.findChats(req.params.instanceName);
      return res.json(chats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get('/:instanceName/messages', async (req, res) => {
    try {
      const { remoteJid, limit } = req.query;
      if (!remoteJid) {
        return res.status(400).json({ error: 'Missing remoteJid query parameter' });
      }
      const messages = await evolutionAPI.findMessages(
        req.params.instanceName,
        remoteJid as string,
        limit ? parseInt(limit as string) : 20,
      );
      return res.json(messages);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get('/:instanceName/status-messages', async (req, res) => {
    try {
      const { remoteJid, limit } = req.query;
      const messages = await evolutionAPI.findStatusMessage(
        req.params.instanceName,
        remoteJid as string,
        limit ? parseInt(limit as string) : 20,
      );
      return res.json(messages);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/check-numbers', async (req, res) => {
    try {
      const { instanceName, numbers } = req.body;
      if (!instanceName || !numbers || !Array.isArray(numbers)) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, numbers (array)',
        });
      }
      const cleanNumbers = numbers.map((n) => n.replace(/[\s\-\+\(\)]/g, ''));
      const result = await evolutionAPI.checkNumberStatus(instanceName, cleanNumbers);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/read', async (req, res) => {
    try {
      const { remoteJid, fromMe, id } = req.body;
      const result = await evolutionAPI.readMessage(req.params.instanceName, { remoteJid, fromMe, id });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/archive', async (req, res) => {
    try {
      const { remoteJid, archive } = req.body;
      const result = await evolutionAPI.archiveChat(req.params.instanceName, { remoteJid, archive });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:instanceName/message', async (req, res) => {
    try {
      const { remoteJid, fromMe, id } = req.body;
      const result = await evolutionAPI.deleteMessage(req.params.instanceName, { remoteJid, fromMe, id });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get('/:instanceName/profile-picture', async (req, res) => {
    try {
      const { number } = req.query;
      if (!number) {
        return res.status(400).json({ error: 'Missing number query parameter' });
      }
      const result = await evolutionAPI.getProfilePicture(req.params.instanceName, number as string);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get('/:instanceName/business-profile', async (req, res) => {
    try {
      const { number } = req.query;
      if (!number) {
        return res.status(400).json({ error: 'Missing number query parameter' });
      }
      const result = await evolutionAPI.getBusinessProfile(req.params.instanceName, number as string);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/base64', async (req, res) => {
    try {
      const { message } = req.body;
      const result = await evolutionAPI.getBase64FromMediaMessage(req.params.instanceName, message);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
