/**
 * Copyright IBM Corp. 2024, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext, createContext } from 'react';
import { StepContextType } from '../Tearsheet/TearsheetShell_v2';

export const StepContext = createContext<StepContextType>(undefined);

export const useStepContext = (): StepContextType => {
  const context = useContext(StepContext);

  if (!context) {
    throw new Error(
      'Tearsheet.StepGroup, Tearsheet.StepActions, and any component calling `useStepContext` must be used inside a tearsheet with the `enable-v3-tearsheet` feature flag.'
    );
  }

  return context;
};
