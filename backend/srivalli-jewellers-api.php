<?php
/**
 * Srivalli Jewellers – WordPress backend (demo)
 * =============================================
 *
 * HOW TO INSTALL
 * 1. In WordPress go to Plugins → Add New, install and activate "Code Snippets".
 * 2. Snippets → Add New. Title: "Srivalli Jewellers API".
 * 3. Paste everything BELOW the "<?php" line above into the code box.
 * 4. Choose "Run snippet everywhere", then click "Save Changes and Activate".
 *    No permalink change is needed – this works with "Plain" permalinks too.
 *
 * The React app talks to:  https://YOUR-SITE.com/?rest_route=/srivalli/v1
 * (the ?rest_route= form works with every permalink setting, so your other
 *  snippets and URLs are not affected).
 *
 * AUTHENTICATION (simple, demo-level)
 * - Users log in with their normal WordPress username (or email) and password.
 * - The API returns a token. The app sends it back on every request in the
 *   "X-SJ-Token" header. Tokens last 30 days; logging out deletes the token.
 * - New accounts can sign up from the app (they become WordPress "Subscribers").
 *   Set SJ_ALLOW_REGISTRATION to false below to turn sign-up off.
 *
 * DATA
 * - Each product is a private "sj_product" post owned by the user who created it
 *   (post_author). Every endpoint checks ownership, so a user can never read,
 *   edit or delete another user's product. Admins can see all products in
 *   wp-admin under "Jewellery Items".
 * - "Delete" moves an item to Deleted Items (soft delete), like the app did before.
 * - Uploaded photos are saved to the WordPress Media Library.
 *
 * ENDPOINTS (all under ?rest_route=/srivalli/v1 – e.g. ?rest_route=/srivalli/v1/products)
 *   POST   /auth/login        { username, password }            → { token, user }
 *   POST   /auth/register     { name, username, email, password } → { token, user }
 *   GET    /auth/me                                              → { user }
 *   POST   /auth/logout
 *   GET    /products          ?status=all|active|deleted (default all)
 *   POST   /products          create
 *   GET    /products/{id}
 *   PUT    /products/{id}     update (only fields you send are changed)
 *   DELETE /products/{id}     move to Deleted Items
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

if ( ! defined( 'SJ_ALLOW_REGISTRATION' ) ) {
	define( 'SJ_ALLOW_REGISTRATION', true ); // allow sign-up from the app
}
if ( ! defined( 'SJ_TOKEN_DAYS' ) ) {
	define( 'SJ_TOKEN_DAYS', 30 ); // how long a login stays valid
}
if ( ! defined( 'SJ_MAX_IMAGE_MB' ) ) {
	define( 'SJ_MAX_IMAGE_MB', 5 ); // max size of an uploaded product photo
}

/** Same lists as src/utils/constants.js in the React app. */
function sj_categories() {
	return array(
		'Ring'     => array( 'Wedding Ring', 'Engagement Ring', 'Casual Ring' ),
		'Necklace' => array( 'Short Necklace', 'Long Necklace', 'Choker' ),
		'Bangle'   => array( 'Plain Bangle', 'Stone Bangle', 'Kada' ),
		'Chain'    => array( 'Gold Chain', 'Mangalsutra Chain' ),
		'Earring'  => array( 'Stud', 'Jhumka', 'Drop' ),
		'Pendant'  => array( 'Religious', 'Designer' ),
		'Bracelet' => array( 'Kids', 'Adult' ),
		'Anklet'   => array( 'Plain', 'Designer' ),
		'Coin'     => array( 'Gold Coin', 'Silver Coin' ),
		'Other'    => array( 'Miscellaneous' ),
	);
}

function sj_carats() {
	return array(
		'Gold'   => array( '18K', '22K', '24K' ),
		'Silver' => array( 'Silver 925' ),
	);
}

/* ------------------------------------------------------------------ */
/* Product storage: private custom post type                           */
/* ------------------------------------------------------------------ */

add_action( 'init', 'sj_register_product_post_type' );

