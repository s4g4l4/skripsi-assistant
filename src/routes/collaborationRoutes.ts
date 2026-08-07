import { Router } from 'express';
import {
  getCollaborators,
  inviteCollaborator,
  removeCollaborator,
  getComments,
  addComment,
  replyComment,
  resolveComment,
  getRevisions,
  addRevision,
  getApprovals,
  updateApproval
} from '../controllers/collaborationController.js';

const router = Router();

// Collaborators
router.get('/collaborators', getCollaborators);
router.get('/collaborators/:projectId', getCollaborators);
router.post('/invite', inviteCollaborator);
router.delete('/collaborators/:projectId/:colId', removeCollaborator);

// Comments & inline feedback
router.get('/comments', getComments);
router.get('/comments/:projectId', getComments);
router.post('/comments', addComment);
router.post('/comments/reply', replyComment);
router.patch('/comments/:commentId/resolve', resolveComment);

// Track changes & revision history
router.get('/revisions', getRevisions);
router.get('/revisions/:projectId', getRevisions);
router.post('/revisions', addRevision);

// Chapter approvals workflow
router.get('/approvals', getApprovals);
router.get('/approvals/:projectId', getApprovals);
router.post('/approvals', updateApproval);

export default router;
