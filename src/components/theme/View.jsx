import { connect } from 'react-redux';
import { breakpoints, rowHeight } from '../../constants';
import React, { useEffect } from 'react';
import { blocks } from '~/config'; // settings,
import { BodyClass } from '@plone/volto/helpers';
import BlockViewWrapper from './BlockViewWrapper';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import { Helmet } from '@plone/volto/helpers';
import { unflattenToHTML } from 'volto-gridlayout/helpers';
import { widthClass } from 'volto-gridlayout/constants';

const computeClassNames = formData => {
  // const blocksLayoutFieldname = getBlocksLayoutFieldname();
  // Object.keys(formData[blocksLayoutFieldname].classMapping).forEach(key => {
  //   console.log('keys', key);
  //   Object.keys(formData[blocksLayoutFieldname].classMapping[key]).forEach(
  //     blockId => {
  //       let gridItem =
  //         formData[blocksLayoutFieldname].grid_layout[key]
  //           .filter(item => item.className !== 'row')
  //           .find(item => item.id === blockId) || null;
  //       console.log('griditem', gridItem);
  //       if (gridItem) {
  //         const gridItemIndex = formData[blocksLayoutFieldname].grid_layout[
  //           key
  //         ].indexOf(gridItem);

  //         gridItem = {
  //           ...gridItem,
  //           className: `${gridItem.className} ${key}-${
  //             widthClass[gridItem.width]
  //           }`,
  //         };
  //         formData[blocksLayoutFieldname].grid_layout[key][gridItemIndex] = {
  //           ...formData[blocksLayoutFieldname].grid_layout[key][gridItemIndex],
  //           ...gridItem,
  //         };
  //       }
  //       console.log(gridItem);
  //     },
  //   );
  // });
  return formData;
};

const RenderItems = ({ items, formData }) => {
  const blocksLayoutFieldname = getBlocksLayoutFieldname();

  let gridItems = items;

  formData = computeClassNames(formData);

  if (!gridItems) {
    gridItems = unflattenToHTML({
      blocks_layout: formData[blocksLayoutFieldname],
      activeScreenSize: 'lg',
    });
  }

  return gridItems.map(({ children, data }) => (
    <div
      id={data.id}
      className={
        data.className === 'row'
          ? data.className
          : formData.blocks_layout.classMapping[data.id]
      }
      position={data.position}
    >
      {data.type === 'row' || data.type === 'empty-column' ? (
        <div
          className={
            data.type === 'empty-column'
              ? 'column ' + formData.blocks_layout.classMapping[data.id]
              : data.className
          }
        >
          {children.length && (
            <RenderItems items={children} formData={formData} />
          )}
        </div>
      ) : (
        <React.Fragment>
          <BlockViewWrapper
            style={{ maxWidth: '100%' }}
            blockid={data.id}
            formData={formData}
            className={'column'}
            // className={`type-${blocksField[item.i]?.['@type']}`}
            // showUpdate={this.onBlockShowUpdate}
            // containerWidth={this.state.containerWidth}
          />
        </React.Fragment>
      )}
    </div>
  ));
};

const GridLayoutView = props => {
  console.log('in grid layout view');
  useEffect(() => {
    require('../../css/grid-layout.less');
  }, []);
  return (
    <div className="grid-layout view">
      <RenderItems formData={props.content} />
    </div>
  );
};

// export default View;
export default connect((state, props) => ({
  content:
    state.prefetch?.[state.router.location.pathname] || state.content.data,
  pathname: state.router.location.pathname, //props.location.pathname,
}))(GridLayoutView);