function sj_register_product_post_type() {
	register_post_type(
		'sj_product',
		array(
			'labels'              => array(
				'name'          => 'Jewellery Items',
				'singular_name' => 'Jewellery Item',
			),
			'public'              => false,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'show_ui'             => true,  // admins can browse items in wp-admin
			'show_in_menu'        => true,
			'show_in_rest'        => false, // never exposed through /wp/v2
			'menu_icon'           => 'dashicons-star-filled',
			'supports'            => array( 'title', 'author' ),
			'capability_type'     => 'post',
			'map_meta_cap'        => true,
		)
	);
}

/* Extra columns in wp-admin → Jewellery Items */
add_filter( 'manage_sj_product_posts_columns', 'sj_admin_columns' );
add_action( 'manage_sj_product_posts_custom_column', 'sj_admin_column_value', 10, 2 );

function sj_admin_columns( $columns ) {
	$columns['sj_unique_id'] = 'Unique Number';
	$columns['sj_details']   = 'Details';
	$columns['sj_state']     = 'State';
	return $columns;
}

function sj_admin_column_value( $column, $post_id ) {
	if ( 'sj_unique_id' === $column ) {
		echo esc_html( get_post_meta( $post_id, '_sj_unique_id', true ) );
	} elseif ( 'sj_details' === $column ) {
		echo esc_html(
			trim(
				get_post_meta( $post_id, '_sj_category', true ) . ' · ' .
				get_post_meta( $post_id, '_sj_carat', true ) . ' · ' .
				get_post_meta( $post_id, '_sj_net_weight', true ) . ' g'
			)
		);
	} elseif ( 'sj_state' === $column ) {
		echo get_post_meta( $post_id, '_sj_deleted_at', true ) ? 'Deleted' : 'Active';
	}
}

/* ------------------------------------------------------------------ */
/* CORS: allow the app's token header                                  */
/* ------------------------------------------------------------------ */

add_filter( 'rest_allowed_cors_headers', 'sj_allow_token_header' );

function sj_allow_token_header( $headers ) {
	$headers[] = 'X-SJ-Token';
	return $headers;
}

/* ------------------------------------------------------------------ */
/* Simple token authentication                                         */
/* ------------------------------------------------------------------ */

/** Creates a new login token for the user. Token format: "{userId}.{secret}". */
function sj_issue_token( $user_id ) {
	$secret = wp_generate_password( 40, false, false );
	$now    = time();
	$tokens = get_user_meta( $user_id, '_sj_tokens', true );
	if ( ! is_array( $tokens ) ) {
		$tokens = array();
	}

	// Remove expired tokens, then keep at most 10 logins (devices) per user.
	foreach ( $tokens as $hash => $expires ) {
		if ( (int) $expires < $now ) {
			unset( $tokens[ $hash ] );
		}
	}
	$tokens[ 'h' . hash( 'sha256', $secret ) ] = $now + SJ_TOKEN_DAYS * DAY_IN_SECONDS;
	if ( count( $tokens ) > 10 ) {
		asort( $tokens );
		$tokens = array_slice( $tokens, -10, null, true );
	}

	update_user_meta( $user_id, '_sj_tokens', $tokens );
	return $user_id . '.' . $secret;
}

function sj_get_request_token( WP_REST_Request $request ) {
	$token = $request->get_header( 'x-sj-token' );
	if ( ! $token ) {
		$auth = $request->get_header( 'authorization' );
		if ( $auth && 0 === stripos( $auth, 'Bearer ' ) ) {
			$token = substr( $auth, 7 );
		}
	}
	return $token ? trim( $token ) : '';
}

/** Returns array( user_id, token_key ) for a valid token, or false. */
function sj_check_token( $token ) {
	if ( ! $token || false === strpos( $token, '.' ) ) {
		return false;
	}
	list( $user_id, $secret ) = explode( '.', $token, 2 );
	$user_id = absint( $user_id );
	if ( ! $user_id || '' === $secret || ! get_userdata( $user_id ) ) {
		return false;
	}

	$tokens = get_user_meta( $user_id, '_sj_tokens', true );
	$key    = 'h' . hash( 'sha256', $secret );
	if ( ! is_array( $tokens ) || empty( $tokens[ $key ] ) || (int) $tokens[ $key ] < time() ) {
		return false;
	}
	return array( $user_id, $key );
}

