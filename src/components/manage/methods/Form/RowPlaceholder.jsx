import React from 'react';
import { blocks } from '~/config';
import { Radio, Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components'; // EditBlock
import deleteIcon from '@plone/volto/icons/delete.svg';
import editIcon from '@plone/volto/icons/editing.svg';
import { getBlocksFieldname } from '@plone/volto/helpers';
import onAddBlock from './onAddBlock'

const renderRowPlaceholder = ({
  children,
  blockLayout,
  formData,
  removeItem,
  activeScreenSize,
  setFormData
}) => {
  // console.log('row props', children, blockLayout, parentId, formData, addBlock);
  const currentRowItems = formData.blocks_layout.grid_layout[
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

  return (
    <React.Fragment>
      <Button
        size="mini"
        icon
        color="green"
        style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        onClick={() =>
          onAddBlock({
            type: 'text',
            formData,
            className: 'column',
            position: position,
            parentId: blockLayout.id,
            width: 6,
            activeScreenSize,
            setFormData,
          })
        }
      >
        Add column
      </Button>
      <Button
        size="mini"
        icon
        color="red"
        style={{ position: 'absolute', top: '1rem', left: '1rem' }}
        onClick={() => removeItem(currentRowItemsIds)}
      >
        Remove row
      </Button>
      {children}
    </React.Fragment>
  );
};
export default renderRowPlaceholder;
