package com.gershad.gershad.plugins.app_update_delete

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.core.content.FileProvider
import com.amazonaws.mobileconnectors.s3.transferutility.TransferListener
import com.amazonaws.mobileconnectors.s3.transferutility.TransferState
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
import java.io.File
import java.io.InputStream

const val permissionAlias = "appUpdateDeletePermissionAlias"
const val pluginName = "GershadAppUpdateDeletePlugin"

@CapacitorPlugin(
    name = pluginName,
    permissions = arrayOf(Permission( alias = permissionAlias, strings = arrayOf()))
)
class GershadAppUpdateDeletePlugin : Plugin()
{
    private val LOG_TAG = "InstallDeletePlugin"
    private val COGNITO_POOL_ID_KEY = "cognitoPoolId"
    private val BUCKET_NAME = "bucketName"
    private val VERSION_FILE_NAME = "versionFileName"
    private val GERSHAD_APP_FILE_NAME = "gershadAppFileName"
    private val IS_FAILED = "isFailed"
    private val IS_UPDATE_NEEDED = "isUpdateNeeded"

    override fun load() {
        super.load()
        Log.d(LOG_TAG, "load")
    }

    private fun getVersionCode(context: Context): Int {
        try {
            val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
            return packageInfo.versionCode
        } catch (e: PackageManager.NameNotFoundException) {
            // Handle error if package name is not found
            e.printStackTrace()
        }
        return -1 // Return a default value in case of an error
    }

    @PluginMethod
    fun isUpdateAvailable(call: PluginCall) {
        bridge.saveCall(call)

        val cognitoPoolId = call.getString(COGNITO_POOL_ID_KEY)
        val bucketName = call.getString(BUCKET_NAME)
        val versionFileName = call.getString(VERSION_FILE_NAME)

        val ret = JSObject()

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val internalFile = File(context.filesDir.toString() + "/" + versionFileName)
                val appVersionCode = getVersionCode(context)
                Log.d(LOG_TAG, "isUpdateAvailable: availableVersionCode = ${appVersionCode}")
                AmazonServiceProvider.getInstance(context, cognitoPoolId!!).transferUtility.download(bucketName, versionFileName, internalFile, object :
                    TransferListener {
                    override fun onStateChanged(id: Int, state: TransferState) {
                        if (state == TransferState.COMPLETED) {
                            try {
                                val inputStream: InputStream = internalFile.inputStream()
                                val inputString = inputStream.bufferedReader().use { it.readText() }
                                val availableVersionCode = inputString.trim().toInt()
                                Log.d(LOG_TAG, "isUpdateAvailable: Available update's versionCode = ${availableVersionCode}")
                                if (appVersionCode < availableVersionCode) {
                                    call.resolve(ret.put(IS_UPDATE_NEEDED, true))
                                } else {
                                    call.resolve(ret.put(IS_UPDATE_NEEDED, false))
                                }
                            } catch (ex: Exception) {
                                call.resolve(ret.put(IS_UPDATE_NEEDED, false))
                            }
                        }
                    }

                    override fun onProgressChanged(id: Int, bytesCurrent: Long, bytesTotal: Long) {
                    }

                    override fun onError(id: Int, ex: Exception) {
                        call.resolve(ret.put(IS_UPDATE_NEEDED, false))
                        Log.e(LOG_TAG, "isUpdateAvailable: Error 1 reading version.txt file = ${ex.cause}")
                    }
                })
            } catch (ex: Exception) {
                call.resolve(ret.put(IS_UPDATE_NEEDED, false))
                Log.e(LOG_TAG, "isUpdateAvailable: Error 2 reading version.txt file = ${ex.cause}")
            }
        }
    }

    private fun installApk(gershadAppFileName: String) {
        val internalFile = File("${context.filesDir.toString()}/${gershadAppFileName}")
        internalFile.setReadable(true, false)

        var internalUri = Uri.fromFile(internalFile)
        if (Build.VERSION.SDK_INT >= 24) {
            internalUri = FileProvider.getUriForFile(context, "com.gershad.gershad.fileprovider", internalFile)
        }

        val installIntent = Intent(Intent.ACTION_VIEW)
        installIntent.setDataAndType(internalUri, "application/vnd.android.package-archive")
        installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        context.startActivity(installIntent)
    }

    @PluginMethod
    fun updateSelf(call: PluginCall) {
        bridge.saveCall(call)

        val cognitoPoolId = call.getString(COGNITO_POOL_ID_KEY)
        val bucketName = call.getString(BUCKET_NAME)
        val gershadAppFileName = call.getString(GERSHAD_APP_FILE_NAME)

        val ret = JSObject()

        CoroutineScope(Dispatchers.IO).launch {
            try {
                var internalFile = File(context.filesDir.toString() + "/" + gershadAppFileName)

                if (internalFile.exists()) {
                    // delete previously installed file if it exists so that we can download the latest apk file.
                    Log.d(LOG_TAG, "updateSelf: file already exists and so deleting it first before downloading the latest into it.")
                    internalFile.delete()
                }

                internalFile = File(context.filesDir.toString() + "/" + gershadAppFileName)
                Log.d(LOG_TAG, "updateSelf: download(ing) the latest ${gershadAppFileName}")
                AmazonServiceProvider.getInstance(context, cognitoPoolId!!).transferUtility.download(bucketName, gershadAppFileName, internalFile, object :
                    TransferListener {
                    override fun onStateChanged(id: Int, state: TransferState) {
                        if (state == TransferState.COMPLETED) {
                            try {
                                Log.d(LOG_TAG, "updateSelf: download(ed) the latest ${gershadAppFileName} and now will attempt to install it. Number of bytes = ${internalFile.totalSpace} - File path = ${internalFile.absolutePath}")
                                installApk(gershadAppFileName!!)
                            } catch (ex: Exception) {
                                Log.e(LOG_TAG, "updateSelf: Failed to install the downloaded apk file ${ex.message} - ${ex} - ${ex.localizedMessage} - ${ex.stackTrace}")
                                call.resolve(ret.put(IS_FAILED, true))
                            }
                        }
                    }

                    override fun onProgressChanged(id: Int, bytesCurrent: Long, bytesTotal: Long) {
                    }

                    override fun onError(id: Int, ex: Exception) {
                        call.resolve(ret.put(IS_FAILED, true))
                        Log.e(LOG_TAG, "updateSelf: Error 1 downloading gershad App file = ${ex.cause}")
                    }
                })
            } catch (ex: Exception) {
                call.resolve(ret.put(IS_FAILED, true))
                Log.e(LOG_TAG, "updateSelf: Error 2 downloading gershad App file = ${ex.cause}")
            }
        }
    }

    @PluginMethod
    fun selfDelete(call: PluginCall) {
        val ret = JSObject()
        try {
            Log.d(LOG_TAG, "selfDelete - attempting to delete the App")
            val intent = Intent(Intent.ACTION_DELETE)
            intent.data = Uri.parse("package:${context.packageName}")
            context.startActivity(intent)
            call.resolve(ret.put(IS_FAILED, false)) // this will usually not be called as the App will have been deleted by then.
        } catch (ex: Exception) {
            Log.e(LOG_TAG, "selfDelete - delete failed ${ex.cause}")
            call.resolve(ret.put(IS_FAILED, true))
        }
    }

    override fun handleOnDestroy() {
        super.handleOnDestroy()
        Log.d(LOG_TAG, "handleOnDestroy")
    }
}
