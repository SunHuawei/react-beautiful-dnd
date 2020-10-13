// @flow
import React, { Component } from 'react';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { DragDropContext } from '../../../src';
import type { Quote } from '../types';
import AuthorList from '../primatives/author-list';
import reorder from '../reorder';
import { grid } from '../constants';
import type {
  DragUpdate,
  DragStart,
  DropResult,
  ResponderProvided,
} from '../../../src';

type Props = {|
  initial: Quote[],
  internalScroll?: boolean,
  isCombineEnabled?: boolean,
|};

type State = {|
  quotes: Quote[],
|};

const Root = styled.div`
  padding: ${grid}px;
  background: ${colors.B50};
`;

export default class AuthorApp extends Component<Props, State> {
  /* eslint-disable react/sort-comp */
  static defaultProps = {
    isCombineEnabled: false,
  };

  state: State = {
    quotes: this.props.initial,
    draggingIndex: -1,
  };
  /* eslint-enable react/sort-comp */

  onDragEnd = (result: DropResult) => {
    // super simple, just removing the dragging item
    if (result.combine) {
      const quotes: Quote[] = [...this.state.quotes];
      quotes.splice(result.source.index, 1);
      this.setState({ quotes });
      return;
    }

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      this.state.quotes.filter((q) => q.id !== 'placeholder'),
      result.source.index,
      result.destination.index,
    );

    this.setState({
      quotes,
    });
  };

  onDragStart = (start: DragStart, provided: ResponderProvided): void => {
    // console.log('========>', start, provided);
    const quotes = this.state.quotes.filter((q) => q.id !== 'placeholder');
    this.setState({
      draggingIndex: start.source.index,
      quotes: [
        ...quotes.slice(0, start.source.index),
        {
          id: 'placeholder',
        },
        ...quotes.slice(start.source.index),
      ],
    });
  };

  onDragUpdate = (update: DragUpdate, provided: ResponderProvided): void => {
    // console.log('update.destination.index2', update, provided);
    if (!update.destination) {
      return;
    }
    let targetIndex = update.destination.index;
    if (targetIndex > this.state.draggingIndex) {
      targetIndex += 1;
    }
    // console.log(
    //   'update.destination.index',
    //   update.destination.index,
    //   targetIndex,
    //   this.state.draggingIndex,
    // );
    const quotes = this.state.quotes.filter((q) => q.id !== 'placeholder');
    this.setState({
      quotes: [
        ...quotes.slice(0, targetIndex),
        {
          id: 'placeholder',
        },
        ...quotes.slice(targetIndex),
      ],
    });
  };

  render() {
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
      >
        <Root>
          <AuthorList
            listId="AUTHOR"
            internalScroll={this.props.internalScroll}
            isCombineEnabled={this.props.isCombineEnabled}
            quotes={this.state.quotes}
            draggingIndex={this.state.draggingIndex}
          />
        </Root>
      </DragDropContext>
    );
  }
}
