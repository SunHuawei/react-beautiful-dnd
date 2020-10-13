// @flow
import { type Rect } from 'css-box-model';
import type {
  DraggableId,
  DraggableDimension,
  DroppableDimension,
  DragImpact,
  Axis,
  DisplacementGroups,
  Viewport,
  DisplacedBy,
  LiftEffect,
} from '../../types';
import getDisplacedBy from '../get-displaced-by';
import removeDraggableFromList from '../remove-draggable-from-list';
import isHomeOf from '../droppable/is-home-of';
import { find } from '../../native-with-fallback';
import getDidStartAfterCritical from '../did-start-after-critical';
import calculateReorderImpact from '../calculate-drag-impact/calculate-reorder-impact';
import getIsDisplaced from '../get-is-displaced';

type Args = {|
  pageBorderBoxWithDroppableScroll: Rect,
  draggable: DraggableDimension,
  destination: DroppableDimension,
  insideDestination: DraggableDimension[],
  last: DisplacementGroups,
  viewport: Viewport,
  afterCritical: LiftEffect,
|};

type AtIndexArgs = {|
  draggable: DraggableDimension,
  closest: ?DraggableDimension,
  inHomeList: boolean,
|};

export default ({
  pageBorderBoxWithDroppableScroll: targetRect,
  draggable,
  destination,
  insideDestination,
  last,
  viewport,
  afterCritical,
}: Args): DragImpact => {
  const displacedBy: DisplacedBy = getDisplacedBy(
    destination.axis,
    draggable.displaceBy,
  );

  const targetLeft: number = targetRect.left;
  const targetTop: number = targetRect.top;
  const targetRight: number = targetRect.right;
  const targetBottom: number = targetRect.bottom;

  let newIndex = null;
  for (let i = 0; i < insideDestination.length; i++) {
    const child = insideDestination[i];
    const id: DraggableId = child.descriptor.id;
    const didStartAfterCritical: boolean = getDidStartAfterCritical(
      id,
      afterCritical,
    );

    const childCenterXY: number = child.page.borderBox.center;
    if (didStartAfterCritical) {
      if (targetRight > childCenterXY.x && targetBottom > childCenterXY.y) {
        newIndex = i;
        // No break, try to find the last one to meet this rule
      }
    } else if (targetLeft < childCenterXY.x && targetTop < childCenterXY.y) {
      newIndex = i;
      break;
    }
  }

  // TODO: index cannot be null?
  // otherwise return null from there and return empty impact
  // that was calculate reorder impact does not need to account for a null index
  return calculateReorderImpact({
    draggable,
    insideDestination,
    destination,
    viewport,
    last,
    displacedBy,
    index: newIndex,
  });
};
