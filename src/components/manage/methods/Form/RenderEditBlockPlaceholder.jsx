import React from 'react';
import { blocks } from '~/config';
import { Radio, Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components'; // EditBlock
import deleteIcon from '@plone/volto/icons/delete.svg';
import editIcon from '@plone/volto/icons/editing.svg';
import { getBlocksFieldname } from '@plone/volto/helpers';

const RenderEditBlockPlaceholder = ({
  blockLayout,
  formData,
  removeItem,
  handleOpen,
  addBlock,
  parentId,
}) => {
  const blocksFieldname = getBlocksFieldname(formData);
  const { id } = blockLayout;
  let block = formData[blocksFieldname][id];
  const hasData = block?.['@type'] !== 'text';

  let title = '';

  if (!blocks.blocksConfig[(block?.['@type'])]) {
    console.warn(
      'could not find configuration for this block type',
      block?.['@type'],
    );
    title = 'broken block';
  } else {
    title = blocks.blocksConfig[(block?.['@type'])].title;
  }

  return (
    <div
      className={hasData ? 'block-edit-wrapper empty' : 'block-edit-wrapper'}
    >
      <div>
        {/* <div className="block-size-info">cols: {blockLayout.width}</div> */}
        <div>
          <h4>
            {title} - {blockLayout.position} - {blockLayout.width}
          </h4>
        </div>
        <div className="block-edit-controls">
          <Button basic color="blue" icon onClick={() => handleOpen(id)}>
            <Icon name={editIcon} size="20" />
          </Button>
          <Button basic color="red" icon onClick={() => removeItem(id)}>
            <Icon name={deleteIcon} size="20" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default RenderEditBlockPlaceholder;
