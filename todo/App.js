import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from "./colors";
import { useState, useEffect } from 'react';
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
  }, []);
  const otherThing = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch(e) {
      console.error(e);
      alert("🚨저장 중 오류가 발생했습니다! 개발자에게 문의 부탁드려요!🚨");
    }
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      s !== null ? setToDos(JSON.parse(s)) : null;
    } catch(e) {
      console.error(e);
      alert("🚨불러오기 중 오류가 발생했습니다! 개발자에게 문의 부탁드려요!🚨");
    }
  };
  const addTodo = async () => {
    if(text === "") {
      return;
    }
    const newToDos = {...toDos, [Date.now()]: { text, working }};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("정말 삭제하시겠습니까?", "진짜루?", [
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
      { text: "취소" },
    ]);
  };
  // console.log(toDos);
  // console.log(working);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>👩‍💻회사</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={otherThing}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>현생💏</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          style={styles.input}
          value={text}
          returnKeyType='done'
          placeholder={working ? "할 일 작성" : "작성하기"} 
          onChangeText={onChangeText}
          onSubmitEditing={addTodo}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : null
         ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
