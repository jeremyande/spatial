(function (blocks, element, components, blockEditor, i18n) {
  const el = element.createElement;
  const __ = i18n.__;
  const InspectorControls = blockEditor.InspectorControls;
  const MediaUpload = blockEditor.MediaUpload;
  const MediaUploadCheck = blockEditor.MediaUploadCheck;

  blocks.registerBlockType('gsv/viewer', {
    title: __('Gaussian Splat Viewer', 'gsv'),
    icon: 'format-image',
    category: 'media',
    attributes: {
      src: { type: 'string', default: '' },
      height: { type: 'string', default: '70vh' },
      background: { type: 'string', default: '#000000' },
      controls: { type: 'boolean', default: true },
      autoplay: { type: 'boolean', default: false },
      fallback: {
        type: 'string',
        default: 'Your browser does not support this 3D viewer.',
      },
    },

    edit: function (props) {
      const attrs = props.attributes;
      const setAttributes = props.setAttributes;

      return el(
        'div',
        { className: 'gsv-block-editor' },
        el(
          InspectorControls,
          null,
          el(
            components.PanelBody,
            { title: __('Viewer Settings', 'gsv'), initialOpen: true },
            el(components.TextControl, {
              label: __('PLY File URL', 'gsv'),
              value: attrs.src,
              onChange: (value) => setAttributes({ src: value }),
            }),
            el(MediaUploadCheck, null,
              el(MediaUpload, {
                onSelect: (media) => setAttributes({ src: media.url || '' }),
                allowedTypes: ['application/octet-stream', 'text/plain'],
                render: ({ open }) =>
                  el(
                    components.Button,
                    { isSecondary: true, onClick: open },
                    __('Select from Media Library', 'gsv')
                  ),
              })
            ),
            el(components.TextControl, {
              label: __('Height', 'gsv'),
              value: attrs.height,
              onChange: (value) => setAttributes({ height: value }),
              help: __('Example: 70vh or 800px', 'gsv'),
            }),
            el(components.ColorPalette, {
              value: attrs.background,
              onChange: (value) => setAttributes({ background: value || '#000000' }),
            }),
            el(components.ToggleControl, {
              label: __('Enable controls', 'gsv'),
              checked: attrs.controls,
              onChange: (value) => setAttributes({ controls: value }),
            }),
            el(components.ToggleControl, {
              label: __('Autoplay camera motion', 'gsv'),
              checked: attrs.autoplay,
              onChange: (value) => setAttributes({ autoplay: value }),
            }),
            el(components.TextControl, {
              label: __('Fallback message', 'gsv'),
              value: attrs.fallback,
              onChange: (value) => setAttributes({ fallback: value }),
            })
          )
        ),
        el(
          'div',
          {
            style: {
              width: '100%',
              minHeight: attrs.height || '70vh',
              background: attrs.background || '#000000',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #1f1f1f',
              padding: '16px',
              textAlign: 'center',
            },
          },
          attrs.src
            ? __('Gaussian Splat viewer will render on the front end.', 'gsv')
            : __('Select a .ply file URL or pick one from Media Library.', 'gsv')
        )
      );
    },

    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.element, window.wp.components, window.wp.blockEditor, window.wp.i18n);
