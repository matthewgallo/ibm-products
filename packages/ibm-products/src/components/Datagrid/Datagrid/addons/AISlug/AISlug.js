import React from 'react'
import cx from 'classnames';
import { pkg } from '../../../../../settings';

const blockClass = `${pkg.prefix}--datagrid`;

// eslint-disable-next-line react/prop-types
export const AISlug = ({ className }) => {
  return (
    <span className={cx(className, `${blockClass}__ai-slug`)}>
      AI
    </span>
  )
}
