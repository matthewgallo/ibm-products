/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Copyright IBM Corp. 2023, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { Edit, TrashCan } from '@carbon/react/icons';
import { action } from '@storybook/addon-actions';
import {
  getStoryTitle,
  prepareStory,
} from '../../../../global/js/utils/story-helper';
import { Datagrid, useDatagrid } from '../../index';
import styles from '../../_storybook-styles.scss';
import { DatagridActions } from '../../utils/DatagridActions';
import { DatagridPagination } from '../../utils/DatagridPagination';
import { makeData } from '../../utils/makeData';
import { ARG_TYPES } from '../../utils/getArgTypes';

export default {
  title: `${getStoryTitle(Datagrid.displayName)}/Extensions/AIExplorations`,
  component: Datagrid,
  tags: ['autodocs'],
  parameters: {
    styles,
    // layout: 'fullscreen',
  },
};

const defaultHeader = [
  {
    Header: 'Row Index',
    accessor: (row, i) => i,
    sticky: 'left',
    id: 'rowIndex', // id is required when accessor is a function.
  },
  {
    Header: 'First Name',
    accessor: 'firstName',
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
    aiGenerated: true,
  },
  {
    Header: 'Age',
    accessor: 'age',
    width: 50,
  },
  {
    Header: 'Visits',
    accessor: 'visits',
    width: 60,
  },
  {
    Header: 'Someone 1',
    accessor: 'someone1',
    aiGenerated: true,
  },
  {
    Header: 'Someone 2',
    accessor: 'someone2',
  },
  {
    Header: 'Someone 3',
    accessor: 'someone3',
  },
  {
    Header: 'Someone 4',
    accessor: 'someone4',
  },
  {
    Header: 'Someone 5',
    accessor: 'someone5',
  },
  {
    Header: 'Someone 6',
    accessor: 'someone6',
  },
  {
    Header: 'Someone 7',
    accessor: 'someone7',
  },
  {
    Header: 'Someone 8',
    accessor: 'someone8',
  },
  {
    Header: 'Someone 9',
    accessor: 'someone9',
  },
  {
    Header: 'Someone 10',
    accessor: 'someone10',
  },
];

const sharedDatagridProps = {
  emptyStateTitle: 'Empty state title',
  emptyStateDescription: 'Description text explaining why table is empty',
  emptyStateSize: 'lg',
  gridTitle: 'Data table title',
  gridDescription: 'Additional information if needed',
  useDenseHeader: false,
  rowSize: 'lg',
  rowSizes: [
    {
      value: 'xl',
      labelText: 'Extra large',
    },
    {
      value: 'lg',
      labelText: 'Large',
    },
    {
      value: 'md',
      labelText: 'Medium',
    },
    {
      value: 'xs',
      labelText: 'Small',
    },
  ],
  onRowSizeChange: (value) => {
    console.log('row size changed to: ', value);
  },
  rowActions: [
    {
      id: 'edit',
      itemText: 'Edit',
      icon: Edit,
      onClick: action('Clicked row action: edit'),
    },

    {
      id: 'delete',
      itemText: 'Delete',
      icon: TrashCan,
      isDelete: true,
      onClick: action('Clicked row action: delete'),
    },
  ],
};

const AICellTableExample = ({ aiType, ...args }) => {
  const columns = React.useMemo(
    () => [
      ...defaultHeader,
      {
        Header: 'Someone 11',
        accessor: 'someone11',
        multiLineWrap: true,
      },
    ],
    []
  );
  const [data] = useState(makeData(10, { aiType }));
  const rows = React.useMemo(() => data, [data]);

  const datagridState = useDatagrid({
    aiGenerated: true,
    columns,
    data: rows,
    initialState: {
      pageSize: 10,
      pageSizes: [5, 10, 25, 50],
    },
    DatagridActions,
    DatagridPagination,
    ...args.defaultGridProps,
  });

  return <Datagrid datagridState={datagridState} />;
};

const AICellTableWrapper = ({ aiType = 'cell', ...args }) => {
  return <AICellTableExample aiType={aiType} defaultGridProps={{ ...args }} />;
};

const AIRowTableWrapper = ({ aiType = 'row', ...args }) => {
  return <AICellTableExample aiType={aiType} defaultGridProps={{ ...args }} />;
};

const AIColTableWrapper = ({ aiType = 'col', ...args }) => {
  return <AICellTableExample aiType={aiType} defaultGridProps={{ ...args }} />;
};

const AITableWrapper = ({ aiType = 'table', ...args }) => {
  return <AICellTableExample aiType={aiType} defaultGridProps={{ ...args }} />;
};

const basicUsageControlProps = {
  gridTitle: sharedDatagridProps.gridTitle,
  gridDescription: sharedDatagridProps.gridDescription,
  useDenseHeader: sharedDatagridProps.useDenseHeader,
};
const aiCellStoryName = 'Cell';
export const AICell = prepareStory(AICellTableWrapper, {
  storyName: aiCellStoryName,
  argTypes: {
    gridTitle: ARG_TYPES.gridTitle,
    gridDescription: ARG_TYPES.gridDescription,
    useDenseHeader: ARG_TYPES.useDenseHeader,
  },
  args: {
    ...basicUsageControlProps,
  },
});

const aiRowStoryName = 'Row';
export const AIRow = prepareStory(AIRowTableWrapper, {
  storyName: aiRowStoryName,
  argTypes: {
    gridTitle: ARG_TYPES.gridTitle,
    gridDescription: ARG_TYPES.gridDescription,
    useDenseHeader: ARG_TYPES.useDenseHeader,
  },
  args: {
    ...basicUsageControlProps,
  },
});

const aiColumnStoryName = 'Column';
export const AIColumn = prepareStory(AIColTableWrapper, {
  storyName: aiColumnStoryName,
  argTypes: {
    gridTitle: ARG_TYPES.gridTitle,
    gridDescription: ARG_TYPES.gridDescription,
    useDenseHeader: ARG_TYPES.useDenseHeader,
  },
  args: {
    ...basicUsageControlProps,
  },
});

const aiTableStoryName = 'Table';
export const AITable = prepareStory(AITableWrapper, {
  storyName: aiTableStoryName,
  argTypes: {
    gridTitle: ARG_TYPES.gridTitle,
    gridDescription: ARG_TYPES.gridDescription,
    useDenseHeader: ARG_TYPES.useDenseHeader,
  },
  args: {
    ...basicUsageControlProps,
  },
});
