import {View, Text, StyleSheet, PermissionsAndroid, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {launchCamera} from 'react-native-image-picker';
import {api, api2} from '../constants';

import {useDispatch, useSelector} from 'react-redux';
import {setFaceid, setUpload} from '../redux/actions';

const createFormData = (image, body = {}) => {
  const data = new FormData();

  data.append('image', {
    name: image.fileName,
    type: image.type,
    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  console.log('data in upload 1st', data);
  return data;
};

export default function Camera({navigation, route}) {
  const task = route.params.Task;
  const Imageid = route.params.Imageid;
  console.log('task number', task);
  const [filePath, setFilePath] = useState('');

  const {faceid, upload} = useSelector(state => state.faceidReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    captureImage('photo');
    // getTasks();
  }, []);

  const upld3 = imagePath => {
    fetch(api, {
      method: 'put',
      body: createFormData(imagePath, {userId: '123'}),
    })
      .then(response => response.json())
      .then(response => {
        console.log('response from api', response);
        var face = {
          ID: response,
          Path: imagePath.uri,
        };
        let newTasks = [face];
        console.log('imagePath.uri', imagePath.uri);
        dispatch(setFaceid(newTasks));
        // resultlist = [];
        // resultlist.push({response});
        // dispatch(setFaceid(resultlist));
        // console.log('resultlist', resultlist);
        console.log('faceid', faceid);
        // this.setState({
        //   data: response,
        // });
        navigation.navigate('Mainscreen');
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const takeImages = Imageobject => {
    var face = {
      // ID: taskID, imageobject =response.assets[0]
      Image: Imageobject.uri,
      Imagefile: Imageobject,
    };
    if (upload.length != 3) {
      let facelist = [...upload, face];
      dispatch(setUpload(facelist));
    }
    // console.log('upload.length', faceid.length);
    navigation.goBack();
  };

  const updateImages = Imageobject => {
    var newImg = {
      Image: Imageobject.uri,
      Imagefile: Imageobject,
    };
    upload[Imageid] = newImg;
    dispatch(setUpload(upload));
    navigation.goBack();
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      cameraType: 'front',
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return navigation.goBack();
          //   return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        console.log('Response = ', response.assets[0]);
        if (task == 1) {
          upld3(response.assets[0]);
        }
        if (task == 2) {
          takeImages(response.assets[0]);
        }
        if (task == 3) {
          // takeImages(response.assets[0]);
          updateImages(response.assets[0]);
        }
        if (task == 4) {
          // takeImages(response.assets[0]);
        }

        // console.log('base64 -> ', response.assets[0].base64);
        console.log('uri -> ', response.assets[0].uri);
        console.log('width -> ', response.assets[0].width);
        console.log('height -> ', response.assets[0].height);
        console.log('fileSize -> ', response.assets[0].fileSize);
        console.log('type -> ', response.assets[0].type);
        console.log('fileName -> ', response.assets[0].fileName);
        setFilePath(response.assets[0].uri);
        // navigation.goBack();
        // updateTask(ID, response.assets[0].uri);

        // return
      });
    }
  };

  return (
    // <View style={styles.body}>
    //   {/* <CustomButon title="cancel" color="#ff7f00" onPressFunction={null} /> */}
    //   <Text>Loading</Text>
    //   <Image
    //     style={styles.image}
    //     source={require('../../assets/Untitled.png')}></Image>
    // </View>
    <View style={styles.body}>
      <Image
        style={styles.logo}
        source={require('../../assets/ah.jpg')}></Image>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  // body: {
  //   flex: 1,
  //   // backgroundColor: '#000',
  //   alignItems: 'center',
  //   padding: 10,
  // },
  image: {
    width: 300,
    height: 300,
    margin: 20,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  logo: {
    width: 100,
    // fontWeight: 'bold',
    height: 100,
    margin: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
    color: '#144357',
    // color: '#31454E'
  },
});
