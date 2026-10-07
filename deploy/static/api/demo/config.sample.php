<?php
// Copy to config.php on the server and fill in. Never commit real values. config.php is denied by .htaccess.
// Every key is optional; a feature without its keys is simply skipped.
return array(
    // ---- Excel Table via Microsoft Graph (Azure app, client credentials, Sites.Selected) ----
    'tenant_id'     => '',   // Azure directory (tenant) ID
    'client_id'     => '',   // Azure app (client) ID
    'client_secret' => '',   // Azure app client secret value
    'drive_id'      => '',   // Drive ID of the SharePoint/OneDrive that holds the workbook
    'item_id'       => '',   // Item ID of the workbook file
    'table_name'    => 'Leads', // Excel Table name; its columns must follow "columns" in lead-rules.json
    'sheet_url'     => '',   // Link to the workbook ("Open sheet" button in Teams)

    // ---- Teams (Workflows: "Post to a channel when a webhook request is received") ----
    'teams_webhook_url' => '',

    // ---- Brevo (email tool). Lists are filled from the Outcome column ----
    'brevo_api_key'  => '',
    'brevo_list_ids' => array('deal' => 0, 'potential' => 0, 'nurturing' => 0), // numeric Brevo list IDs

    // ---- Storage ----
    // Queue, rate-limit counters and sync state. Best: a folder OUTSIDE public_html, e.g. /home/USER/tivora-data.
    // Empty = the "data" folder next to index.php (web access denied by data/.htaccess).
    'data_dir' => '',

    // ---- Legacy fallback: used only when neither Graph nor Teams is configured ----
    'to_email'    => 'sales@example.com', // demo requests are emailed here
    'webhook_url' => '',                  // optional: POST each lead as JSON to a CRM / Zapier / Make webhook
    'from_email'  => 'no-reply@example.com', // real mailbox on this domain so mail is not flagged as spam

    // ---- Tuning ----
    'retry_min_age' => 120, // seconds a lead must be old before sync.php retries it
    'whatsapp_hour' => 9,   // Nepal time: earliest hour the daily WhatsApp list is posted

    // ---- Base-URL overrides (tests point these at mock servers; leave empty in production) ----
    'graph_base' => '',  // default https://graph.microsoft.com/v1.0
    'login_base' => '',  // default https://login.microsoftonline.com
    'brevo_base' => '',  // default https://api.brevo.com/v3
);
