// @flow
import React, { Component } from 'react';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { Droppable, Draggable } from '../../../src';
import Author from './author-item';
import { grid } from '../constants';
import type { Quote } from '../types';
import type {
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from '../../../src';

const Wrapper = styled.div`
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? colors.B50 : colors.B75};
  display: flex;
  flex-direction: column;
  padding: ${grid}px;
  user-select: none;
  transition: background-color 0.1s ease;
  margin: ${grid}px 0;
`;

const DropZone = styled.div`
  display: flex;
  flex-wrap: wrap;

  /*
    Needed to avoid growth in list due to lifting the first item
    Caused by display: inline-flex strangeness
  */
  align-items: start;

  /* stop the list collapsing when empty */
  min-width: 600px;

  /* stop the list collapsing when it has no items */
  min-height: 60px;
`;

const ScrollContainer = styled.div`
  overflow: auto;
`;

// $ExpectError - not sure why
const Container = styled.div`
  /* flex child */
  flex-grow: 1;

  /*
    flex parent
    needed to allow width to grow greater than body
  */
  display: inline-flex;
`;

type Props = {|
  quotes: Quote[],
  listId: string,
  listType?: string,
  internalScroll?: boolean,
  isCombineEnabled?: boolean,
  draggingIndex?: Number,
|};

class AuthorWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dragProvided: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      dragProvided: props.dragProvided,
    };
  }

  // componentDidMount() {
  //   this.updateTransition();
  // }

  // componentDidUpdate() {
  //   this.updateTransition();
  // }

  updateTransition() {
    setTimeout(() => {
      if (this.state.dragProvided) {
        this.setState({
          dragProvided: (this.state.dragProvided.draggableProps.style = {
            ...this.state.dragProvided.draggableProps.style,
            transform: null,
            transition: null,
          }),
        });
      }
    }, 160);
  }

  render() {
    const { quote, dragProvided, dragSnapshot } = this.props;
    return (
      <Author
        author={quote.author}
        provided={dragProvided}
        snapshot={dragSnapshot}
        quote={quote}
      />
    );
  }
}

export default class AuthorList extends Component<Props> {
  static defaultProps = {
    isCombineEnabled: false,
  };
  renderBoard = (dropProvided: DroppableProvided) => {
    const { quotes, draggingIndex } = this.props;

    const quotesWithoutPlaceholder = quotes.filter(
      (q) => q.id !== 'placeholder',
    );

    return (
      <Container>
        <DropZone ref={dropProvided.innerRef}>
          {quotes.map((quote: Quote) => {
            const index = quotesWithoutPlaceholder.findIndex(
              (a) => a === quote,
            );
            return quote.id === 'placeholder' ? (
              <div key={quote.id}>{dropProvided.placeholder}</div>
            ) : (
              <Draggable key={quote.id} draggableId={quote.id} index={index}>
                {(
                  dragProvided: DraggableProvided,
                  dragSnapshot: DraggableStateSnapshot,
                ) => {
                  if (draggingIndex !== index) {
                    const {
                      transform,
                      ...rest
                    } = dragProvided.draggableProps.style;
                    dragProvided.draggableProps.style = rest;
                    // dragProvided.draggableProps.style = {
                    //   ...dragProvided.draggableProps.style,
                    //   transform: 'translate3d(0px, 0px, 0px)',
                    //   transition: 'transform 150ms ease 0s',
                    // };
                    // console.log(dragProvided.draggableProps.style);
                  }

                  return (
                    <AuthorWrapper
                      dragProvided={dragProvided}
                      dragSnapshot={dragSnapshot}
                      quote={quote}
                    />
                  );
                }}
              </Draggable>
            );
          })}
        </DropZone>
      </Container>
    );
  };

  render() {
    const { listId, listType, internalScroll, isCombineEnabled } = this.props;

    return (
      <Droppable
        droppableId={listId}
        type={listType}
        direction="horizontal"
        isCombineEnabled={isCombineEnabled}
      >
        {(
          dropProvided: DroppableProvided,
          dropSnapshot: DroppableStateSnapshot,
        ) => (
          <Wrapper
            isDraggingOver={dropSnapshot.isDraggingOver}
            {...dropProvided.droppableProps}
          >
            {internalScroll ? (
              <ScrollContainer>
                {this.renderBoard(dropProvided)}
              </ScrollContainer>
            ) : (
              this.renderBoard(dropProvided)
            )}
          </Wrapper>
        )}
      </Droppable>
    );
  }
}
