package com.gershad.gershad

import android.content.Context
import com.amazonaws.ClientConfiguration
import com.amazonaws.auth.CognitoCachingCredentialsProvider
import com.amazonaws.mobileconnectors.s3.transferutility.TransferUtility
import com.amazonaws.regions.Region
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.AmazonS3Client

/**
 * Cognito credentials
 */
class AmazonServiceProvider private constructor(private val context: Context, private val cognitoPoolId: String) {

    val credentialsProvider by lazy { createCredentialsProvider() }

    val amazonS3Provider by lazy { createAmazonS3Client() }

    val transferUtility by lazy { createTransferUtlity() }

    private fun createCredentialsProvider() : CognitoCachingCredentialsProvider {
        return CognitoCachingCredentialsProvider(
                context.applicationContext,
                cognitoPoolId,
                Regions.US_EAST_1,
                clientConfig()
        )
    }

    private fun createAmazonS3Client() : AmazonS3Client {
        val sS3Client = AmazonS3Client(credentialsProvider, Region.getRegion(Regions.US_EAST_1), clientConfig())
        return sS3Client
    }

    private fun createTransferUtlity(): TransferUtility {
        return TransferUtility.builder().s3Client(amazonS3Provider).context(context.applicationContext).build()
    }

    private fun clientConfig(): ClientConfiguration {
        val clientConfiguration = ClientConfiguration()
        clientConfiguration.connectionTimeout = 300000
        clientConfiguration.socketTimeout = 300000
        return clientConfiguration
    }

    companion object {
        @Volatile
        private var amazonServiceProviderInstance: AmazonServiceProvider? = null

        fun getInstance(context: Context, cognitoPoolId: String) : AmazonServiceProvider {
            return amazonServiceProviderInstance ?: synchronized(this) {
                amazonServiceProviderInstance ?: AmazonServiceProvider(context, cognitoPoolId).also { amazonServiceProviderInstance = it }
            }
        }
    }
}