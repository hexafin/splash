import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"

const EmojiCircle = ({emoji, active, pressCallback}) => {
  return (
    <TouchableOpacity style={[styles.container, (active && styles.active)]} onPress={pressCallback}>
      <Text style={styles.emoji}>{emoji}</Text>
    </TouchableOpacity>
  )};

export default EmojiCircle;

const styles = StyleSheet.create({
  container: {
    height: 72,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
    backgroundColor: colors.white,
    ...defaults.shadow,
    shadowOffset: {height: 4},
    shadowRadius: 10,
  },
  emoji: {
    fontSize: 36,
  },
  active: {
    borderColor: colors.purple,
    borderWidth: 3,
  }
});
