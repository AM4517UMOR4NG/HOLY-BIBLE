import { Queue } from 'bullmq';
import { connection } from '../queues/connection.js';
import { ImportVersionJobData, IndexVersesJobData } from './types.js';

// Only create queues if Redis connection is available
export const importQueue = connection 
  ? new Queue<ImportVersionJobData>('import-version', { connection })
  : null as any;
  
export const indexQueue = connection 
  ? new Queue<IndexVersesJobData>('index-verses', { connection })
  : null as any;




