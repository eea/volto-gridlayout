import React from 'react';
import { blocks } from '~/config';
import { Button } from 'semantic-ui-react';
import deleteIcon from '@plone/volto/icons/delete.svg';
import editIcon from '@plone/volto/icons/editing.svg';
import { getBlocksFieldname } from '@plone/volto/helpers';
import onAddBlock from './onAddBlock';
import { Icon } from '@plone/volto/components'; // EditBlock
import addIcon from '@plone/volto/icons/add.svg';
import { getBlocksLayoutFieldname } from '@plone/volto/helpers';

const RenderEditBlockPlaceholder = ({
  blockLayout,
  formData,
  removeItem,
  handleOpen,
  addBlock,
  parentId,
  activeScreenSize,
  setFormData,
}) => {
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);

  const blocksFieldname = getBlocksFieldname(formData);
  const { id } = blockLayout;
  let block = formData[blocksFieldname][id];
  const hasData = block?.['@type'] !== 'text';

  // console.log('row props', children, blockLayout, parentId, formData, addBlock);
  const currentRowItems = formData[blocksLayoutFieldname].grid_layout[
    activeScreenSize
  ].filter(item => item.parentId === blockLayout.id);
  let position = 0;
  let currentRowItemsIds = [blockLayout.id];
  if (currentRowItems.length) {
    position =
      Math.max(...currentRowItems.map(item => parseInt(item.position))) + 1;
    currentRowItemsIds = [
      ...currentRowItemsIds,
      ...currentRowItems.map(item => item.id),
    ];
  }

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
          <Icon
            onClick={() =>
              onAddBlock({
                type: 'row',
                formData,
                className: 'row',
                position: position,
                parentId: blockLayout.id,
                activeScreenSize,
                setFormData,
              })
            }
            name={addIcon}
            size="20"
          />
          <Icon
            onClick={() => removeItem(currentRowItemsIds)}
            name={deleteIcon}
            size="20"
          />
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
