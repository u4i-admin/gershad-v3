package com.gershad.gershad.plugins.permissions

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin


const val pluginName = "GershadCheckPermissionsPlugin"

@CapacitorPlugin(name = pluginName)
class GershadCheckPermissionsPlugin : Plugin()
{
    private val LOG_TAG = "CheckPermissionsPlugin"
    private val IS_GRANTED = "isGranted"
    private val PERMISSION_STATE = "permissionState"
    private var pendingCall: PluginCall? = null
    private lateinit var requestPermissionLauncher: ActivityResultLauncher<String>
    private var isMotionPermissionPreviouslyDenied = false
    private val IS_MOTION_PERMISSION_PREVIOUSLY_DENIED_PREFERENCE_KEY = "isMotionPermissionPreviouslyDenied"
    private val SHARED_PREFERENCE_NAME = "com.gershad.gershad"

    override fun load() {
        super.load()
        isMotionPermissionPreviouslyDenied = getMotionPermissionPreviouslyDenied()
        getMotionPermissionState() // Get the most current state of the motion permission since the user might have changed it via the App settings before opening this App.
        requestPermissionLauncher = activity.registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted: Boolean ->
            /* isGranted is false (i.e. 'denied') for the following two situations which is kind a very poorly designed API by the Android -
                1. if the user removes the permission dialog by pressing back button.
                2. if the user actually denies the permission for the second time.
                We therefore use isMotionPermissionPreviouslyDenied to differentiate between the above two scenerio.
             */
            val motionPermissionState = getMotionPermissionState()
            val ret = JSObject()
            Log.d(LOG_TAG, "requestMotionPermission user granted permissionState = ${motionPermissionState}")
            ret.put(PERMISSION_STATE, motionPermissionState)
            pendingCall?.resolve(ret)
            pendingCall = null
        }
    }

    fun setMotionPermissionPreviouslyDenied(isDenied: Boolean) {
        val sharedPreferences = context.getSharedPreferences(SHARED_PREFERENCE_NAME, Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putBoolean(IS_MOTION_PERMISSION_PREVIOUSLY_DENIED_PREFERENCE_KEY, isDenied)
        editor.apply()
    }

    fun getMotionPermissionPreviouslyDenied(): Boolean {
        val sharedPreferences = context.getSharedPreferences(SHARED_PREFERENCE_NAME, Context.MODE_PRIVATE)
        return sharedPreferences.getBoolean(IS_MOTION_PERMISSION_PREVIOUSLY_DENIED_PREFERENCE_KEY, false)
    }

    @PluginMethod
    fun isBackgroundLocationPermissionGranted(call: PluginCall)
    {
        val ret = JSObject()
        val isBackgroundPermissionGranted = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            context.applicationContext.checkSelfPermission(Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
        Log.d(LOG_TAG, "isBackgroundPermissionGranted = ${isBackgroundPermissionGranted}")
        ret.put(IS_GRANTED, isBackgroundPermissionGranted)
        call.resolve(ret)
    }

    @PluginMethod
    fun getMotionPermissionState(call: PluginCall) {
        val ret = JSObject()
        val permissionState = getMotionPermissionState()

        Log.d(LOG_TAG, "getMotionPermissioStatus = ${permissionState}")
        ret.put(PERMISSION_STATE, permissionState)
        call.resolve(ret)
    }

    @PluginMethod
    fun requestMotionPermission(call: PluginCall) {
        Log.d(LOG_TAG, "requestMotionPermission called")
        bridge.saveCall(call)
        pendingCall = call
        getMotionPermissionState() // we need to call this to set isMotionPermissionPreviouslyDenied in case if the user denied the permission from the App permission settings to be able to differentiate between the 'denied' state if "user did not grant nor denied" vs if "user actually denied for the second time" when requestPermissionLauncher is called".
        requestPermissionLauncher?.launch(Manifest.permission.ACTIVITY_RECOGNITION)
    }

    private fun getMotionPermissionState() : PermissionState {
        val motionPermissionState =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                /**
                 * Android API checkSelfPermission returns 'denied' for the following two situations which is causing confusion -
                 * 1. If the user did not approve nor denied previously.
                 * 2. if the user actually denies the permission for the second time i.e. the final time after which no dialog is shown even if we request it.
                 *
                 * We therefore use isMotionPermissionPreviouslyDenied to check if the permission was previously denied so that we can differentiate between the 1st and the 2nd case the next time when this method is called. We set it when the first time a user denies the dialog or if it denies from the App permission settings
                 */
                var checkPermissionState = context.applicationContext.checkSelfPermission(Manifest.permission.ACTIVITY_RECOGNITION)

                when {
                    checkPermissionState == PackageManager.PERMISSION_GRANTED -> {
                        isMotionPermissionPreviouslyDenied = false
                        setMotionPermissionPreviouslyDenied(false)
                        PermissionState.GRANTED
                    }
                    ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.ACTIVITY_RECOGNITION) -> {
                        isMotionPermissionPreviouslyDenied = true
                        setMotionPermissionPreviouslyDenied(true)
                        PermissionState.PROMPT_WITH_RATIONALE
                    }
                    checkPermissionState == PackageManager.PERMISSION_DENIED -> {
                        if (isMotionPermissionPreviouslyDenied) {
                            // The user denied
                            PermissionState.DENIED
                        } else {
                            // Either user has never granted nor denied or else if the user removed the permission dialog without granting or denying by pressing back button.
                            PermissionState.PROMPT
                        }
                    }
                    else -> {
                        PermissionState.PROMPT
                    }
                }
            } else {
                PermissionState.GRANTED
            }
        return motionPermissionState
    }
}
