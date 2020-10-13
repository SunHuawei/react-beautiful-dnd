// @flow
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from '../src';
import Section from './Section';

export const grid: number = 8;
export const borderRadius: number = 2;

const DeckDropAreaContainer = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

export default function Deck(props) {
  const { slidesOnDeck, sections } = props;
  return <Board slidesOnDeck={slidesOnDeck} sections={sections} />;
}

function Board(props) {
  const [draggingDestination, setDraggingDestination] = useState(null);
  const [selectedSlideIds, setSelectedSlideIds] = useState([]);
  const { slidesOnDeck, sections } = props;

  const toggleSelection = (slidesId: Id) => {
    const wasSelected: boolean = selectedSlideIds.includes(slidesId);

    const newTaskIds: Id[] = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [slidesId];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedSlideIds.length > 1) {
        return [slidesId];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    setSelectedSlideIds(newTaskIds);
  };

  const toggleSelectionInGroup = (slidesId: Id) => {
    const index: number = selectedSlideIds.indexOf(slidesId);

    // if not selected - add it to the selected items
    if (index === -1) {
      setSelectedSlideIds([...selectedSlideIds, slidesId]);
      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow: Id[] = [...selectedSlideIds];
    shallow.splice(index, 1);
    setSelectedSlideIds(shallow);
  };

  const onDragStart = (start: DragStart, provided: ResponderProvided): void => {
    console.log('start>>>', start);
    setDraggingDestination(start.source);
  };

  const onDragUpdate = (
    update: DragUpdate,
    provided: ResponderProvided,
  ): void => {
    console.log('update.destination.index2', update.destination);
    if (!update.destination) {
      return;
    }

    let targetIndex = update.destination.index;
    if (targetIndex > draggingDestination.index) {
      targetIndex += 1;
    }

    setDraggingDestination({
      droppableId: update.destination.droppableId,
      index: targetIndex,
    });
  };

  function onDragEnd(params) {
    console.log('end>>>', params);
    setDraggingDestination(null);
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
    >
      <Droppable droppableId="DeckDropArea" type="section" direction="vertical">
        {(provided: DroppableProvided) => (
          <DeckDropAreaContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sections.map((section, index: number) => (
              <Section
                key={section.id}
                index={index}
                title={section.name}
                id={section.id}
                slides={section.slides}
                slidesOnDeck={slidesOnDeck}
                draggingDestination={draggingDestination}
                toggleSelection={toggleSelection}
                toggleSelectionInGroup={toggleSelectionInGroup}
                selectedSlideIds={selectedSlideIds}
              />
            ))}
          </DeckDropAreaContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
}