/** permission_callback for every protected endpoint. */
function sj_require_auth( WP_REST_Request $request ) {
	$found = sj_check_token( sj_get_request_token( $request ) );
	if ( ! $found ) {
		return new WP_Error( 'sj_unauthorized', 'Your session has expired. Please sign in again.', array( 'status' => 401 ) );
	}
	wp_set_current_user( $found[0] );
	return true;
}

function sj_format_user( $user ) {
	return array(
		'id'          => $user->ID,
		'username'    => $user->user_login,
		'email'       => $user->user_email,
		'displayName' => $user->display_name ? $user->display_name : $user->user_login,
	);
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

add_action( 'rest_api_init', 'sj_register_routes' );

function sj_register_routes() {
	$ns = 'srivalli/v1';

	register_rest_route( $ns, '/auth/login', array(
		'methods'             => 'POST',
		'callback'            => 'sj_route_login',
		'permission_callback' => '__return_true',
	) );

	register_rest_route( $ns, '/auth/register', array(
		'methods'             => 'POST',
		'callback'            => 'sj_route_register',
		'permission_callback' => '__return_true',
	) );

	register_rest_route( $ns, '/auth/me', array(
		'methods'             => 'GET',
		'callback'            => 'sj_route_me',
		'permission_callback' => 'sj_require_auth',
	) );

	register_rest_route( $ns, '/auth/logout', array(
		'methods'             => 'POST',
		'callback'            => 'sj_route_logout',
		'permission_callback' => 'sj_require_auth',
	) );

	register_rest_route( $ns, '/products', array(
		array(
			'methods'             => 'GET',
			'callback'            => 'sj_route_list_products',
			'permission_callback' => 'sj_require_auth',
		),
		array(
			'methods'             => 'POST',
			'callback'            => 'sj_route_create_product',
			'permission_callback' => 'sj_require_auth',
		),
	) );

	register_rest_route( $ns, '/products/(?P<id>\d+)', array(
		array(
			'methods'             => 'GET',
			'callback'            => 'sj_route_get_product',
			'permission_callback' => 'sj_require_auth',
		),
		array(
			'methods'             => 'POST, PUT, PATCH',
			'callback'            => 'sj_route_update_product',
			'permission_callback' => 'sj_require_auth',
		),
		array(
			'methods'             => 'DELETE',
			'callback'            => 'sj_route_delete_product',
			'permission_callback' => 'sj_require_auth',
		),
	) );
}

/* ---------------- Auth endpoints ---------------- */

function sj_route_login( WP_REST_Request $request ) {
	$login    = trim( (string) $request->get_param( 'username' ) );
	$password = (string) $request->get_param( 'password' );

	if ( '' === $login || '' === $password ) {
		return new WP_Error( 'sj_missing_fields', 'Enter your username and password.', array( 'status' => 400 ) );
	}

	// Allow logging in with an email address too.
	if ( is_email( $login ) ) {
		$by_email = get_user_by( 'email', $login );
		if ( $by_email ) {
			$login = $by_email->user_login;
		}
	}

	$user = wp_authenticate( $login, $password );
	if ( is_wp_error( $user ) ) {
		return new WP_Error( 'sj_invalid_login', 'Incorrect username or password.', array( 'status' => 401 ) );
	}

	return array(
		'token' => sj_issue_token( $user->ID ),
		'user'  => sj_format_user( $user ),
	);
}

function sj_route_register( WP_REST_Request $request ) {
	if ( ! SJ_ALLOW_REGISTRATION ) {
		return new WP_Error( 'sj_registration_closed', 'Sign-up is turned off. Ask the admin to create an account for you.', array( 'status' => 403 ) );
	}

	$name     = sanitize_text_field( (string) $request->get_param( 'name' ) );
	$username = sanitize_user( (string) $request->get_param( 'username' ), true );
	$email    = sanitize_email( (string) $request->get_param( 'email' ) );
	$password = (string) $request->get_param( 'password' );

	if ( strlen( $username ) < 3 ) {
		return new WP_Error( 'sj_bad_username', 'Username must be at least 3 characters (letters and numbers).', array( 'status' => 400 ) );
	}
	if ( username_exists( $username ) ) {
		return new WP_Error( 'sj_username_taken', 'That username is already taken.', array( 'status' => 409 ) );
	}
	if ( ! is_email( $email ) ) {
		return new WP_Error( 'sj_bad_email', 'Enter a valid email address.', array( 'status' => 400 ) );
	}
	if ( email_exists( $email ) ) {
		return new WP_Error( 'sj_email_taken', 'An account with this email already exists.', array( 'status' => 409 ) );
	}
	if ( strlen( $password ) < 6 ) {
		return new WP_Error( 'sj_short_password', 'Password must be at least 6 characters.', array( 'status' => 400 ) );
	}

	$user_id = wp_insert_user( array(
		'user_login'   => $username,
		'user_email'   => $email,
		'user_pass'    => $password,
		'display_name' => $name ? $name : $username,
		'first_name'   => $name,
		'role'         => 'subscriber',
	) );
	if ( is_wp_error( $user_id ) ) {
		return new WP_Error( 'sj_register_failed', $user_id->get_error_message(), array( 'status' => 400 ) );
	}

	$response = new WP_REST_Response( array(
		'token' => sj_issue_token( $user_id ),
		'user'  => sj_format_user( get_userdata( $user_id ) ),
	) );
	$response->set_status( 201 );
	return $response;
}

function sj_route_me() {
	return array( 'user' => sj_format_user( wp_get_current_user() ) );
}

function sj_route_logout( WP_REST_Request $request ) {
	$found = sj_check_token( sj_get_request_token( $request ) );
	if ( $found ) {
		$tokens = get_user_meta( $found[0], '_sj_tokens', true );
		if ( is_array( $tokens ) ) {
			unset( $tokens[ $found[1] ] );
			update_user_meta( $found[0], '_sj_tokens', $tokens );
		}
	}
	return array( 'success' => true );
}

/* ---------------- Product helpers ---------------- */

function sj_format_product( $post ) {
	$id       = $post->ID;
	$deleted  = get_post_meta( $id, '_sj_deleted_at', true );
	$quantity = get_post_meta( $id, '_sj_quantity', true );
	$status   = get_post_meta( $id, '_sj_status', true );

	return array(
		'id'          => (string) $id,
		'uniqueId'    => (string) get_post_meta( $id, '_sj_unique_id', true ),
		'name'        => $post->post_title,
		'category'    => (string) get_post_meta( $id, '_sj_category', true ),
		'subCategory' => (string) get_post_meta( $id, '_sj_sub_category', true ),
		'metalType'   => (string) get_post_meta( $id, '_sj_metal_type', true ),
		'carat'       => (string) get_post_meta( $id, '_sj_carat', true ),
		'netWeight'   => (float) get_post_meta( $id, '_sj_net_weight', true ),
		'quantity'    => '' === $quantity ? 1 : (int) $quantity,
		'status'      => $status ? $status : 'In Stock',
		'image'       => (string) get_post_meta( $id, '_sj_image', true ),
		'createdAt'   => get_post_time( 'c', true, $post ),
		'updatedAt'   => get_post_modified_time( 'c', true, $post ),
		'deletedAt'   => $deleted ? $deleted : null,
	);
}

/** Returns the product post if it belongs to the current user, otherwise a 404 error. */
function sj_get_own_product( $id ) {
	$post = get_post( absint( $id ) );
	if ( ! $post || 'sj_product' !== $post->post_type || 'publish' !== $post->post_status
		|| (int) $post->post_author !== get_current_user_id() ) {
		// Same answer whether the item doesn't exist or belongs to someone else.
		return new WP_Error( 'sj_not_found', 'Product not found.', array( 'status' => 404 ) );
	}
	return $post;
}

/**
 * Builds a clean, validated product array from the request.
 * On update, fields that are not sent keep their current value.
 */
function sj_prepare_product( WP_REST_Request $request, $existing = null ) {
	$current = $existing ? sj_format_product( $existing ) : array(
		'uniqueId' => '', 'name' => '', 'category' => '', 'subCategory' => '', 'metalType' => 'Gold',
		'carat' => '', 'netWeight' => 0, 'quantity' => 1, 'status' => 'In Stock',
	);

	$fields = array( 'uniqueId', 'name', 'category', 'subCategory', 'metalType', 'carat', 'netWeight', 'quantity', 'status' );
	$data   = array();
	foreach ( $fields as $field ) {
		$data[ $field ] = $request->has_param( $field ) ? $request->get_param( $field ) : $current[ $field ];
	}

	$data['uniqueId']    = substr( sanitize_text_field( (string) $data['uniqueId'] ), 0, 60 );
	$data['name']        = substr( sanitize_text_field( (string) $data['name'] ), 0, 200 );
	$data['category']    = sanitize_text_field( (string) $data['category'] );
	$data['subCategory'] = sanitize_text_field( (string) $data['subCategory'] );
	$data['metalType']   = sanitize_text_field( (string) $data['metalType'] );
	$data['carat']       = sanitize_text_field( (string) $data['carat'] );
	$data['status']      = sanitize_text_field( (string) $data['status'] );
	$data['netWeight']   = is_numeric( $data['netWeight'] ) ? round( (float) $data['netWeight'], 3 ) : 0;
	$data['quantity']    = is_numeric( $data['quantity'] ) ? max( 0, (int) $data['quantity'] ) : 1;
	if ( '' === $data['status'] ) {
		$data['status'] = 'In Stock';
	}

	$categories = sj_categories();
	$carats     = sj_carats();

	if ( '' === $data['name'] ) {
		return sj_field_error( 'productName', 'Product name is required.' );
	}
	if ( '' === $data['uniqueId'] ) {
		return sj_field_error( 'uniqueNumber', 'Unique number is required.' );
	}
	if ( ! isset( $categories[ $data['category'] ] ) ) {
		return sj_field_error( 'category', 'Choose a valid category.' );
	}
	if ( '' !== $data['subCategory'] && ! in_array( $data['subCategory'], $categories[ $data['category'] ], true ) ) {
		return sj_field_error( 'subCategory', 'Sub category does not match the selected category.' );
	}
	if ( ! isset( $carats[ $data['metalType'] ] ) ) {
		return sj_field_error( 'metalType', 'Choose Gold or Silver.' );
	}
	if ( ! in_array( $data['carat'], $carats[ $data['metalType'] ], true ) ) {
		return sj_field_error( 'carat', 'Carat value does not match the selected metal.' );
	}
	if ( $data['netWeight'] <= 0 || $data['netWeight'] > 100000 ) {
		return sj_field_error( 'weight', 'Enter a weight greater than 0.' );
	}

	// Unique number must be unique within this user's items (including deleted ones).
	$duplicates = get_posts( array(
		'post_type'      => 'sj_product',
		'post_status'    => 'publish',
		'author'         => get_current_user_id(),
		'meta_key'       => '_sj_unique_id',
		'meta_value'     => $data['uniqueId'],
		'post__not_in'   => $existing ? array( $existing->ID ) : array(),
		'fields'         => 'ids',
		'posts_per_page' => 1,
	) );
	if ( ! empty( $duplicates ) ) {
		return new WP_Error(
			'sj_duplicate_unique_id',
			'You already have an item with unique number ' . $data['uniqueId'] . '.',
			array( 'status' => 409, 'field' => 'uniqueNumber' )
		);
	}

	return $data;
}

function sj_field_error( $field, $message ) {
	return new WP_Error( 'sj_invalid_field', $message, array( 'status' => 400, 'field' => $field ) );
}

/**
 * Reads the "image" value sent by the app. Returns:
 *   null                       → image not sent, leave as is
 *   array( 'type' => 'clear' ) → remove the image
 *   array( 'type' => 'url', 'url' => ... )
 *   array( 'type' => 'upload', 'bytes' => ..., 'ext' => ..., 'mime' => ... )
 *   WP_Error                   → invalid image
 */
function sj_read_image_param( WP_REST_Request $request ) {
	if ( ! $request->has_param( 'image' ) ) {
		return null;
	}
	$image = trim( (string) $request->get_param( 'image' ) );

	if ( '' === $image ) {
		return array( 'type' => 'clear' );
	}

	if ( 0 === strpos( $image, 'data:' ) ) {
		if ( ! preg_match( '#^data:image/(png|jpe?g|gif|webp);base64,#i', $image, $match ) ) {
			return sj_field_error( 'image', 'Only JPG, PNG, GIF or WEBP images are allowed.' );
		}
		$bytes = base64_decode( substr( $image, strpos( $image, ',' ) + 1 ), true );
		if ( false === $bytes || '' === $bytes ) {
			return sj_field_error( 'image', 'The image could not be read. Please choose it again.' );
		}
		if ( strlen( $bytes ) > SJ_MAX_IMAGE_MB * MB_IN_BYTES ) {
			return sj_field_error( 'image', 'Image is too large (max ' . SJ_MAX_IMAGE_MB . ' MB).' );
		}
		$ext = strtolower( $match[1] );
		if ( 'jpeg' === $ext ) {
			$ext = 'jpg';
		}
		$mime = 'jpg' === $ext ? 'image/jpeg' : 'image/' . $ext;
		return array( 'type' => 'upload', 'bytes' => $bytes, 'ext' => $ext, 'mime' => $mime );
	}

	if ( preg_match( '#^https?://#i', $image ) && filter_var( $image, FILTER_VALIDATE_URL ) ) {
		return array( 'type' => 'url', 'url' => esc_url_raw( $image ) );
	}

	return sj_field_error( 'image', 'Invalid image.' );
}

/** Applies the image change to a product. Returns true or WP_Error. */
function sj_save_image( $post_id, $image ) {
	if ( null === $image ) {
		return true;
	}

	if ( 'url' === $image['type'] ) {
		if ( get_post_meta( $post_id, '_sj_image', true ) === $image['url'] ) {
			return true; // unchanged
		}
		sj_delete_product_attachment( $post_id );
		update_post_meta( $post_id, '_sj_image', $image['url'] );
		return true;
	}

	if ( 'clear' === $image['type'] ) {
		sj_delete_product_attachment( $post_id );
		delete_post_meta( $post_id, '_sj_image' );
		return true;
	}

	// New upload → save into the Media Library.
	$filename = 'sj-product-' . $post_id . '-' . time() . '.' . $image['ext'];
	$upload   = wp_upload_bits( $filename, null, $image['bytes'] );
	if ( ! empty( $upload['error'] ) ) {
		return new WP_Error( 'sj_upload_failed', 'Could not save the image: ' . $upload['error'], array( 'status' => 500 ) );
	}
	if ( ! @getimagesize( $upload['file'] ) ) {
		@unlink( $upload['file'] );
		return sj_field_error( 'image', 'The uploaded file is not a valid image.' );
	}

	$attachment_id = wp_insert_attachment( array(
		'post_mime_type' => $image['mime'],
		'post_title'     => get_the_title( $post_id ),
		'post_status'    => 'inherit',
		'post_author'    => get_current_user_id(),
	), $upload['file'], $post_id );

	if ( is_wp_error( $attachment_id ) || ! $attachment_id ) {
		@unlink( $upload['file'] );
		return new WP_Error( 'sj_upload_failed', 'Could not save the image.', array( 'status' => 500 ) );
	}

	require_once ABSPATH . 'wp-admin/includes/image.php';
	wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $upload['file'] ) );

	sj_delete_product_attachment( $post_id ); // remove the old photo, if any
	update_post_meta( $post_id, '_sj_image_id', $attachment_id );
	update_post_meta( $post_id, '_sj_image', $upload['url'] );
	return true;
}

