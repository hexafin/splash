import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default class Header extends Component {
    render() {
        //capitalize first letter of title
        const title = this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1);
        return (
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <Icon name={'cross'} size={30} color={'#401584'} onPress={this.props.cancelCallback}/>
                    <Text style={{fontSize: 22, fontWeight: '600'}}>{title}</Text>
                    <Image
                        style={styles.image}
                        source={{uri: this.props.picture_url}}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: 74,
        backgroundColor: '#F7F7F7',
        borderBottomWidth: .5,
        paddingHorizontal: 15,
        borderBottomColor: '#95989A',
        justifyContent: 'space-around',

    },
    topBar: {
        flex: 1,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});
