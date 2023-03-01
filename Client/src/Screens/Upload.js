import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {setFaceid, setUpload} from '../redux/actions';
import {api, api2} from '../constants';
import RNFS from 'react-native-fs';

export default function Upload({navigation}) {
  const {faceid, upload} = useSelector(state => state.faceidReducer);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh_Mainscreen();
  }, []);

  const refresh_Mainscreen = () => {
    if (faceid.length != 0) {
      RNFS.unlink(faceid[0].Path)
        .then(() => {})
        .catch(error => console.log(error));

      let emp_list = [];
      dispatch(setFaceid(emp_list));
    }
  };

  const createFormData = (body = {}) => {
    const data = new FormData();
    upload.forEach(item => {
      data.append('image[]', {
        uri:
          Platform.OS === 'ios'
            ? item.Imagefile.uri.replace('file://', '')
            : item.Imagefile.uri,
        type: 'image/jpeg',
        name: item.Imagefile.fileName,
      });
      console.log('uri: ', item.Imagefile.uri);
      // console.log('type: ')
      console.log('name: ', item.Imagefile.fileName);
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    console.log('data in upload', data);
    return data;
  };

  const savetodatabase2 = () => {
    setLoading(true);
    fetch(api2, {
      method: 'post',
      body: createFormData({userId: name}),
    })
      .then(response => response.json())
      .then(response => {
        Alert.alert('Alert!', response.message);
        setLoading(false);
        navigation.goBack();
      })
      .catch(error => {
        console.log('error', error);
        setLoading(false);
      });
  };

  const refresh = () => {
    upload.forEach(item => {
      RNFS.unlink(item.Image)
        .then(() => {})
        .catch(error => console.log(error));
    });
    let emp_list = [];
    let emp_str = '';
    dispatch(setUpload(emp_list));
    setName(emp_str);
  };
  return (
    <View style={styles.body}>
      <FlatList
        data={upload}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.image}
            onPress={() => {
              navigation.navigate('Display', {ID: index});
            }}>
            <View style={styles.Image_body}>
              <Image style={styles.image} source={{uri: item.Image}} />
            </View>
          </TouchableOpacity>
        )}
      />
      {upload.length == 3 ? null : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('Camera', {Task: 2, Imageid: 0});
          }}>
          <FontAwesome5 name={'plus'} size={20} color={'#aba669'} />
        </TouchableOpacity>
      )}

      <View style={styles.column}>
        <TextInput
          value={name}
          style={styles.extra_button}
          placeholder="Name of the person ?"
          placeholderTextColor="#aba66977"
          onChangeText={value => setName(value)}></TextInput>
        <TouchableOpacity
          style={styles.extra_button}
          onPress={() => {
            //upload func
            if (name) {
              if (upload.length == 3) {
                savetodatabase2();
              } else {
                Alert.alert('Error', 'Please add 3 photos!');
              }
            } else {
              Alert.alert('Error', 'Please enter the persons name !');
            }
          }}>
          {loading ? (
            <View style={styles.row}>
              <Text style={styles.text}>Uploading...</Text>
              <ActivityIndicator style={styles.row} />
            </View>
          ) : (
            <Text style={styles.text}>Upload photos</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.extra_button}
          onPress={() => {
            refresh();
          }}>
          <Text style={styles.text}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000',
  },
  Activitysign: {
    flex: 1,
    flexDirection: 'column',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
  },
  Image_body: {
    flex: 1,
    alignItems: 'center',
    // padding: 10,
    backgroundColor: '#000',
  },

  text: {
    color: '#aba669',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
    margin: 10,
  },
  body_text: {
    color: '#aba669',
    backgroundColor: '#000',
    margin: 10,
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
  },
  extra_button: {
    // flex: 1,
    height: 50,
    width: 200,
    backgroundColor: '#144357',
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#aba669',
    textAlign: 'center',
  },
  column: {
    // flex: 1,
    flexDirection: 'column',
    height: 250,
  },
  column2: {
    flexDirection: 'column',
    height: 25,
  },
  row: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    margin: 20,
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#144357',

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    elevation: 5,
  },
});

//#31454E #fd7600 #3E1558 #aba669
