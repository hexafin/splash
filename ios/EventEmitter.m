//
//  EventEmitter.m
//  splash
//
//  Created by Lukas Burger on 1/3/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "EventEmitter.h"

@implementation EventEmitter

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"NativeEvent"];
}

RCT_EXPORT_METHOD(startObserving)
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(emitEventInternal:)
                                               name:@"event-emitted"
                                             object:nil];
}

RCT_EXPORT_METHOD(stopObserving)
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)emitEventInternal:(NSNotification *)notification
{
  [self sendEventWithName:@"NativeEvent"
                     body:notification.userInfo];
}

+ (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *)payload
{
  NSLog(@"%@", payload);
  [[NSNotificationCenter defaultCenter] postNotificationName:@"event-emitted"
                                                      object:self
                                                    userInfo:payload];
}

// Remaining methods

@end
