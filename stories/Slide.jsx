// @flow
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from '../src';

export const grid: number = 8;
export const borderRadius: number = 2;

const SlideContainer = styled.div`
  background: #aaa;
  height: 90px;
  width: 160px;
  margin: ${grid}px;
  overflow: hidden;
  ${(props) => (props.isSelected ? 'outline: 1px solid red' : '')};
`;

const primaryButton = 0;

export default function Slide(props) {
  const {
    title,
    thumbnail,
    slideOrder,
    index,
    toggleSelection,
    toggleSelectionInGroup,
    multiSelectTo,
    isSelected,
  } = props;

  // Determines if the platform specific toggle selection in group key was used
  const wasToggleInSelectionGroupKeyUsed = (
    event: MouseEvent | KeyboardEvent,
  ) => {
    const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
    return isUsingWindows ? event.ctrlKey : event.metaKey;
  };

  // Determines if the multiSelect key was used
  const wasMultiSelectKeyUsed = (event: MouseEvent | KeyboardEvent) =>
    event.shiftKey;

  const performAction = (event: MouseEvent | KeyboardEvent) => {
    if (wasToggleInSelectionGroupKeyUsed(event)) {
      toggleSelectionInGroup(slideOrder);
      return;
    }

    if (wasMultiSelectKeyUsed(event)) {
      multiSelectTo(slideOrder);
      return;
    }

    toggleSelection(slideOrder);
  };

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== primaryButton) {
      return;
    }

    // marking the event as used
    event.preventDefault();

    performAction(event);
  };

  return (
    <Draggable draggableId={`#${slideOrder}`} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        if (!snapshot.isDragging) {
          const { transform, ...rest } = provided.draggableProps.style;
          provided.draggableProps.style = rest;
        }

        return (
          <SlideContainer
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={onClick}
            isSelected={isSelected}
          >
            <div
              style={{
                width: 160,
                height: 100,
                overflow: 'hidden',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url("${thumbnail}")`,
              }}
            >
              <div>{title}</div>
            </div>
          </SlideContainer>
        );
      }}
    </Draggable>
  );
}
