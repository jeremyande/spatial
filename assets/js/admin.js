(function ($) {
  $(function () {
    const button = $('#gsv_select_media');
    const field = $('#gsv_default_ply_url');

    if (!button.length || !field.length || typeof wp === 'undefined' || !wp.media) {
      return;
    }

    let frame;

    button.on('click', function (e) {
      e.preventDefault();

      if (frame) {
        frame.open();
        return;
      }

      frame = wp.media({
        title: 'Select .ply file',
        button: {
          text: 'Use this file',
        },
        multiple: false,
      });

      frame.on('select', function () {
        const attachment = frame.state().get('selection').first().toJSON();
        if (attachment && attachment.url) {
          field.val(attachment.url);
        }
      });

      frame.open();
    });
  });
})(jQuery);
