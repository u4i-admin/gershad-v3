package com.gershad.gershad;

import android.os.Bundle;
import com.gershad.gershad.plugins.cognito.GershadCognitoPlugin;
import com.gershad.gershad.plugins.app_update_delete.GershadAppUpdateDeletePlugin;
import com.gershad.gershad.plugins.permissions.GershadCheckPermissionsPlugin;
import com.gershad.gershad.plugins.migrate_settings.GershadMigrateSettingsPlugin;
import com.getcapacitor.BridgeActivity;

public class IndependentMainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(GershadAppUpdateDeletePlugin.class);
        registerPlugin(GershadCognitoPlugin.class);
        registerPlugin(GershadMigrateSettingsPlugin.class);
        registerPlugin(GershadCheckPermissionsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
