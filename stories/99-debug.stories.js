// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { slidesOnDeck, sections } from './slidesOnDeckMockData';
import Deck from './Deck';
// import { Draggable, Droppable, DragDropContext } from '../src';

class App extends React.Component<*> {
  render() {
    return <Deck slidesOnDeck={slidesOnDeck} sections={sections} />;
  }
}

storiesOf('Troubleshoot example', module).add('debug example', () => <App />);
