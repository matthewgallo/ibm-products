import React from 'react'
import { pkg } from '../../../../../settings';

const blockClass = `${pkg.prefix}--datagrid`;

export const AISlug = () => {
  return (
    <span className={`${blockClass}__ai-slug`}>
      AI
    </span>
  )
}
