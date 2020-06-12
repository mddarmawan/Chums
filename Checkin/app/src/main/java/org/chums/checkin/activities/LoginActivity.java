package org.chums.checkin.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.chums.checkin.R;
import org.chums.checkin.helpers.CachedData;
import org.chums.checkin.helpers.Json;
import org.chums.checkin.models.User;
import org.chums.checkin.models.Users;
import org.json.JSONObject;

import java.net.URLEncoder;

public class LoginActivity extends AppCompatActivity {

    SharedPreferences pref;
    SharedPreferences.Editor editor;
    EditText emailText;
    EditText passwordText;
    String email;
    String password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }

    @Override
    public void onResume() {
        super.onResume();
        pref = getSharedPreferences("Appdata", MODE_PRIVATE);
        Button send = (Button) findViewById(R.id.sendButton);
        emailText = (EditText) findViewById(R.id.emailText);
        passwordText = (EditText) findViewById(R.id.passwordText);

        emailText.setText(pref.getString("email", ""));
        passwordText.setText(pref.getString("password", ""));




        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                email = emailText.getText().toString();
                password = passwordText.getText().toString();

                if (email.isEmpty() || email.equals(null))
                    Toast.makeText(LoginActivity.this, "Please enter your email address", Toast.LENGTH_LONG).show();
                else if (password.isEmpty() || password.equals(null))
                    Toast.makeText(LoginActivity.this, "Please enter your password", Toast.LENGTH_LONG).show();
                else login();
            }
        });

        if (!pref.getString("password", "").equals("")) login();

    }


    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        // Trigger the initial hide() shortly after the activity has been
        // created, to briefly hint to the user that UI controls
        // are available.
        goFullScreen();
    }

    private void goFullScreen()
    {
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }

        View mContentView = findViewById(R.id.fullscreen_content);

        mContentView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);


        mContentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                goFullScreen();
            }
        });
    }

    private void login()
    {
        email = emailText.getText().toString();
        password = passwordText.getText().toString();


        editor = pref.edit();
        editor.putString("email", email);
        editor.putString("password", password);
        editor.commit();
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                User u = User.login(email, password);
                CachedData.ApiKey = u.ApiToken;
                nextScreen();
            }
        });
        thread.start();
    }

    private void nextScreen()
    {
        Intent browser = new Intent(LoginActivity.this, ServicesActivity.class);
        browser.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        startActivity(browser);
    }


}
