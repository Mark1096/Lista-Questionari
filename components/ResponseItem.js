import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons} from '@expo/vector-icons';

export default class ResponseItem extends React.Component {
    render() {
        var {response} = this.props.data;
        var {select} = this.props.data;
        return(
            <TouchableHighlight onPress={this.props.onToggle} underlayColor={'#EAEAEA'}>
                <View style={styles.container}>
                    <View>
                        {select ? (
                            <MaterialCommunityIcons 
                                name={"checkbox-marked-circle"}
                                size={35} 
                                color={"blue"}
                            />
                        ) : (
                            <MaterialCommunityIcons 
                                name={"checkbox-blank-circle-outline"}
                                size={35} 
                                color={"blue"}
                            />
                        )}
                    </View>
                    <View>
                        <Text style={styles.text}> {response} </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
} 

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        flexDirection: "row",
        paddingVertical: 5,
        borderBottomColor: "gray",
        marginHorizontal: 10,
    },
    text: {
        fontSize: 22,
        color: "black",
    }
})