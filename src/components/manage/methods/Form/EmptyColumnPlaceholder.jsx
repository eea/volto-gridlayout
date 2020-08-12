import React from 'react';
import deleteIcon from '@plone/volto/icons/delete.svg';
import addIcon from '@plone/volto/icons/add.svg';
import onAddBlock from './onAddBlock';
import { Icon } from '@plone/volto/components'; // EditBlock
import { getBlocksLayoutFieldname } from '@plone/volto/helpers';
import { Button } from 'semantic-ui-react';

const renderRowPlaceholder = ({
  children,
  blockLayout,
  formData,
  removeItem,
  activeScreenSize,
  setFormData,
}) => {
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);

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

  return <React.Fragment>{children}</React.Fragment>;
};
export default renderRowPlaceholder;
