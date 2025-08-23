package com.thrivepath

import android.content.Intent
import com.facebook.react.bridge.*

class CountdownModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "CountdownModule"

    @ReactMethod
    fun startCountdown(endAt: Double) {
        val context = reactApplicationContext
        val intent = Intent(context, CountdownService::class.java)
        intent.putExtra("endAt", endAt.toLong())
        context.startForegroundService(intent)
    }

    @ReactMethod
    fun stopCountdown() {
        val context = reactApplicationContext
        val intent = Intent(context, CountdownService::class.java)
        context.stopService(intent)
    }
}
