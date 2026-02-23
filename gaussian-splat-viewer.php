<?php
/**
 * Plugin Name: Gaussian Splat Viewer
 * Description: Display Gaussian Splat .ply scenes via shortcode or Gutenberg block.
 * Version: 0.1.0
 * Author: Your Name
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: gsv
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Gaussian_Splat_Viewer_Plugin {
    private const OPTION_KEY = 'gsv_settings';
    private const PAGE_SLUG = 'gsv-settings';

    public function __construct() {
        add_action('init', [$this, 'register_assets']);
        add_action('init', [$this, 'register_block']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_menu', [$this, 'register_settings_page']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);

        add_shortcode('gaussian_splat', [$this, 'render_shortcode']);
    }

    public function register_assets(): void {
        wp_register_style(
            'gsv-viewer-style',
            plugin_dir_url(__FILE__) . 'assets/css/viewer.css',
            [],
            '0.1.0'
        );

        wp_register_script(
            'gsv-frontend',
            plugin_dir_url(__FILE__) . 'assets/js/frontend.js',
            [],
            '0.1.0',
            true
        );

        wp_register_script(
            'gsv-block',
            plugin_dir_url(__FILE__) . 'assets/js/block.js',
            ['wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-i18n'],
            '0.1.0',
            true
        );

        wp_register_script(
            'gsv-admin',
            plugin_dir_url(__FILE__) . 'assets/js/admin.js',
            ['jquery'],
            '0.1.0',
            true
        );
    }

    public function register_block(): void {
        register_block_type('gsv/viewer', [
            'editor_script'   => 'gsv-block',
            'style'           => 'gsv-viewer-style',
            'render_callback' => [$this, 'render_block'],
            'attributes'      => [
                'src' => [
                    'type' => 'string',
                    'default' => '',
                ],
                'height' => [
                    'type' => 'string',
                    'default' => '70vh',
                ],
                'background' => [
                    'type' => 'string',
                    'default' => '#000000',
                ],
                'controls' => [
                    'type' => 'boolean',
                    'default' => true,
                ],
                'autoplay' => [
                    'type' => 'boolean',
                    'default' => false,
                ],
                'fallback' => [
                    'type' => 'string',
                    'default' => 'Your browser does not support this 3D viewer.',
                ],
            ],
        ]);
    }

    public function register_settings(): void {
        register_setting(
            self::OPTION_KEY,
            self::OPTION_KEY,
            [
                'sanitize_callback' => [$this, 'sanitize_settings'],
                'default' => [
                    'default_ply_url' => '',
                    'default_height' => '70vh',
                ],
                'show_in_rest' => false,
            ]
        );

        add_settings_section(
            'gsv_main_section',
            __('Default Viewer Settings', 'gsv'),
            function () {
                echo '<p>' . esc_html__('These defaults are used when shortcode/block attributes are omitted.', 'gsv') . '</p>';
            },
            self::PAGE_SLUG
        );

        add_settings_field(
            'gsv_default_ply_url',
            __('Default .ply URL', 'gsv'),
            [$this, 'render_default_ply_url_field'],
            self::PAGE_SLUG,
            'gsv_main_section'
        );

        add_settings_field(
            'gsv_default_height',
            __('Default Height', 'gsv'),
            [$this, 'render_default_height_field'],
            self::PAGE_SLUG,
            'gsv_main_section'
        );
    }

    public function sanitize_settings(array $input): array {
        $sanitized = [];
        $sanitized['default_ply_url'] = isset($input['default_ply_url']) ? esc_url_raw($input['default_ply_url']) : '';
        $sanitized['default_height'] = isset($input['default_height']) ? sanitize_text_field($input['default_height']) : '70vh';

        return $sanitized;
    }

    public function register_settings_page(): void {
        add_options_page(
            __('Gaussian Splat Viewer', 'gsv'),
            __('Gaussian Splat Viewer', 'gsv'),
            'manage_options',
            self::PAGE_SLUG,
            [$this, 'render_settings_page']
        );
    }

    public function enqueue_admin_assets(string $hook): void {
        if ($hook !== 'settings_page_' . self::PAGE_SLUG) {
            return;
        }

        wp_enqueue_media();
        wp_enqueue_script('gsv-admin');
    }

    public function render_settings_page(): void {
        if (!current_user_can('manage_options')) {
            return;
        }

        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Gaussian Splat Viewer', 'gsv'); ?></h1>
            <p><?php esc_html_e('Set defaults used by the shortcode and block when values are omitted.', 'gsv'); ?></p>
            <form action="options.php" method="post">
                <?php
                settings_fields(self::OPTION_KEY);
                do_settings_sections(self::PAGE_SLUG);
                submit_button();
                ?>
            </form>
            <h2><?php esc_html_e('Usage', 'gsv'); ?></h2>
            <p><code>[gaussian_splat src="https://example.com/file.ply" height="70vh" controls="true" autoplay="false"]</code></p>
        </div>
        <?php
    }

    public function render_default_ply_url_field(): void {
        $options = get_option(self::OPTION_KEY, []);
        $value = isset($options['default_ply_url']) ? $options['default_ply_url'] : '';

        ?>
        <input
            type="url"
            id="gsv_default_ply_url"
            name="<?php echo esc_attr(self::OPTION_KEY); ?>[default_ply_url]"
            value="<?php echo esc_attr($value); ?>"
            class="regular-text"
            placeholder="https://example.com/my-splat.ply"
        />
        <button type="button" class="button" id="gsv_select_media"><?php esc_html_e('Select from Media Library', 'gsv'); ?></button>
        <p class="description"><?php esc_html_e('Choose a .ply file from your Media Library, or paste a URL.', 'gsv'); ?></p>
        <?php
    }

    public function render_default_height_field(): void {
        $options = get_option(self::OPTION_KEY, []);
        $value = isset($options['default_height']) ? $options['default_height'] : '70vh';

        ?>
        <input
            type="text"
            id="gsv_default_height"
            name="<?php echo esc_attr(self::OPTION_KEY); ?>[default_height]"
            value="<?php echo esc_attr($value); ?>"
            class="regular-text"
            placeholder="70vh"
        />
        <p class="description"><?php esc_html_e('Any valid CSS height value (e.g., 70vh, 800px).', 'gsv'); ?></p>
        <?php
    }

    public function render_shortcode($atts): string {
        $atts = shortcode_atts([
            'src' => '',
            'height' => '',
            'background' => '#000000',
            'controls' => 'true',
            'autoplay' => 'false',
            'fallback' => 'Your browser does not support this 3D viewer.',
        ], $atts, 'gaussian_splat');

        return $this->render_viewer([
            'src' => $atts['src'],
            'height' => $atts['height'],
            'background' => $atts['background'],
            'controls' => filter_var($atts['controls'], FILTER_VALIDATE_BOOLEAN),
            'autoplay' => filter_var($atts['autoplay'], FILTER_VALIDATE_BOOLEAN),
            'fallback' => $atts['fallback'],
        ]);
    }

    public function render_block(array $attributes): string {
        return $this->render_viewer($attributes);
    }

    private function render_viewer(array $args): string {
        $defaults = get_option(self::OPTION_KEY, []);

        $src = isset($args['src']) && !empty($args['src'])
            ? esc_url($args['src'])
            : esc_url($defaults['default_ply_url'] ?? '');

        $height = isset($args['height']) && !empty($args['height'])
            ? sanitize_text_field($args['height'])
            : sanitize_text_field($defaults['default_height'] ?? '70vh');

        $background = isset($args['background']) ? sanitize_hex_color($args['background']) : '#000000';
        if (empty($background)) {
            $background = '#000000';
        }

        $controls = !empty($args['controls']);
        $autoplay = !empty($args['autoplay']);
        $fallback = isset($args['fallback']) ? sanitize_text_field($args['fallback']) : 'Your browser does not support this 3D viewer.';

        if (empty($src)) {
            return '<div class="gsv-missing-src">' . esc_html__('No .ply file set. Add one in plugin settings or via shortcode/block.', 'gsv') . '</div>';
        }

        wp_enqueue_style('gsv-viewer-style');
        wp_enqueue_script('gsv-frontend');

