/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import "AppDelegate.h"
#import <Firebase.h>
#import "CoinbaseOAuth.h"
#import "CoinbaseApi.h"
#import "EventEmitter.h"
#import <React/RCTBridge.h>
#import <React/RCTEventEmitter.h>
@import Firebase;
@import UIKit;

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate {
  RCTEventEmitter *_eventDispatcher;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  NSURL *jsCodeLocation;
  // BUNDLE
  // jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  // DEVELOP WITH NODE
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"hexa"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                      didFinishLaunchingWithOptions:launchOptions];
}

// Facebook SDK
- (void)applicationDidBecomeActive:(UIApplication *)application {
    [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  BOOL success = NO;
  if ([[url scheme] isEqualToString:@"com.hexa-splash.coinbase-oauth"]) {
    [CoinbaseOAuth finishOAuthAuthenticationForUrl:url
                                          clientId:[CoinbaseApi getClientId]
                                      clientSecret:[CoinbaseApi getClientSecret]
                                        completion:^(id result, NSError *error) {
                                          if (error) {
                                            [[[UIAlertView alloc] initWithTitle:@"OAuth Error" message:[error localizedDescription] delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil] show];
                                          } else {
                                            /* Send an app event with the API key */
                                            /* { */
                                            /*     "access_token" = xxxxxxxxxxxxxxxxxxxxxxxxxx; */
                                            /*     "expires_in" = 7200; */
                                            /*     "refresh_token" = yyyyyyyyyyyyyyyyyyyyyyyyyy; */
                                            /*     "scope" = "user balance transfer"; */
                                            /*     "token_type" = bearer; */
                                            /* } */
                                            [EventEmitter emitEventWithName:@"CoinbaseOAuthComplete" andPayload:result];
                                          }
                                        }];
        success = YES;
      }
  
  if (!success) {
    success = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                             openURL:url
                                                   sourceApplication:sourceApplication
                                                          annotation:annotation];
  }
  return success;
}

@end
