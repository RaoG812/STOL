<?php
header('Content-Type: application/json');

// Replace with your Xata API key
$XATA_API_KEY = 'xau_sAKUOpYM0Fnw1YdpiK3cvVEubLpocjh12';
$XATA_ENDPOINT = 'https://RaoG812-s-workspace-ot2f70.ap-southeast-2.xata.sh/db/stol-db:main/tables/stol/data';

// Get the Telegram authentication data from POST request
$data = json_decode(file_get_contents('php://input'), true);

$telegram_id = $data['id'];
$first_name = $data['first_name'];
$last_name = $data['last_name'];
$telegram_username = $data['username'];

// Check if the user already exists
$options = [
    'http' => [
        'header'  => "Authorization: Bearer $XATA_API_KEY\r\n" .
                     "Content-Type: application/json\r\n",
        'method'  => 'GET',
    ],
];
$context  = stream_context_create($options);
$response = file_get_contents("$XATA_ENDPOINT?filter[telegram_id]=$telegram_id", false, $context);
$existing_user = json_decode($response, true);

if (count($existing_user['data']) > 0) {
    // User exists
    echo json_encode(['status' => 'success', 'message' => 'User already logged in']);
} else {
    // Insert new user
    $post_data = json_encode([
        'first_name' => $first_name,
        'last_name' => $last_name,
        'telegram_id' => $telegram_id,
        'telegram_username' => $telegram_username
    ]);

    $options = [
        'http' => [
            'header'  => "Authorization: Bearer $XATA_API_KEY\r\n" .
                         "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => $post_data,
        ],
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($XATA_ENDPOINT, false, $context);
    
    echo $result;
}
?>