function sj_delete_product_attachment( $post_id ) {
	$old = (int) get_post_meta( $post_id, '_sj_image_id', true );
	if ( $old ) {
		wp_delete_attachment( $old, true );
		delete_post_meta( $post_id, '_sj_image_id' );
	}
}

function sj_save_product_meta( $post_id, $data ) {
	update_post_meta( $post_id, '_sj_unique_id', $data['uniqueId'] );
	update_post_meta( $post_id, '_sj_category', $data['category'] );
	update_post_meta( $post_id, '_sj_sub_category', $data['subCategory'] );
	update_post_meta( $post_id, '_sj_metal_type', $data['metalType'] );
	update_post_meta( $post_id, '_sj_carat', $data['carat'] );
	update_post_meta( $post_id, '_sj_net_weight', $data['netWeight'] );
	update_post_meta( $post_id, '_sj_quantity', $data['quantity'] );
	update_post_meta( $post_id, '_sj_status', $data['status'] );
}

/* ---------------- Product endpoints ---------------- */

function sj_route_list_products( WP_REST_Request $request ) {
	$filter = $request->get_param( 'status' );
	$filter = in_array( $filter, array( 'active', 'deleted' ), true ) ? $filter : 'all';

	$query = new WP_Query( array(
		'post_type'      => 'sj_product',
		'post_status'    => 'publish',
		'author'         => get_current_user_id(), // only this user's items
		'posts_per_page' => -1,
		'orderby'        => array( 'date' => 'ASC', 'ID' => 'ASC' ),
		'no_found_rows'  => true,
	) );

	$items = array();
	foreach ( $query->posts as $post ) {
		$product = sj_format_product( $post );
		if ( 'active' === $filter && $product['deletedAt'] ) {
			continue;
		}
		if ( 'deleted' === $filter && ! $product['deletedAt'] ) {
			continue;
		}
		$items[] = $product;
	}
	return $items;
}

