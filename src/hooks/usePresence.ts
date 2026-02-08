import { useState } from 'react';
import type { WorkerStatus } from '@/lib/types';

export function usePresence(initialStatus: WorkerStatus = 'available') {
  const [status, setStatus] = useState<WorkerStatus>(initialStatus);
  return { status, setStatus };
}
