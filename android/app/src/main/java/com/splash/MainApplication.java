package com.splash;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import com.wix.interactable.Interactable;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.horcrux.svg.SvgPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.reactlibrary.RNReactNativeHapticFeedbackPackage;
import com.oblador.keychain.KeychainPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.rnfingerprint.FingerprintAuthPackage;
import org.reactnative.camera.RNCameraPackage;
import com.oblador.shimmer.RNShimmerPackage;
import com.microsoft.codepush.react.CodePush;
import io.sentry.RNSentryPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFirebasePackage(),
            new Interactable(),
            new ReactNativeContacts(),
            new SvgPackage(),
            new LinearGradientPackage(),
            new RandomBytesPackage(),
            new RNReactNativeHapticFeedbackPackage(),
            new KeychainPackage(),
            new LottiePackage(),
            new FingerprintAuthPackage(),
            new RNCameraPackage(),
            new RNShimmerPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new RNSentryPackage(MainApplication.this)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
