// @flow
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from '../src';
import Slide from './Slide';

export const grid: number = 8;
export const borderRadius: number = 2;

const SlidesListContainer = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const SectionContainer = styled.div`
  background: #eee;
  min-height: 100px;
  width: 100%;
  margin: ${grid}px;
`;

function SlidesList(props) {
  const {
    slides,
    slidesOnDeck,
    sectionId,
    draggingDestination,
    toggleSelection,
    toggleSelectionInGroup,
    selectedSlideIds,
  } = props;
  const slidesWithPlaceholder =
    draggingDestination &&
    draggingDestination.droppableId === sectionId &&
    draggingDestination.index > -1
      ? [
          ...slides.slice(0, draggingDestination.index),
          'placeholder',
          ...slides.slice(draggingDestination.index),
        ]
      : slides;
  return (
    <Droppable droppableId={sectionId} type="slide" direction="horizontal">
      {(provided: DroppableProvided) => {
        return (
          <SlidesListContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {slidesWithPlaceholder.map((slideOrder) => {
              const index = slides.indexOf(slideOrder);
              return slideOrder === 'placeholder' ? (
                <div
                  key="placeholder"
                  className="placeholder"
                  style={{ outline: '1px dotted' }}
                >
                  {provided.placeholder}
                </div>
              ) : (
                <Slide
                  key={`Slide #${slideOrder}`}
                  index={index}
                  title={`Slide #${slideOrder}`}
                  id={`Slide #${slideOrder}`}
                  slideOrder={slideOrder}
                  thumbnail={
                    slidesOnDeck.origin.slides[
                      slidesOnDeck.slides[slideOrder].order
                    ].thumbnail
                  }
                  toggleSelection={toggleSelection}
                  toggleSelectionInGroup={toggleSelectionInGroup}
                  isSelected={selectedSlideIds.includes(slideOrder)}
                />
              );
            })}
          </SlidesListContainer>
        );
      }}
    </Droppable>
  );
}

export default function Section(props) {
  const {
    index,
    title,
    id,
    slides,
    slidesOnDeck,
    draggingDestination,
    toggleSelection,
    toggleSelectionInGroup,
    selectedSlideIds,
  } = props;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <SectionContainer ref={provided.innerRef} {...provided.draggableProps}>
          <div {...provided.dragHandleProps}>{title}</div>
          <SlidesList
            slides={slides}
            slidesOnDeck={slidesOnDeck}
            sectionId={id}
            draggingDestination={draggingDestination}
            toggleSelection={toggleSelection}
            toggleSelectionInGroup={toggleSelectionInGroup}
            selectedSlideIds={selectedSlideIds}
          />
        </SectionContainer>
      )}
    </Draggable>
  );
}
