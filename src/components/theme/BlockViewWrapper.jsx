import React, { Component } from 'react';
import { blocks } from '~/config'; // settings,

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import { Helmet } from '@plone/volto/helpers';


import _ from 'lodash';
import sizeMe, { SizeMe } from 'react-sizeme';

// Needed for SSR, see See https://github.com/ctrlplusb/react-sizeme
sizeMe.noPlaceholders = true;
export class BlockViewWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ref: props.useref || React.createRef(),
    };

  }

  render() {
    const { formData, blockid, className } = this.props;

    const blocksFieldname = getBlocksFieldname(formData);

    if (!formData[blocksFieldname]) {
      return <div>The content for this mosaic view is not blocks-enabled</div>;
    }
    const blockData = formData[blocksFieldname][blockid];
    // console.log(
    //   'formdata',
    //   formData,
    //   'blocksfieldname',
    //   blocksFieldname,
    //   'blockid',
    //   blockid,
    // );
    if (!blockData) {
      console.warn(
        'no block data for blockid',
        blockid,
        formData[blocksFieldname],
      );
      return '';
    }
    const blocktype = blockData['@type'].toLowerCase();

    if (!blocks.blocksConfig[blocktype]) {
      console.warn('Block configuration not found', blocktype);
      return '';
    }

    let Block = null;
    Block = blocks.blocksConfig[blocktype].view;

    let style = blockData.mosaic_box_style || 'default-block';
    let klass = 'block-wrapper ' + style + ' ' + className;

    return Block !== null ? (
      <div className="block-container" ref={this.state.ref}>
        <div className={klass}>
          {blockData.block_title && blockData.show_block_title && (
            <h5 className="title-title">{blockData.block_title}</h5>
          )}
          <Block key={blockid} properties={formData} data={blockData} />
        </div>
      </div>
    ) : (
      <div> {JSON.stringify(blocktype)} </div>
    );
  }
}

export default BlockViewWrapper;
