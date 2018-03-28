#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CoinbaseApi : NSObject <RCTBridgeModule>
@property (nonatomic, strong) NSString *clientId;
@property (nonatomic, strong) NSString *clientSecret;

+ (NSString *)getClientId;
+ (NSString *)getClientSecret;
+ (void)setClientId:(NSString *)clientId;
+ (void)setClientSecret:(NSString *)clientSecret;
@end
