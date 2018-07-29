/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"
#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif
#import <Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  NSURL *jsCodeLocation;
  
    #ifdef DEBUG
        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    #else
        jsCodeLocation = [CodePush bundleURL];
    #endif
RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"splash"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  [RNSentry installWithRootView:rootView];

  // Add launch image to background view so that there is no visual break when starting up
  // Create the backround UIView, allocate it in memory and initialise it
  UIView *backgroundView = [[UIView alloc] init];
  
  // Create an array with all the png image resources
  NSArray *allPngImageNames = [[NSBundle mainBundle]
                               pathsForResourcesOfType:@"png" inDirectory:nil];
  
  // Loop through the images
  for (NSString *imgName in allPngImageNames) {
    
    // Find the launch images
    if ([imgName containsString:@"LaunchImage"]) {
      
      UIImage *img = [UIImage imageNamed:imgName];
      
      // Check for scale and dimensions as current device
      if (img.scale == [UIScreen mainScreen].scale &&
          CGSizeEqualToSize(img.size,[UIScreen mainScreen].bounds.size)) {
        
        // Create an image view, allocate it in memory and initialise it with
        // the image that we have found
        UIImageView *imageView = [[UIImageView alloc]
                                  initWithImage:[UIImage imageNamed:imgName]];
        // Add the image view to the top of the stack of subviews
        [backgroundView addSubview:imageView];
      }
    }
  }

  // Make sure there is no colour blocking the image
  rootView.backgroundColor = [UIColor clearColor];
  rootView.loadingViewFadeDelay = 0.0;
  rootView.loadingViewFadeDuration = 0.15;
  
  self.window = [[UIWindow alloc]
                 initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];

  rootViewController.view = backgroundView;
  
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [backgroundView addSubview:rootView];
  rootView.frame = backgroundView.frame;

  return YES;
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
                                                       fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

@end
