import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image} from 'react-native'
import {Camera} from 'expo-camera'
import * as Speech from 'expo-speech'

let camera: Camera
export default function TabOneScreen() {
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState<any>(null)
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = React.useState('off')
  const [api, setApi] = React.useState('object')

  
  const __startCamera = async () => {
    const {status} = await Camera.requestPermissionsAsync()
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }
  const __takePicture = async () => {
    const photo: any = await camera.takePictureAsync({skipProcessing: true})
    setPreviewVisible(true)
    setCapturedImage(photo)
    if (api == 'object'){
      detectObject(photo)
    } else{
      detectText(photo)
    }
  }

  const detectObject = (photo) => {
    fetch('https://pshackathon.herokuapp.com/detectObject',{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:photo
            })
        .then(response => {
            if (response.status >= 400 ) {
                Speech.speak("Error while processing request",({rate:0.8, onDone: complete}))
            }
            return response.json()
        })
        .then(responseJson => {
            console.log("API CALL RESULT",responseJson);
            if (responseJson["result"].length > 0) {
                Speech.speak(responseJson["result"],({rate:0.8, onDone: complete}));
            } else {Speech.speak("Error while processing request",({rate:0.8, onDone: complete}))}
            
        })
  }

  const detectText = (photo) => {
    fetch('https://pshackathon.herokuapp.com/detectText',{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:photo
            })
        .then(response => {
            if (response.status >= 400 ) {
                Speech.speak("Error while processing request", ({rate:0.8, onDone: complete}))
            }
            return response.json()
        })
        .then(responseJson => {
            console.log("API CALL RESULT",responseJson);
            if (responseJson["result"].length > 0) {
                Speech.speak(responseJson["result"], ({rate:0.8, onDone: complete}))
            } else {Speech.speak("Error while retrieving response", ({rate:0.8, onDone: complete}))}
        });
  }

  const __savePhoto = () => {}
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }

  const complete = () => {
    setStartCamera(false)
    Speech.speak('Please provide input for new request.')
      
    };
  
  const __objectPicture = () => {
    setApi('object')
    __startCamera()
  }

  const __textPicture = () => {
    setApi('text')
    __startCamera()
  }

  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
          ) : (
            <Camera useCamera2Api={true}
              type={cameraType}
              flashMode={flashMode}
              style={{flex: 1}}
              ref={(r) => {
                camera = r
              }}
            >
              <View 
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      ⚡️
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                      marginTop: 20,
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      {cameraType === 'front' ? '🤳' : '📷'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={__takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View accessible={true}
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent:'center',
            alignItems:'center'
          }}
        >
          <TouchableOpacity
            onPress={__objectPicture}
            style={{
              width: 300,
              borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 100,
              marginBottom: '50%'
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize:40,
                textAlign: 'center'
              }}
            >
              Detect Object
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={__textPicture}
            style={{
              width: 300,
              borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 100,
              marginTop: '10%'
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize:40,
                textAlign: 'center'
              }}
            >
              Detect Text
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                save photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}
