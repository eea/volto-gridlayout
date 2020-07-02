// import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import {
  Button,
  Form as UiForm,
  Grid,
  List,
  Segment,
  Checkbox,
  Dropdown,
} from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { Portal } from 'react-portal';
import { Icon as VoltoIcon } from '@plone/volto/components';
import FormField from 'volto-mosaic/components/manage/FormField';
import checkIcon from '@plone/volto/icons/check.svg';

import onAddBlock from './methods/Form/onAddBlock';
import onShowBlock from './methods/Form/onShowBlock';
import onLayoutChange from './methods/Form/onLayoutChange';
import onRemoveItem from './methods/Form/onRemoveItem';
import onLayoutDelete from './methods/Form/onLayoutDelete';
import onLayoutSave from './methods/Form/onLayoutSave';
import handleCloseEditor from './methods/Form/handleCloseEditor';
import renderElement from './methods/Form/renderElement';
import onSubmitForm from './methods/Form/onSubmit';
import FormManager from './FormManager';
import GridLayout from './GridLayout';
import { connect } from 'react-redux';
import BlockEditor from './BlockEditor';

import { Field, SidebarPortal } from '@plone/volto/components'; // EditBlock
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

const Form = props => {
  if (!__CLIENT__) return '';
  const { formData } = props;
  const { schema } = props;
  const setFormData = props.setFormData;

  const [showModal, setShowModal] = useState({
      modal: false,
      currentBlock: null,
    }),
    [errors, setErrors] = useState({}),
    [previewBlocks, setPreviewBlocks] = useState(false);
  // [currentScreenSize, setCurrentScreenSize] = useState('lg');

  const handleOpen = blockid => {
    setShowModal({ modal: true, currentBlock: blockid });
  };

  const removeItem = i => {
    const removeItemData = onRemoveItem({
      id: i,
      formData,
      activeScreenSize: props.activeScreenSize,
    });

    // console.log('formData in remove', removeItemData);

    setFormData(removeItemData);
  };

  const getAvailableScreens = () => {
    const layouts = formData.blocks_layout?.grid_layout || {};
    const screens = props.availableScreens.map(el => {
      const res = Object.assign({}, el);
      const has = Object.keys(layouts).indexOf(el.value) > -1;
      // TODO: use appropriate icons, load fontawesome, something
      if (has) res.icon = <VoltoIcon name={checkIcon} size="10" />;
      return res;
    });
    return screens;
  };

  const updateFormData = fdata => {
    setFormData(fdata);
  };

  const onSubmit = event => {
    const submitData = onSubmitForm({
      event,
      schema,
      intl: props.intl,
      onSubmitForm: props.onSubmit,
      resetAfterSubmit: props.resetAfterSubmit,
      onUpdateForm: props.onUpdateForm,
      formData,
    });
    console.log('submitData', submitData);
    if (submitData.data.errors) {
      setErrors(submitData.errors);
    }
    if (submitData.data.formData) {
      setFormData(submitData.data.formData);
    }
    if (submitData.afterUpdate) {
      submitData.afterUpdate();
    }
  };

  // hack
  props.inputRef.current = {
    ...props,
    onSubmit,
  };

  return (
    <React.Fragment>
      <GridLayout
        previewBlocks={previewBlocks}
        formData={formData}
        handleOpen={handleOpen}
        removeItem={removeItem}
        setFormData={updateFormData}
        activeScreenSize={props.activeScreenSize}
      />
      <SidebarPortal selected>
        <FormField id="add-row" title="Add row">
          <Button
            onClick={() =>
              onAddBlock({
                formData,
                activeScreenSize: props.activeScreenSize,
                setFormData: updateFormData,
              })
            }
          >
            Add row
          </Button>
        </FormField>
        <FormField id="preview-control" title="Preview blocks">
          <Checkbox
            toggle
            id="preview-toggle"
            onChange={(ev, data) => {
              console.log('pvewi toggle', data);
              setPreviewBlocks(data.checked);
            }}
            label="Preview blocks"
          />
        </FormField>
        <FormField id="select-screensize" title="Select screen size">
          <Dropdown
            inline
            onChange={(event, data) => {
              props.setActiveScreenSize(data.value);
            }}
            options={getAvailableScreens()}
            selection
            value={props.activeScreenSize}
          />
        </FormField>
      </SidebarPortal>
      {showModal.modal ? (
        <BlockEditor
          blockid={showModal.currentBlock}
          formData={formData}
          onClose={blockData => {
            const handleCloseEditorData = handleCloseEditor({
              blockData,
              currentBlock: showModal.currentBlock,
              formData,
            });
            setFormData(handleCloseEditorData.formData);
            setShowModal({ ...showModal, modal: false });
          }}
        />
      ) : (
        ''
      )}
    </React.Fragment>
  );
};

export default connect(null)(
  injectIntl(FormManager(Form), { forwardRef: true }),
);
