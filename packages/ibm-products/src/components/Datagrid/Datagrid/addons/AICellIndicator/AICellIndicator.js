import React from 'react'
import { pkg } from '../../../../../settings';

const blockClass = `${pkg.prefix}--datagrid`;

export const AICellIndicator = () => {
  return (
    <div className={`${blockClass}__ai-generated-cell-indicator`}>
      <span className={`${blockClass}__ai-generate-cell-indicator--block`} />
      <caption>AI</caption>
    </div>
  )
}
