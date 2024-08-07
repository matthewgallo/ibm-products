/**
 * Copyright IBM Corp. 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { motion } from '@carbon/motion';

/**
 * This function turns a cubic-bezier() string to an
 * array of values that we can use with framer-motion
 * @param {string} type - The carbon motion type, either 'standard', 'entrance', or 'exit'
 * @param {string} mode - The carbon motion mode, either 'productive', or 'expressive'
 */

export const getBezierValues = (type, mode) => {
  const cubicBezier = motion(type, mode);
  const extractStringFromParens = /\(([^)]+)\)/;
  const desiredBezierStrings = extractStringFromParens.exec(cubicBezier)[1];
  const formattedDesiredBezierStrings = desiredBezierStrings
    .trim()
    .split(',')
    .map(Number);
  if (Array.isArray(formattedDesiredBezierStrings)) {
    return formattedDesiredBezierStrings;
  }
  return [];
};
