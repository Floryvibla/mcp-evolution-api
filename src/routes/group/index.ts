import { Router } from 'express';
import { EvolutionAPI } from '../../services/evolution-api.js';

export function createGroupRouter(evolutionAPI: EvolutionAPI): Router {
  const router = Router();

  router.get('/:instanceName', async (req, res) => {
    try {
      const { getParticipants } = req.query;
      const groups = await evolutionAPI.findGroups(
        req.params.instanceName,
        getParticipants === 'true',
      );
      return res.json(groups);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/create', async (req, res) => {
    try {
      const { instanceName, subject, participants, description } = req.body;
      if (!instanceName || !subject || !participants) {
        return res.status(400).json({
          error: 'Missing required fields: instanceName, subject, participants',
        });
      }
      const cleanParticipants = participants.map((p: string) =>
        p.replace(/[\s\-\+\(\)]/g, ''),
      );
      const result = await evolutionAPI.createGroup(instanceName, {
        subject,
        participants: cleanParticipants,
        description,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get('/:instanceName/participants', async (req, res) => {
    try {
      const { groupJid } = req.query;
      if (!groupJid) {
        return res.status(400).json({ error: 'Missing groupJid query parameter' });
      }
      const result = await evolutionAPI.getGroupMembers(
        req.params.instanceName,
        groupJid as string,
      );
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.put('/:instanceName/subject', async (req, res) => {
    try {
      const { groupJid, subject } = req.body;
      const result = await evolutionAPI.updateGroupSubject(req.params.instanceName, {
        groupJid,
        subject,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.put('/:instanceName/description', async (req, res) => {
    try {
      const { groupJid, description } = req.body;
      const result = await evolutionAPI.updateGroupDescription(req.params.instanceName, {
        groupJid,
        description,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/add-participants', async (req, res) => {
    try {
      const { groupJid, participants } = req.body;
      const cleanParticipants = participants.map((p: string) =>
        p.replace(/[\s\-\+\(\)]/g, ''),
      );
      const result = await evolutionAPI.addGroupParticipants(req.params.instanceName, {
        groupJid,
        participants: cleanParticipants,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/remove-participants', async (req, res) => {
    try {
      const { groupJid, participants } = req.body;
      const cleanParticipants = participants.map((p: string) =>
        p.replace(/[\s\-\+\(\)]/g, ''),
      );
      const result = await evolutionAPI.removeGroupParticipants(req.params.instanceName, {
        groupJid,
        participants: cleanParticipants,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/promote-participants', async (req, res) => {
    try {
      const { groupJid, participants } = req.body;
      const cleanParticipants = participants.map((p: string) =>
        p.replace(/[\s\-\+\(\)]/g, ''),
      );
      const result = await evolutionAPI.promoteGroupParticipants(req.params.instanceName, {
        groupJid,
        participants: cleanParticipants,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/demote-participants', async (req, res) => {
    try {
      const { groupJid, participants } = req.body;
      const cleanParticipants = participants.map((p: string) =>
        p.replace(/[\s\-\+\(\)]/g, ''),
      );
      const result = await evolutionAPI.demoteGroupParticipants(req.params.instanceName, {
        groupJid,
        participants: cleanParticipants,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/leave', async (req, res) => {
    try {
      const { groupJid } = req.body;
      const result = await evolutionAPI.leaveGroup(req.params.instanceName, groupJid);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get('/:instanceName/invite-code', async (req, res) => {
    try {
      const { groupJid } = req.query;
      if (!groupJid) {
        return res.status(400).json({ error: 'Missing groupJid query parameter' });
      }
      const result = await evolutionAPI.getGroupInviteCode(
        req.params.instanceName,
        groupJid as string,
      );
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/revoke-invite', async (req, res) => {
    try {
      const { groupJid } = req.body;
      const result = await evolutionAPI.revokeGroupInviteCode(req.params.instanceName, groupJid);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/:instanceName/accept-invite', async (req, res) => {
    try {
      const { inviteCode } = req.body;
      const result = await evolutionAPI.acceptGroupInvite(req.params.instanceName, inviteCode);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
