import { useMemo } from 'react';
import modulesData from '@/data/modules.json';
import type { ModulesData } from '@/types/global';

export const useModuleData = (moduleId: number) => {
  const typed = modulesData as ModulesData;
  const module = useMemo(() => typed.modules.find(m => m.id === moduleId) || null, [moduleId]);
  const stepCount = module?.steps?.length || 0;
  return { module, stepCount };
};


