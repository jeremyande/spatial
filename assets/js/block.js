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
              label: __('PLY URL', 'gsv'),
              value: attrs.src,
              onChange: function (v) {
                setAttributes({ src: v });
              },
            }),
            el(MediaUploadCheck, null, el(MediaUpload, {
              onSelect: function (media) {
                if (media && media.url) {
                  setAttributes({ src: media.url });
                }
              },
              allowedTypes: [],
              render: function (obj) {
                return el(components.Button, { variant: 'secondary', onClick: obj.open }, __('Select from Media Library', 'gsv'));
              },
            })),
            el(components.TextControl, {
              label: __('Height', 'gsv'),
              value: attrs.height,
              onChange: function (v) {
                setAttributes({ height: v });
              },
            }),
            el(components.ColorPalette, {
              value: attrs.background,
              onChange: function (v) {
                setAttributes({ background: v || '#000000' });
              },
            }),
            el(components.ToggleControl, {
              label: __('Enable controls', 'gsv'),
              checked: !!attrs.controls,
              onChange: function (v) {
                setAttributes({ controls: !!v });
              },
            }),
            el(components.ToggleControl, {
              label: __('Autoplay camera motion', 'gsv'),
              checked: !!attrs.autoplay,
              onChange: function (v) {
                setAttributes({ autoplay: !!v });
              },
            }),
            el(components.TextControl, {
              label: __('Fallback message', 'gsv'),
              value: attrs.fallback,
              onChange: function (v) {
                setAttributes({ fallback: v });
              },
            })
          )
        ),
        el(
          'div',
          {
            style: {
              height: attrs.height || '70vh',
              background: attrs.background || '#000000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
            },
          },
          attrs.src ? __('Gaussian Splat preview renders on frontend.', 'gsv') : __('Set a .ply URL in block settings.', 'gsv')
        )
      );
    },
