const GridLayout = {
    title: 'Grid layout controls',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'text', 'attachedimage', 'link'],
      },
    ],
  
    properties: {
      addBlock: {
        type: 'button',
        title: 'Add block',
      },
      text: {
        widget: 'richtext',
        title: 'Text',
      },
      link: {
        widget: 'object_by_path',
        title: 'Link',
      },
      attachedimage: {
        widget: 'attachedimage',
        title: 'Image',
      },
    },
  
    required: ['attachedimage'],
  };
  
  export default ImageCards;
  