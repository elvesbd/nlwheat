import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { styles } from './styles';

import LogoSvg from '../../assets/logo.svg';
import { UserPhoto } from '../UserPhoto';

export function Header(){
  return (
    <View style={styles.container}>
      <LogoSvg />

     <View style={styles.logoutButton}>
      <TouchableOpacity>
          <Text style={styles.logOutText}>
            Sair
          </Text>
        </TouchableOpacity>

        <UserPhoto imageUri='https://github.com/elvesbd.png'/>
     </View>
    </View>
  );
}