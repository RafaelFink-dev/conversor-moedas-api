import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import { PickerItem } from "./src/Picker";
import { api } from "./src/services/api";

export default function App() {

  const [moedas, setMoedas] = useState([]);
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valorMoeda, setValorMoeda] = useState(null)
  const [valorConvertido, setValorConvertido] = useState(0)
  const [moedaBValor, setMoedaBValor] = useState('')
  const [mostraResultado, setMostraResultado] = useState(false)
  const [moedaSelecionadaOld, setMoedaSelecionadaOld] = useState(null)

  useEffect(() => {

    async function loadMoedas() {
      const response = await api.get("all") //Aqui realiza a requisição
      let arrayMoedas = [];
      //O retorno da APi é um objeto com todas moedas dentro, o array vai servir para pegar todas moedas e jogar dentro para mapear depois

      //Acessando cada chave (Moeda) e vamos percorrer dela
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          //Definido as propriedades do array
          key: key,
          label: key,
          value: key
        })
      })

      setMoedas(arrayMoedas)
      setMoedaSelecionada(arrayMoedas[0].key)
      setLoading(false)
    }

    loadMoedas();

  }, [])

  async function converter() {
    if (moedaBValor === 0 || moedaBValor === '' || moedaSelecionada === null) {
      return;
    }
    const response = await api.get(`/all/${moedaSelecionada}-BRL`)
    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor));//Calculando o valor

    setValorConvertido(`${resultado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`)
    setValorMoeda(moedaBValor)
    setMoedaBValor('')
    setMostraResultado(true)
    setMoedaSelecionadaOld(moedaSelecionada)
    Keyboard.dismiss()
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101215' }}>
        <ActivityIndicator color={'#FFF'} size="large" />
      </View>
    )
  }

  return (

    //O Picker é passado de um componente que renderiza só ele, aqui somente chamamos o componente
    <View style={styles.container}>

      <View style={styles.areaLogo}>
        <Image style={styles.logo}
          source={require('./src/images/logo.png')}
        />

        <Text style={styles.tituloLogo}>CONVERTE AI</Text>
      </View>


      <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>Selecione sua moeda:</Text>
        <PickerItem
          moedas={moedas}
          moedaSelecionada={moedaSelecionada}
          onChange={(moeda) => setMoedaSelecionada(moeda)} //Recebendo a moeda selecionada para alterar ela  
        />
      </View>

      <View style={styles.areaValor}>
        <Text style={styles.titulo}>Digite um valor para converter em (R$)</Text>
        <TextInput
          placeholder="EX: 1.50"
          style={styles.input}
          keyboardType="numeric"
          value={moedaBValor}
          onChangeText={(valor) => { setMoedaBValor(valor) }}
        />
      </View>

      <TouchableOpacity style={styles.botaoArea} onPress={converter}>
        <Text style={styles.botaoText}>Converter</Text>
      </TouchableOpacity>

      {mostraResultado != false &&  ( //Vendo se existe algum valor a ser convertido se sim ele mostra, caso não mostra, o & é afirmação
        <View style={styles.areaResultado}>
          <Text style={styles.valorConvertido}>
            {valorMoeda} {moedaSelecionadaOld}
          </Text>

          <Text style={{ fontSize: 18, margin: 8, color: '#000' }}>
            corresponde a
          </Text>

          <Text style={styles.valorConvertido}>
            {valorConvertido}
          </Text>

        </View>
      )}

    </View>


  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    paddingTop: 20,
    alignItems: 'center'
  },
  areaMoeda: {
    backgroundColor: '#F9F9F9',
    width: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1
  },
  titulo: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingTop: 5
  },
  areaValor: {
    width: '90%',
    backgroundColor: '#F9F9F9',
    paddingTop: 8,
    paddingBottom: 8
  },
  input: {
    width: '100%',
    padding: 8,
    fontSize: 18,
    color: '#000'
  },
  botaoArea: {
    width: '90%',
    backgroundColor: '#FB4b57',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  botaoText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  areaResultado: {
    width: '90%',
    backgroundColor: '#FFF',
    marginTop: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  valorConvertido: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold'
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  tituloLogo:{
    color:'#FFF',
    fontSize:27,
    fontWeight:'bold'
  },
  areaLogo:{
    width: '90%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:20
  }
})

