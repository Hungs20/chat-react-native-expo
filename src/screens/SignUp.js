import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../constants';
import { RadioButton } from 'react-native-paper';
import * as firebase from 'firebase'

const Signup = ({navigation}) => {
    const [email, setEmail] = useState('user1@gmail.com')
    const [name, setName] = useState('Nguyen Van A')
    const [password, setPassword] = useState('111111')
    const [confirmPassword, setConfirmPassword] = useState('111111')
    const [gender, setGender] = useState('male')
    const [photo, setPhoto] = useState('https://ui-avatars.com/api/?name=Chat&background=random')
    const onSignup = () => {
        if(!email || !name || !password || !confirmPassword) Alert.alert('Vui lòng nhập đủ thông tin cần thiết!')
        if(password !== confirmPassword) Alert.alert('Mật khẩu nhập vào không khớp nhau!')

        firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
            let newUser = {
                name: name,
                gender: gender,
                email: email,
                tel: '',
                birthday: null,
                photo: photo,
                status: 'online',
                address: ''
            }
            if(res['user']['uid']) {
                firebase.firestore()
                        .collection('users')
                        .doc(res['user']['uid'])
                        .set(newUser)
                        .then(() => {
                            Alert.alert('Đăng ký tài khoản thành công!')
                            navigation.navigate('Profile', {
                                type: 'myProfile'
                            })
                        })
                        .catch(err => {
                            Alert.alert(err['message'])
                        })
            }
        }).catch(err => {
            Alert.alert(err['message'])
        })
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Đăng ký</Text>
            </View>

            <View style={{
                marginTop: 20
            }}>
                <View style={styles.inputSection}>
                    <RadioButton 
                        value="male"
                        status={ gender === 'male' ? 'checked' : 'unchecked'}
                        onPress={() => setGender('male')}
                        color="#f20045"
                    /><Text style={{marginRight: 30}}>Nam</Text>
                    <RadioButton 
                        value="female"
                        status={ gender === 'female' ? 'checked' : 'unchecked'}
                        onPress={() => setGender('female')}
                        color="#f20045"
                    /><Text>Nữ</Text>
                </View>
            </View>

            <View>
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="mail-outline" size={20} color="#f20042"/>
                    <TextInput
                        placeholder='Email'
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="person-outline" size={20} color="#f20042"/>
                    <TextInput
                        placeholder='Tên người dùng'
                        style={styles.input}
                        value={name}
                        onChangeText={text=>{
                            setName(text);
                            let tmpName = text.split(' ').join('+');
                            let _photo = "https://ui-avatars.com/api/?name="+tmpName+"&background=random";
                            setPhoto(_photo);
                        }
                        }
                    />
                </View>
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="lock-closed-outline" size={20} color="#f20042"/>
                    <TextInput
                        placeholder='Mật khâu'
                        secureTextEntry={true}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="lock-closed-outline" size={20} color="#f20042"/>
                    <TextInput
                        placeholder='Xác nhận Mật khâu'
                        secureTextEntry={true}
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                <Text 
                    style={{textAlign: 'right', marginTop: 5, fontSize: 15}}
                    onPress={() => {
                        navigation.navigate('ForgotPassword')
                    }}
                >
                    Forgot password?
                </Text>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => onSignup()}
                >
                    <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.gradient}>
                        <Text style={styles.text}>
                                Đăng ký</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{...FONTS.body4, marginTop: 30, alignItems: 'center'}}>
                    <Text 
                        style={{fontSize: 17, color: COLORS.primary}}
                        onPress={() => {
                            navigation.navigate('Login')
                        }}
                    >
                        Login here
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingTop: 80
    },
    inputSection: {
        flexDirection: 'row',
        paddingHorizontal:10,
        paddingVertical: 0,
        backgroundColor: COLORS.white,
        borderRadius:40,
        marginTop: 20,
        height: 50,
        alignItems: 'center',
    },
    inputIcon: {
        padding: 10,
    },
    gradient:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 25
    },
    input:{
        ...FONTS.body2,
        color: COLORS.primary,
        width: '100%'
    },
    button: {
        marginTop: 40,
        height: 50,
    },
    title: {
        ...FONTS.h1,
        textAlign: 'center',
        marginTop: 70
    },
    text: {
        ...FONTS.body2,
        color: 'white'
    },
})