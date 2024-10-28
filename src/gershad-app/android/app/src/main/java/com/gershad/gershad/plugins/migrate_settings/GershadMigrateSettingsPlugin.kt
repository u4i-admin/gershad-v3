package com.gershad.gershad.plugins.migrate_settings

import android.content.Context
import android.os.Build
import android.util.Log
import com.gershad.gershad.AmazonServiceProvider
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

const val pluginName = "GershadMigrateSettingsPlugin"

@CapacitorPlugin(name = pluginName)
class GershadMigrateSettingsPlugin : Plugin()
{
    private val LOG_TAG = "MigrateSettingsPlugin"

    @PluginMethod
    fun migrateSettings(call: PluginCall)
    {
        val ret = JSObject()
        val settings = context.getSharedPreferences(FILENAME, Context.MODE_PRIVATE)
        val settingsReportsNearYou = settings.getBoolean(REPORTS_NEAR_YOU, false)
        val defaultSettingReportsNearSaved = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) { false } else { true }
        val settingsReportsNearSaved = settings.getBoolean(REPORTS_NEAR_SAVED, defaultSettingReportsNearSaved)
        val settingsUninstallFeature = settings.getBoolean(UNINSTALL, false)

        Log.d(LOG_TAG, "settingsReportsNearYou = ${settingsReportsNearYou}")
        Log.d(LOG_TAG, "settingsReportsNearSaved = ${settingsReportsNearSaved}")
        Log.d(LOG_TAG, "settingsUninstallFeature = ${settingsUninstallFeature}")

        ret.put(ENABLE_NOTIFICATIONS_NEAR_YOU, settingsReportsNearYou)
        ret.put(ENABLE_NOTIFICATIONS_NEAR_YOUR_SAVED_LOCATION, settingsReportsNearSaved)
        ret.put(ENABLE_UNINSTALL_FEATURE, settingsUninstallFeature)

        call.resolve(ret)
    }

    companion object {
        private const val FILENAME = "com.gershad.gershad.app_preferences" // Same as the older Andorid native ONLY App in the PlayStore.
        private const val REPORTS_NEAR_YOU = "ReportsNearYou"
        private const val REPORTS_NEAR_SAVED: String = "ReportsNearSaved"
        private const val UNINSTALL: String = "Uninstall"
        private const val ENABLE_NOTIFICATIONS_NEAR_YOU = "enableNotificationsNearYou"
        private const val ENABLE_NOTIFICATIONS_NEAR_YOUR_SAVED_LOCATION = "enableNotificationsNearYourSavedLocation"
        private const val ENABLE_UNINSTALL_FEATURE = "enableUninstallFeature"
    }
}
