//
//  EventEmitter.h
//  splash
//
//  Created by Lukas Burger on 1/3/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTEventEmitter.h>

@interface EventEmitter : RCTEventEmitter

+ (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *)payload;

@end
