// Aufgaben zum Kapitel «Lagerkräfte».
import type { Task } from '../../../core/types';
import { ZWEI } from './zwei';
import { KRAGARM } from './kragarm';
import { EINE } from './eine';
import { KRAN } from './kran';

export const AUFGABEN: Task[] = [...ZWEI, ...KRAGARM, ...EINE, ...KRAN];
