/**
 * Copyright IBM Corp. 2023, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { pkg } from "../../../../settings";
import { INCREMENT_AMOUNT } from "../DatagridHeaderRow";
const COLUMN_RESIZE_START = 'columnStartResizing';
const COLUMN_RESIZING = 'columnResizing';
const COLUMN_RESIZE_END = 'columnDoneResizing';
const INIT = 'init';

export const handleColumnResizeStartEvent = (dispatch, headerId, initialWidth, clonedCols) => {
  // console.log(initialWidth);
  dispatch({ type: COLUMN_RESIZE_START, payload: { headerId, initialWidth, clonedCols } });
};

export const handleColumnResizeEndEvent = (
  dispatch,
  onColResizeEnd,
  headerId
) => {
  dispatch({ type: COLUMN_RESIZE_END, payload: { onColResizeEnd, headerId } });
};

export const handleColumnResizingEvent = (
  dispatch,
  header,
  newWidth,
  isKeyEvent
) => {
  if (isKeyEvent) {
    dispatch({
      type: COLUMN_RESIZE_START,
      payload: {
        newWidth,
        headerId: header.id,
        defaultWidth: header.originalWidth,
      },
    });
  }
  dispatch({
    type: COLUMN_RESIZING,
    payload: {
      newWidth,
      headerId: header.id,
      header,
      defaultWidth: header.originalWidth,
    },
  });
};

// Updates the sizing of cloned AI Generated column masks
// ************************************ //
const blockClass = `${pkg.prefix}--datagrid`;
export const getClonedColumns = () => {
  const cols = document.querySelectorAll(`.${blockClass}__ai-generate-col-background`);
  return cols
}

const updateClonedColSizing = (prevState, header, newWidth) => {
  console.log(prevState);
  const clonedCols = getClonedColumns();
  let clonedColsNonMatch = [];
  const clonedMatch = Array.from(clonedCols).filter(col => {
    const attr = col.getAttribute('data-column-id');
    if (attr === header.id) {
      return col;
    }
    if (attr !== header.id) {
      clonedColsNonMatch = [...clonedColsNonMatch, col];
    }
    return null;
  });
  // console.log(clonedColsNonMatch);
  const { prevColInitialWidths, initialClonedColumns } = prevState;
  if (clonedMatch && clonedMatch.length) {
    clonedMatch[0].style.width = `${newWidth}px`;
    const matchIndex = clonedMatch[0].getAttribute('data-column-index');
    const matchId = clonedMatch[0].getAttribute('data-column-id');
    Array.from(clonedColsNonMatch).forEach(nonMatch => {
      const nonMatchColIndex = nonMatch.getAttribute('data-column-index');
      const nonMatchColID = nonMatch.getAttribute('data-column-id');
      // Increase left value of these items by the amount that has been resized
      if (parseInt(nonMatchColIndex) > parseInt(matchIndex)) {
        console.log(nonMatch.style.left, newWidth, header);
        console.log(nonMatch, nonMatchColID, prevColInitialWidths);
        const initialColWidth = prevColInitialWidths[matchId];
        let newValueDifference = 0;
        if (initialColWidth < newWidth) {
          newValueDifference = newWidth - initialColWidth;
        }
        if (initialColWidth > newWidth) {
          newValueDifference = -Math.abs(initialColWidth - newWidth);
        }
        // const currentElementLeftPosition = nonMatch.style.left;
      }
      // console.log(nonMatchColIndex, matchIndex);
    })
  }
}
// ************************************ //

export const stateReducer = (newState, action, prevState) => {
  switch (action.type) {
    case INIT: {
      return {
        ...newState,
        isResizing: false,
      };
    }
    case COLUMN_RESIZE_START: {
      const { headerId, initialWidth, clonedCols } = action.payload;
      console.log(initialWidth);
      return {
        ...newState,
        isResizing: headerId,
        prevColInitialWidths: {
          ...newState.prevColInitialWidths,
          [headerId]: initialWidth,
        },
        initialClonedColumns: clonedCols
      };
    }
    case COLUMN_RESIZING: {
      const { headerId, newWidth, defaultWidth, header } = action.payload || {};
      const newColumnWidth = {};
      if (typeof headerId === 'undefined') {
        return {
          ...newState,
        };
      }
      newColumnWidth[headerId] = newWidth;
      const cleanedWidths = Object.fromEntries(
        Object.entries(newState.columnResizing.columnWidths).filter(
          ([_, value]) => !isNaN(value)
        )
      );
      updateClonedColSizing(prevState, header, newWidth)
      return {
        ...newState,
        isResizing: headerId,
        columnResizing: {
          ...newState.columnResizing,
          columnWidth: defaultWidth,
          columnWidths: {
            ...cleanedWidths,
            ...newColumnWidth,
          },
          headerIdWidths: [headerId, newWidth],
        },
      };
    }
    case COLUMN_RESIZE_END: {
      const { onColResizeEnd, headerId } = action.payload;
      const currentColumn = {};
      currentColumn[headerId] = newState.columnResizing.columnWidths[headerId];
      const allChangedColumns = newState.columnResizing.columnWidths;
      const { isResizing } = newState;
      if (isResizing) {
        onColResizeEnd?.(currentColumn, allChangedColumns);
      }
      return {
        ...newState,
        isResizing: false,
      };
    }
  }
};
