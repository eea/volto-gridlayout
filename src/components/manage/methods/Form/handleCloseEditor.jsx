import { getBlocksFieldname } from '@plone/volto/helpers';

const handleCloseEditor = ({ blockData, currentBlock, formData }) => {
  console.log('blockid in close', blockData);

  if (!blockData) {
    return {
      showModal: false,
      formData,
      currentBlock: null,
    };
  }

  const blockid = currentBlock;

  const blocksFieldname = getBlocksFieldname(formData);
  return {
    formData: {
      ...formData,
      [blocksFieldname]: {
        ...formData[blocksFieldname],
        [blockid]: blockData || null,
      },
    },
    showModal: false,
    preview: true,
  };
};

export default handleCloseEditor;
