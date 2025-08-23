package com.thrivepath

import android.app.*
import android.content.Intent
import android.os.*
import androidx.core.app.NotificationCompat
import java.util.*

class CountdownService : Service() {

    private var timer: CountDownTimer? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val endAt = intent?.getLongExtra("endAt", 0L) ?: 0L
        if (endAt > 0) {
            startForegroundService(endAt)
        }
        return START_STICKY
    }

    private fun startForegroundService(endAt: Long) {
        val channelId = "countdown_channel"
        createNotificationChannel(channelId)

        timer?.cancel()
        val msLeft = endAt - System.currentTimeMillis()

        timer = object : CountDownTimer(msLeft, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val formatted = formatTime(millisUntilFinished)
                val notification = NotificationCompat.Builder(this@CountdownService, channelId)
                    .setContentTitle("Countdown running")
                    .setContentText("Time left: $formatted")
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setOngoing(true)
                    .build()

                startForeground(1, notification)
            }

            override fun onFinish() {
                val notification = NotificationCompat.Builder(this@CountdownService, channelId)
                    .setContentTitle("Time’s up!")
                    .setContentText("Countdown finished.")
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .build()

                val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
                manager.notify(2, notification)

                stopSelf()
            }
        }.start()
    }

    private fun formatTime(ms: Long): String {
        val s = ms / 1000
        val h = s / 3600
        val m = (s % 3600) / 60
        val sec = s % 60
        return String.format("%02d:%02d:%02d", h, m, sec)
    }

    private fun createNotificationChannel(channelId: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Countdown Timer",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
