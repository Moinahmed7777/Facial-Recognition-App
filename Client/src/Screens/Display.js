//Image display screen for update,delete,go Back buttons.
//After Uploading the Images.

import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import CustomButon from '../utils/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {setFaceid, setUpload} from '../redux/actions';

export default function Display({navigation, route}) {
  const index_img = route.params.ID;

  console.log('index_img in display', index_img);

  const {faceid, upload} = useSelector(state => state.faceidReducer);
  const dispatch = useDispatch();

  const update_img = () => {
    navigation.navigate('Camera', {Task: 3, Imageid: index_img});
  };

  const delete_img = () => {
    // navigation.navigate('Camera', {Task: 4});
    // console.log('imagelistbeforedel', upload);
    upload.splice(index_img, 1);
    dispatch(setUpload(upload));
    // console.log('imagelistafterdel', upload);
    // navigation.navigate('Mainscreen');
    navigation.goBack();
  };

  return (
    <View style={styles.body}>
      {upload[index_img] ? (
        <Image
          style={styles.image}
          // source={require('../../assets/2.jpg')}
          source={{uri: upload[index_img].Image}}
        />
      ) : null}
      <View style={styles.column}>
        <CustomButon
          title="Go Back"
          color="#144357"
          onPressFunction={() => {
            navigation.navigate('Upload');
          }}
        />
        <CustomButon
          title="Update"
          color="#144357"
          onPressFunction={() => {
            update_img();
          }}
        />
        <CustomButon
          title="Delete"
          color="#144357"
          onPressFunction={() => {
            delete_img();
          }}
        />
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
  image: {
    width: 300,
    height: 550,
    margin: 20,
  },
  column: {
    // flex: 1,
    flexDirection: 'row',
    // height: 50,
  },
});
