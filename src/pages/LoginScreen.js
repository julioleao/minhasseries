import React from 'react';
import {View, TextInput, StyleSheet, Button, ActivityIndicator, Text, Alert} from 'react-native';
import firebase from 'firebase';

import FormRow from '../components/FormRow'

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state ={
            email: "",
            password: "",
            isLoading: false,
            message: "",
        }
    }

    componentDidMount() {
        var firebaseConfig = {
            apiKey: "AIzaSyAzukPmg2EfJD8nbbOvY4bT2rYEUr_Uj_g",
            authDomain: "minhasseries-630a4.firebaseapp.com",
            databaseURL: "https://minhasseries-630a4.firebaseio.com",
            projectId: "minhasseries-630a4",
            storageBucket: "minhasseries-630a4.appspot.com",
            messagingSenderId: "567239862220",
            appId: "1:567239862220:web:f44c10c7ad1fb23b2f5f69",
            measurementId: "G-QRG13QL7MH"
          };
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
    }

    onChangeHandler(field, valor) {
        this.setState({
            [field]: valor
        })
    }

    processLogin() {
        this.setState({ isLoading: true });

        const {email, password} = this.state;

        const loginUserSuccess = user => {
            this.setState({ message: "Sucesso!"});
        }

        const loginUserFailed = (error)  => {
            this.setState({ 
                message: this.getMessageByError(error.code)
            });
        }

        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(loginUserSuccess)
        .catch(error => {
            if(error.code == "auth/user-not-found") {
                Alert.alert(
                    "Usuário não encontrado",
                    "Deseja criar um novo usuário?",
                    [{
                        text: 'Não',
                        onPress: () => {
                            console.log('Usuario não quis criar nova conta.');
                        }
                    }, {
                        text: 'Sim',
                        onPress: () => {
                            firebase
                                .auth()
                                .createUserWithEmailAndPassword(email, password)
                                .then(loginUserSuccess)
                                .catch(loginUserFailed(error))
                        }
                    }],
                    { cancelable: true }
                );
            }
            loginUserFailed(error)
        })
        .then( () => {
            this.setState({ isLoading: false });
        })
    }

    getMessageByError(code) {
        switch (code) {
            case "auth/user-not-found":
                return "E-mail inexistente.";
            case "auth/wrong-password":
                return "Senha incorreta.";
            case "auth/invalid-email":
                return "E-mail inexistente.";
            default:
                return "Erro desconhecido";
        }
    }

    renderButton() {
        if(this.state.isLoading)
            return <ActivityIndicator />
        return (
            <Button 
                title='Entrar'
                onPress={() => this.processLogin()}
            />
        );   
    }

    renderMessage() {
        const { message } = this.state;

        if(!message)
            return null;

        return (
            <View>
                <Text>{message}</Text>
            </View>
        );
    }

    render() {
        return(
            <View>
                <FormRow>
                    <TextInput
                        style={styles.textInput}
                        placeholder="E-mail: user@provider.com"
                        value={this.state.email}
                        onChangeText={valor => {
                            this.onChangeHandler('email', valor)
                        }}
                    />
                    
                </FormRow>
                <FormRow>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your password here"
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={valor => {
                            this.onChangeHandler('password', valor)
                        }}
                    />
                </FormRow>

                { this.renderButton() }
                { this.renderMessage() }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        paddingLeft: 10,
        paddingRight: 10
    },
})