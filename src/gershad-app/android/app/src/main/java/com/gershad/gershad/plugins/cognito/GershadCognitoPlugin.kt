package com.gershad.gershad.plugins.cognito

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

const val permissionAlias = "cognitoPermissionAlias"
const val pluginName = "GershadCognitoPlugin"

@CapacitorPlugin(
    name = pluginName,
    permissions = arrayOf(Permission( alias = permissionAlias, strings = arrayOf()))
)
class GershadCognitoPlugin : Plugin()
{
    private val LOG_TAG = "GershadCognitoPlugin"
    private val COGNITO_ID_KEY = "cognitoId"
    private val COGNITO_POOL_ID_KEY = "cognitoPoolId"

    override fun load() {
        super.load()
        Log.d(LOG_TAG, "load")
    }

    @PluginMethod
    fun getCognitoId(call: PluginCall)
    {
        bridge.saveCall(call)
        val cognitoPoolId = call.getString(COGNITO_POOL_ID_KEY)
        Log.d(LOG_TAG, "getCognitoId - poolId - $cognitoPoolId")
        val ret = JSObject()

        CoroutineScope(Dispatchers.IO).launch {
            try {
                var cognitoId = cognitoPoolId?.let{ AmazonServiceProvider.getInstance(context, it).credentialsProvider.identityId }
                if (cognitoId == null) {
                    cognitoId = ""
                }
                withContext(Dispatchers.Main) {
                    Log.d(LOG_TAG, "getCognitoId - cognitoId - $cognitoId")
                    call.resolve(ret.put(COGNITO_ID_KEY, cognitoId)) // or bad format exception?
                }
            } catch (ex: Exception) {
                Log.e(LOG_TAG, "getCognitoId - Error = ${ex.cause}")
                call.resolve(ret.put(COGNITO_ID_KEY, ""))
            }
        }
    }

    override fun handleOnDestroy() {
        super.handleOnDestroy()
        Log.d(LOG_TAG, "handleOnDestroy")
    }
}
