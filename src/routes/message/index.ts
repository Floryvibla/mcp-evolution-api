import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';
import logger from '../../utils/logger.js';

export function createMessageRouter(evolutionAPI: EvolutionAPI): Router {
  const router = Router();

  router.post('/text', async (req, res) => {
    try {
      const { instanceName, number, text, delay, linkPreview } = req.body;
      if (!instanceName || !number || !text) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, number, text',
        });
      }
      const cleanNumber = number.replace(/[\s\-\+\(\)]/g, '');
      const result = await evolutionAPI.sendText(instanceName, {
        number: cleanNumber,
        text,
        delay,
        linkPreview,
      });
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error sending text message', { error });
      return res.status(500).json({
        error: error.message,
        details: error.response?.data || null,
      });
    }
  });

  router.post('/media', async (req, res) => {
    try {
      const { instanceName, number, mediatype, media, caption, fileName, mimetype } = req.body;
      if (!instanceName || !number || !mediatype || !media) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, number, mediatype, media',
        });
      }
      const cleanNumber = number.replace(/[\s\-\+\(\)]/g, '');
      const result = await evolutionAPI.sendMedia(instanceName, {
        number: cleanNumber,
        mediatype,
        mimetype,
        media,
        caption,
        fileName,
      });
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error sending media message', { error });
      return res.status(500).json({
        error: error.message,
        details: error.response?.data || null,
      });
    }
  });

  router.post('/buttons', async (req, res) => {
    try {
      const { instanceName, number, title, description, footer, buttons } = req.body;
      if (!instanceName || !number || !buttons) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, number, buttons',
        });
      }
      const cleanNumber = number.replace(/[\s\-\+\(\)]/g, '');
      const result = await evolutionAPI.sendButtons(instanceName, {
        number: cleanNumber,
        title,
        description,
        footer,
        buttons,
      });
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error sending buttons message', { error });
      return res.status(500).json({
        error: error.message,
        details: error.response?.data || null,
      });
    }
  });

  router.post('/list', async (req, res) => {
    try {
      const { instanceName, number, title, description, buttonText, footerText, sections } = req.body;
      if (!instanceName || !number || !sections) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, number, sections',
        });
      }
      const cleanNumber = number.replace(/[\s\-\+\(\)]/g, '');
      const result = await evolutionAPI.sendList(instanceName, {
        number: cleanNumber,
        title,
        description,
        buttonText,
        footerText,
        sections,
      });
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error sending list message', { error });
      return res.status(500).json({
        error: error.message,
        details: error.response?.data || null,
      });
    }
  });

  router.post('/location', async (req, res) => {
    try {
      const { instanceName, number, name, address, latitude, longitude } = req.body;
      if (!instanceName || !number || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, number, latitude, longitude',
        });
      }
      const cleanNumber = number.replace(/[\s\-\+\(\)]/g, '');
      const result = await evolutionAPI.sendLocation(instanceName, {
        number: cleanNumber,
        name,
        address,
        latitude,
        longitude,
      });
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error sending location message', { error });
      return res.status(500).json({
        error: error.message,
        details: error.response?.data || null,
      });
    }
  });

  router.post('/contact', async (req, res) => {
    try {
      const { instanceName, number, contact } = req.body;
      if (!instanceName || !number || !contact) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, number, contact',
        });
      }
      const cleanNumber = number.replace(/[\s\-\+\(\)]/g, '');
      const result = await evolutionAPI.sendContact(instanceName, {
        number: cleanNumber,
        contact,
      });
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error sending contact message', { error });
      return res.status(500).json({
        error: error.message,
        details: error.response?.data || null,
      });
    }
  });

  router.post('/reaction', async (req, res) => {
    try {
      const { instanceName, key, reaction } = req.body;
      if (!instanceName || !key || !reaction) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, key, reaction',
        });
      }
      const result = await evolutionAPI.sendReaction(instanceName, { key, reaction });
      return res.json(result);
    } catch (error: any) {
      logger.error('❌ Error sending reaction', { error });
      return res.status(500).json({
        error: error.message,
        details: error.response?.data || null,
      });
    }
  });

  return router;
}