function sj_route_get_product( WP_REST_Request $request ) {
	$post = sj_get_own_product( $request['id'] );
	return is_wp_error( $post ) ? $post : sj_format_product( $post );
}

function sj_route_create_product( WP_REST_Request $request ) {
	$data = sj_prepare_product( $request );
	if ( is_wp_error( $data ) ) {
		return $data;
	}
	$image = sj_read_image_param( $request );
	if ( is_wp_error( $image ) ) {
		return $image;
	}

	$post_id = wp_insert_post( array(
		'post_type'   => 'sj_product',
		'post_status' => 'publish',
		'post_title'  => $data['name'],
		'post_author' => get_current_user_id(),
	), true );
	if ( is_wp_error( $post_id ) ) {
		return new WP_Error( 'sj_save_failed', 'Could not save the product.', array( 'status' => 500 ) );
	}

	sj_save_product_meta( $post_id, $data );

	$saved = sj_save_image( $post_id, $image );
	if ( is_wp_error( $saved ) ) {
		wp_delete_post( $post_id, true ); // don't leave a half-saved item behind
		return $saved;
	}

	$response = new WP_REST_Response( sj_format_product( get_post( $post_id ) ) );
	$response->set_status( 201 );
	return $response;
}

function sj_route_update_product( WP_REST_Request $request ) {
	$post = sj_get_own_product( $request['id'] );
	if ( is_wp_error( $post ) ) {
		return $post;
	}
	if ( get_post_meta( $post->ID, '_sj_deleted_at', true ) ) {
		return new WP_Error( 'sj_deleted', 'Deleted items cannot be edited.', array( 'status' => 400 ) );
	}

	$data = sj_prepare_product( $request, $post );
	if ( is_wp_error( $data ) ) {
		return $data;
	}
	$image = sj_read_image_param( $request );
	if ( is_wp_error( $image ) ) {
		return $image;
	}

	$updated = wp_update_post( array(
		'ID'         => $post->ID,
		'post_title' => $data['name'],
	), true );
	if ( is_wp_error( $updated ) ) {
		return new WP_Error( 'sj_save_failed', 'Could not update the product.', array( 'status' => 500 ) );
	}

	sj_save_product_meta( $post->ID, $data );

	$saved = sj_save_image( $post->ID, $image );
	if ( is_wp_error( $saved ) ) {
		return $saved;
	}

	clean_post_cache( $post->ID );
	return sj_format_product( get_post( $post->ID ) );
}

function sj_route_delete_product( WP_REST_Request $request ) {
	$post = sj_get_own_product( $request['id'] );
	if ( is_wp_error( $post ) ) {
		return $post;
	}
	if ( ! get_post_meta( $post->ID, '_sj_deleted_at', true ) ) {
		update_post_meta( $post->ID, '_sj_deleted_at', gmdate( 'c' ) );
	}
	return sj_format_product( $post );
}
