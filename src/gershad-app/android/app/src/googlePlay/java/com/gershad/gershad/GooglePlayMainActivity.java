package com.gershad.gershad;

import android.os.Bundle;
import com.gershad.gershad.plugins.cognito.GershadCognitoPlugin;
import com.gershad.gershad.plugins.migrate_settings.GershadMigrateSettingsPlugin;
import com.gershad.gershad.plugins.permissions.GershadCheckPermissionsPlugin;
import com.getcapacitor.BridgeActivity;

public class GooglePlayMainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(GershadCognitoPlugin.class);
        registerPlugin(GershadMigrateSettingsPlugin.class);
        registerPlugin(GershadCheckPermissionsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
