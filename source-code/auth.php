<?php
// Start the session
session_start();

// When the user is logged in, go to the user page
if (isset($_SESSION['logged-in']) && $_SESSION['logged-in'] == TRUE) {
    die(header('Location: user.php'));
}

// Place bot token of your bot here
define('BOT_TOKEN', '7441738058:AAFp4LGoZ6ODDcTanz7pcUoPtbQBg0V_6aw');
define('XATA_API_KEY', 'xau_oRaXvdPuvISpdiX1Qxbv2p0zjpXd79Qr8');
define('XATA_BASE_URL', 'https://raog812-s-workspace-ot2f70.ap-southeast-2.xata.sh/db/stol-db:main/tables/stol');

// The Telegram hash is required to authorize
if (!isset($_GET['hash'])) {
    die('Telegram hash not found');
}

// Official Telegram authorization - function
function checkTelegramAuthorization($auth_data) {
    $check_hash = $auth_data['hash'];
    unset($auth_data['hash']);
    $data_check_arr = [];
    foreach ($auth_data as $key => $value) {
        $data_check_arr[] = $key . '=' . $value;
    }
    sort($data_check_arr);
    $data_check_string = implode("\n", $data_check_arr);
    $secret_key = hash('sha256', BOT_TOKEN, true);
    $hash = hash_hmac('sha256', $data_check_string, $secret_key);
    if (strcmp($hash, $check_hash) !== 0) {
        throw new Exception('Data is NOT from Telegram');
    }
    if ((time() - $auth_data['auth_date']) > 86400) {
        throw new Exception('Data is outdated');
    }
    return $auth_data;
}

// Make a POST request
function makePostRequest($url, $data) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . XATA_API_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// Make a GET request
function makeGetRequest($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . XATA_API_KEY,
        'Content-Type: application/json'
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// User authentication - function
function userAuthentication($auth_data) {
    // Check if user exists
    $url = XATA_BASE_URL . '/query';
    $query = [
        'columns' => ['telegram_id'],
        'page' => ['size' => 1],
        'filter' => ['telegram_id' => $auth_data['id']]
    ];
    $response = makePostRequest($url, $query);

    if (!empty($response['records'])) {
        // User found, so update it
        $user_id = $response['records'][0]['id'];
        $url = XATA_BASE_URL . '/data/' . $user_id;
        $update_data = [
            'first_name' => $auth_data['first_name'],
            'last_name' => $auth_data['last_name'],
            'telegram_username' => $auth_data['username'],
            'profile_picture' => $auth_data['photo_url'],
            'auth_date' => $auth_data['auth_date']
        ];
        makePostRequest($url, $update_data);
    } else {
        // User not found, so create it
        $url = XATA_BASE_URL . '/data';
        $create_data = [
            'first_name' => $auth_data['first_name'],
            'last_name' => $auth_data['last_name'],
            'telegram_id' => $auth_data['id'],
            'telegram_username' => $auth_data['username'],
            'profile_picture' => $auth_data['photo_url'],
            'auth_date' => $auth_data['auth_date']
        ];
        makePostRequest($url, $create_data);
    }

    // Create logged in user session
    $_SESSION = [
        'logged-in' => TRUE,
        'telegram_id' => $auth_data['id']
    ];
}

// Start the process
try {
    // Get the authorized user data from Telegram widget
    $auth_data = checkTelegramAuthorization($_GET);

    // Authenticate the user
    userAuthentication($auth_data);
} catch (Exception $e) {
    // Display errors
    die($e->getMessage());
}

// Go to the user page
die(header('Location: user.php'));
?>
