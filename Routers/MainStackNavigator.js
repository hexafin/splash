import { StackNavigator } from 'react-navigation';
import  HomeScreen from '../Screens/Home';
import  ComposeScreen from '../Screens/Compose';


export default (MainNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  Compose: { screen: ComposeScreen },
},
{
  navigationOptions: ({ navigation })  => ({
    headerTintColor: 'white',
    headerStyle: { backgroundColor: '#401584', padding: 10, },
  }),
}));
