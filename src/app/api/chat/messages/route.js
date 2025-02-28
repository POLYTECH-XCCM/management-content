import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = req.headers.userid; // Récupère l'ID utilisateur depuis les headers

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    if (req.method === 'GET') {
      // Récupérer les messages pour l'utilisateur connecté
      const messages = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });
      return res.status(200).json(messages);
    } else if (req.method === 'POST') {
      // Enregistrer un nouveau message
      const { message, sender } = req.body;

      if (!message || !sender) {
        return res.status(400).json({ error: 'Message and sender are required.' });
      }

      const newMessage = await prisma.chatMessage.create({
        data: {
          userId,
          message,
          sender,
        },
      });

      return res.status(201).json(newMessage);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error('Error handling chat messages:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}
