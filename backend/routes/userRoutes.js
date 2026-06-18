// routes/userRoutes.js
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userRepository } from '../models/user.js';

// Ajout des schema pour la documentation des routes.
export default async function userRoutes(fastify, options) {
  fastify.post('/admins', { preHandler: authMiddleware }, userController.createAdmin);
  fastify.post('/manual-backup', { preHandler: authMiddleware }, userController.createManualBackup);
  fastify.post('/login', userController.login);
  fastify.put('/update', { preHandler: authMiddleware }, userController.updateUser);
  fastify.delete('/delete-profile-image', { preHandler: authMiddleware }, userController.deleteProfileImage);
  fastify.get('/get-users', { preHandler: authMiddleware }, userController.getUsersByCriteria);
  fastify.put('/delete-account', { preHandler: authMiddleware }, userController.deleteAccount);
  fastify.get('/admins', { preHandler: authMiddleware }, userController.getAdmins);
  fastify.put('/change-etat', { preHandler: authMiddleware }, userController.changeUserEtat);
  fastify.get('/me', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { userId } = request.user;
      const user = await userRepository.getUserById(userId);
      reply.send(user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
