import { Request, Response } from 'express';
import { fetchDeclutterSuggestions } from '../services/DeclutterService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDeclutterSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = await fetchDeclutterSuggestions();

    await prisma.declutterLog.create({
      data: { suggestions },
    });

    res.status(200).json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get declutter suggestions.' });
  }
};