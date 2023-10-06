/**
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @flow
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { TableHeader, TableRow } from '@carbon/react';
import { px } from '@carbon/layout';
import { selectionColumnId } from '../common-column-ids';
import { pkg } from '../../../settings';
import getColTitle from '../utils/getColTitle';
import {
  handleColumnResizeEndEvent,
  handleColumnResizeStartEvent,
  handleColumnResizingEvent,
} from './addons/stateReducer';
import { AISlug } from './addons/AISlug/AISlug';

export const INCREMENT_AMOUNT = 2;

const blockClass = `${pkg.prefix}--datagrid`;

const getAccessibilityProps = (header) => {
  const props = {};
  const title = getColTitle(header);
  if (title) {
    props.title = title;
  } else {
    props['aria-hidden'] = true;
  }
  return props;
};

const HeaderRow = (datagridState, headRef, headerGroup) => {

  const { columns, tableId, isFetching } = datagridState;

  // Used to measure the height of the table and uses that value
  // to display a vertical line to indicate the column you are resizing
  useEffect(() => {
    const { tableId } = datagridState;
    if (tableId) {
      const gridElement = document.querySelector(`#${tableId}`);
      const tableElement = gridElement.querySelector('table');
      const headerRowElement = document.querySelector(
        `#${tableId} .${blockClass}__head`
      );
      const hasHorizontalScrollbar =
        tableElement.scrollWidth > tableElement.clientWidth;
      const scrollBuffer = hasHorizontalScrollbar ? 18 : 2;
      const tableToolbar = gridElement.querySelector(
        `.${blockClass}__table-toolbar`
      );
      const tableToolbarHeight = tableToolbar?.offsetHeight || 0;
      const setCustomValues = ({ rowHeight = 48, gridHeight }) => {
        headerRowElement.style.setProperty(
          `--${blockClass}--row-height`,
          px(rowHeight)
        );
        headerRowElement.style.setProperty(
          `--${blockClass}--grid-height`,
          px(gridHeight - scrollBuffer - tableToolbarHeight)
        );
        headerRowElement.style.setProperty(
          `--${blockClass}--header-height`,
          px(headerRowElement.offsetHeight)
        );
      };
      setCustomValues({
        gridHeight: gridElement.offsetHeight,
        rowHeight: headerRowElement.clientHeight,
      });
    }
  }, [datagridState.rowSize, datagridState.tableId, datagridState]);

  const getClientXPosition = (event) => {
    let isTouchEvent = false;
    if (event.type === 'touchstart') {
      // Do not respond to multiple touches (e.g. 2 or 3 fingers)
      if (event.touches && event.touches.length > 1) {
        return;
      }
      isTouchEvent = true;
    }
    const clientX = isTouchEvent
      ? Math.round(event.touches[0].clientX)
      : event.clientX;
    const closestHeader = event.target.closest('th');
    const closestHeaderCoords = closestHeader.getBoundingClientRect();
    const headerOffset = closestHeaderCoords.left;
    const offsetValue = clientX - headerOffset;
    return offsetValue;
  };

  useEffect(() => {
    const { isResizing } = datagridState.state;
    if (isResizing) {
      const { onColResizeEnd } = datagridState;
      document.addEventListener('mouseup', () => {
        handleColumnResizeEndEvent(
          datagridState.dispatch,
          onColResizeEnd,
          isResizing,
        );
        document.activeElement.blur();
      });
    }
    return () => {
      document.removeEventListener('mouseup', () =>
        handleColumnResizeEndEvent(datagridState.dispatch)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datagridState.state.isResizing]);

  const [clonedCols, setClonedCols] = useState();
  
  useEffect(() => {
    if (!isFetching) {
      const aiGeneratedCols = columns.filter(col => col.aiGenerated);
      console.log(aiGeneratedCols);
      const buildAIGeneratedColBackground = () => {
        const allAIGeneratedColumns = document.querySelectorAll(`#${tableId} .${blockClass}__isAIGeneratedColumn`);
        const tableContainer = document.querySelector(`#${tableId} .${blockClass}__table-container`);
        const gridTable = document.querySelector(`#${tableId} table`);
        const innerScrollWrapper = gridTable.querySelector(`.${blockClass}__inner-table-scroll-wrapper`);
        const tableCoords = tableContainer.getBoundingClientRect();
        const gridTableLeft = tableCoords.left;
        Array.from(allAIGeneratedColumns).forEach(aiCol => {
          const aiColCoords = aiCol.getBoundingClientRect();
          const newLeftPosition = aiColCoords.left - gridTableLeft ;
          const clonedAIGeneratedCol = aiCol.cloneNode();
          clonedAIGeneratedCol.classList.add(`${blockClass}__ai-generate-col-background`);
          clonedAIGeneratedCol.style.position = 'absolute';
          clonedAIGeneratedCol.style.top = 0;
          clonedAIGeneratedCol.style.left = `${newLeftPosition}px`;
          clonedAIGeneratedCol.style.height = `${tableContainer.offsetHeight - 16}px`;
          innerScrollWrapper.appendChild(clonedAIGeneratedCol);
        });
        const cols = document.querySelectorAll(`#${tableId} .${blockClass}__ai-generate-col-background`);
        setClonedCols(cols);
      }
      setTimeout(() => {
        buildAIGeneratedColBackground();
      }, 50);
    }

  }, [tableId, isFetching, columns]);

  const isAIGeneratedColumn = (index) => {
    if (columns[index]?.aiGenerated) {
      return true;
    }
    return false;
  }

  return (
    <TableRow
      {...headerGroup.getHeaderGroupProps({ role: false })}
      className={cx(
        `${blockClass}__head`,
        headerGroup.getHeaderGroupProps().className
      )}
      ref={headRef}
    >
      {datagridState.headers
        .filter(({ isVisible }) => isVisible)
        .map((header, index) => {
          if (header.id === selectionColumnId) {
            // render directly without the wrapper TableHeader
            return header.render('Header', { key: header.id });
          }
          const { minWidth } = header || 50;
          const { visibleColumns, state, dispatch, onColResizeEnd } =
            datagridState;
          const { columnResizing, isResizing } = state;
          const { columnWidths } = columnResizing;
          const originalCol = visibleColumns[index];
          return (
            <TableHeader
              {...header.getHeaderProps()}
              className={cx(
                {
                  [`${blockClass}__resizableColumn`]: header.getResizerProps,
                  [`${blockClass}__isResizing`]: header.isResizing,
                  [`${blockClass}__sortableColumn`]:
                    datagridState.isTableSortable,
                  [`${blockClass}__isSorted`]: header.isSorted,
                  [`${blockClass}__isAIGeneratedColumn`]: isAIGeneratedColumn(index)
                },
                header.getHeaderProps().className
              )}
              key={header.id}
              data-column-id={header.id}
              data-column-index={index}
              {...getAccessibilityProps(header)}
            >
              {header.render('Header')}
              {isAIGeneratedColumn(index) && <AISlug className={`${blockClass}__slug--header`} />}
              {header.getResizerProps && (
                <>
                  <input
                    {...header.getResizerProps()}
                    onMouseMove={(event) => {
                      if (isResizing) {
                        const newWidth = getClientXPosition(event);
                        // Sets a min width for resizing so at least one character from the column header is visible
                        if (newWidth >= 50) {
                          handleColumnResizingEvent(dispatch, header, newWidth);
                        }
                      }
                    }}
                    onMouseDown={() =>
                      handleColumnResizeStartEvent(dispatch, header.id, header.width, clonedCols)
                    }
                    onKeyDown={(event) => {
                      const { key } = event;
                      if (key === 'ArrowLeft' || key === 'ArrowRight') {
                        const currentColumnWidth =
                          columnWidths[header.id] ||
                          (datagridState.isTableSortable &&
                          originalCol.width < 90
                            ? 90
                            : originalCol.width);
                        if (key === 'ArrowLeft') {
                          if (
                            currentColumnWidth - INCREMENT_AMOUNT >
                            Math.max(minWidth, 50)
                          ) {
                            const newWidth =
                              currentColumnWidth - INCREMENT_AMOUNT;
                            handleColumnResizingEvent(
                              dispatch,
                              header,
                              newWidth,
                              true
                            );
                          }
                        }
                        if (key === 'ArrowRight') {
                          const newWidth = currentColumnWidth + INCREMENT_AMOUNT;
                          handleColumnResizingEvent(
                            dispatch,
                            header,
                            newWidth,
                            true
                          );
                        }
                      }
                    }}
                    onKeyUp={() =>
                      handleColumnResizeEndEvent(
                        dispatch,
                        onColResizeEnd,
                        header.id
                      )
                    }
                    className={cx(`${blockClass}__col-resizer-range`)}
                    type="range"
                    defaultValue={originalCol.width}
                    aria-label="Resize column"
                  />
                  <span className={`${blockClass}__col-resize-indicator`} />
                </>
              )}
            </TableHeader>
          );
        })}
    </TableRow>
  );
};

const useHeaderRow = (hooks) => {
  const useInstance = (instance) => {
    Object.assign(instance, { HeaderRow });
  };
  hooks.useInstance.push(useInstance);
};

export default useHeaderRow;
