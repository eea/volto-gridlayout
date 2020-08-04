/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

import { setMosaicWidth } from 'volto-mosaic/actions';
// import sizeMe, { SizeMe } from 'react-sizeme';
import { withSize } from 'react-sizeme';
import { connect } from 'react-redux';
import BlockViewWrapper from '../theme/BlockViewWrapper';
import RenderEditBlockPlaceholder from './methods/Form/RenderEditBlockPlaceholder';
import RowPlaceholder from './methods/Form/RowPlaceholder';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Resizable, ResizableBox } from 'react-resizable';
import onChangeWidth from './methods/Form/onChangeWidth';
import { unflattenToHTML } from 'volto-gridlayout/helpers';
import { widthClass } from 'volto-gridlayout/constants';

const grid = 12;
// Needed for SSR, see See https://github.com/ctrlplusb/react-sizeme
withSize.noPlaceholders = true;

const getListStyle = (isDraggingOver, grid_layout, currentItemId) => ({
  background: isDraggingOver ? 'lightblue' : 'transparent',
  padding: 0,
  position: 'relative',
});

const range = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 0,
  margin: `0 0 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'transparent',
  // styles we need to apply on draggables
  ...draggableStyle,
});

function RenderItems({
  formData,
  handleOpen,
  removeItem,
  parentId,
  gridWidth,
  setFormData,
  items,
  previewBlocks,
  activeScreenSize,
}) {
  const blocksLayoutFieldname = getBlocksLayoutFieldname();
  const snapOneWidth = gridWidth / grid;
  const gridRange = range(1, grid);
  const snapWidths = gridRange.map(step => step * snapOneWidth);
  const columnsWidths = gridRange.reduce((acc, val) => {
    acc[val] = val * snapOneWidth;
    return acc;
  }, {});

  // const [localFormData, setLocalFormData] = useState(formData);
  // useEffect(() => {
  //   console.log('in useffect', localFormData);
  //   setFormData(localFormData);
  // }, [localFormData]);

  let gridItems = items;

  if (!gridItems) {
    gridItems = unflattenToHTML({
      blocks_layout: formData[blocksLayoutFieldname],
      activeScreenSize,
    });
  }

  const grid_layout =
    formData[blocksLayoutFieldname].grid_layout[activeScreenSize];
  console.log('griditemslength', grid_layout);
  // const columnsBasedOnWidth =
  return gridItems.map(({ children, data }) => (
    <div
      id={data.id}
      className={
        data.className === 'row'
          ? data.className
          : 'column' + formData.blocks_layout.classMapping[data.id]
      }
      position={data.position}
    >
      <Droppable
        key={data.position}
        droppableId={data.id}
        id={data.id}
        direction="horizontal"
        isCombineEnabled={true}
        className={
          data.className === 'row'
            ? data.className
            : 'column' + formData.blocks_layout.classMapping[data.id]
        }
        position={data.position}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver, grid_layout, data.id)}
            {...provided.droppableProps}
            // style={{

            // }}
          >
            {data.type === 'row' ? (
              <RowPlaceholder
                formData={formData}
                blockLayout={data}
                handleOpen={handleOpen}
                removeItem={removeItem}
                activeScreenSize={activeScreenSize}
                setFormData={setFormData}
              >
                {children.length ? (
                  <RenderItems
                    items={children}
                    formData={formData}
                    parentId={data.parentId}
                    handleOpen={handleOpen}
                    removeItem={removeItem}
                    gridWidth={gridWidth}
                    setFormData={setFormData}
                    previewBlocks={previewBlocks}
                    activeScreenSize={activeScreenSize}
                  />
                ) : (
                  ''
                )}
                {provided.placeholder}
              </RowPlaceholder>
            ) : (
              <React.Fragment>
                <ResizableBox
                  width={columnsWidths[data.width]}
                  axis="x"
                  // snap={{ x: [12] }}
                  onResizeStart={(e, d) => {
                    const beforeWidth = columnsWidths[data.width];
                    const afterWidth = d.size.width;
                    setFormData(
                      onChangeWidth({
                        beforeWidth,
                        afterWidth,
                        columnWidth: data.width,
                        formData: formData,
                        blockLayout: data,
                        columnsWidths,
                        snapWidths,
                        activeScreenSize,
                      }),
                    );
                    return d;
                  }}
                  onResizeStop={(e, d) => {
                    const beforeWidth = columnsWidths[data.width];
                    const afterWidth = d.size.width;
                    setFormData(
                      onChangeWidth({
                        beforeWidth,
                        afterWidth,
                        columnWidth: data.width,
                        formData: formData,
                        blockLayout: data,
                        columnsWidths,
                        snapWidths,
                        activeScreenSize,
                      }),
                    );
                    // return d;
                  }}
                >
                  <Draggable
                    key={data.id}
                    draggableId={data.id}
                    index={parseInt(data.position)}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                      >
                        {!previewBlocks ? (
                          <RenderEditBlockPlaceholder
                            formData={formData}
                            blockLayout={data}
                            handleOpen={handleOpen}
                            removeItem={removeItem}
                            parentId={parentId || data.parentId || data.id}
                          />
                        ) : (
                          <BlockViewWrapper
                            style={{ maxWidth: '100%' }}
                            blockid={data.id}
                            formData={formData}
                            className={'column'}
                            // className={`type-${blocksField[item.i]?.['@type']}`}
                            // showUpdate={this.onBlockShowUpdate}
                            // containerWidth={this.state.containerWidth}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                </ResizableBox>
                {provided.placeholder}
              </React.Fragment>
            )}
          </div>
        )}
      </Droppable>
    </div>
  ));
}

const moveItemInArrayFromIndexToIndex = ({
  array,
  fromIndex,
  toIndex,
  differentRow,
}) => {
  if (fromIndex === toIndex) return array;

  const newArray = [...array];

  const target = newArray[fromIndex];
  const inc = toIndex < fromIndex ? -1 : 1;

  for (let i = fromIndex; i !== toIndex; i += inc) {
    newArray[i] = newArray[i + inc];
  }

  newArray[toIndex] = target;
  return newArray.map(item => {
    const newPosition = newArray.indexOf(item);
    return {
      ...item,
      position: newPosition,
      parentId:
        differentRow && toIndex === newPosition ? differentRow : item.parentId,
    };
  });
};

const GridLayout = ({
  formData,
  handleOpen,
  removeItem,
  setFormData,
  setMosaicWidth,
  gridWidth,
  size,
  previewBlocks,
  activeScreenSize,
}) => {
  const onDragEnd = result => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sInd = source.droppableId;
    const dInd = destination.droppableId;
    const destIndex = destination.index;
    const sourceIndex = source.index;

    const destItem = formData.blocks_layout.grid_layout[activeScreenSize].find(
      item => item.id === dInd,
    );
    const destRow = destItem?.parentId || destItem?.id;
    const sourceRow = formData.blocks_layout.grid_layout[activeScreenSize].find(
      item => item.id === sInd,
    )?.parentId;

    if (sInd === dInd) {
      console.log('sInd === dInd', result);
    } else {
      let newGridLayout = JSON.parse(
        JSON.stringify(formData.blocks_layout.grid_layout[activeScreenSize]),
      );
      if (destRow === sourceRow) {
        console.log('samerow');
        newGridLayout = moveItemInArrayFromIndexToIndex({
          array: newGridLayout,
          fromIndex: sourceIndex,
          toIndex: destIndex,
        });
        // formData.blocks_layout.grid_layout.map(item => {
        //   if (item.parentId === destRow) {
        //     return {
        //       ...item,
        //       position: getNewPosition(item.position, destIndex, sourceIndex),
        //     };
        //   }
        //   return item;
        // });
      } else {
        console.log('in else', destRow, sourceRow);
        if (destRow) {
          newGridLayout = moveItemInArrayFromIndexToIndex({
            array: newGridLayout,
            fromIndex: sourceIndex,
            toIndex: destIndex,
            differentRow: destRow,
          });
        }
      }

      console.log('newgridlayout', newGridLayout);
      setFormData({
        ...formData,
        blocks_layout: {
          ...formData.blocks_layout,
          grid_layout: {
            ...formData.blocks_layout.grid_layout,
            [activeScreenSize]: newGridLayout,
          },
        },
      });
      console.log('sInd !=== dInd', result);
      // setState(newState.filter(group => group.length));
    }
  };

  const onBeforeCapture = useCallback(result => {
    // console.log('onBeforeCapture', result);
  }, []);
  const onBeforeDragStart = useCallback(result => {
    // console.log('onBeforeDragStart', result);
  }, []);
  const onDragStart = useCallback(result => {
    // console.log('onDragStart', result);
    // debugger;
  }, []);
  const onDragUpdate = useCallback(result => {
    // console.log('onDragUpdate', result);
  }, []);

  useLayoutEffect(() => {
    if (!gridWidth && size.width) {
      setMosaicWidth(size.width);
    }
    if (size.width && gridWidth && size.width !== gridWidth) {
      setMosaicWidth(size.width);
    }
  }, [size.width]);

  console.log('in grid layout', gridWidth, size.width);

  return (
    <div className={`grid-layout layout-${activeScreenSize}`}>
      <DragDropContext
        onBeforeCapture={onBeforeCapture}
        onBeforeDragStart={onBeforeDragStart}
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <RenderItems
          formData={formData}
          handleOpen={handleOpen}
          removeItem={removeItem}
          gridWidth={gridWidth}
          previewBlocks={previewBlocks}
          activeScreenSize={activeScreenSize}
          // width={() => {
          //   console.log('in width');

          // }}
          setFormData={setFormData}
        />
      </DragDropContext>
    </div>
  );
};

// export default View;
export default connect(
  (state, props) => ({
    gridWidth: state.mosaic_width.items,
  }),
  { setMosaicWidth },
)(withSize()(GridLayout));
// withSize()(MyComponent)
