# -*- coding: utf-8 -*-
"""
Created on Tue Mar 15 12:24:01 2022

@author: Necro
"""
from PIL import Image,ImageOps
from numpy import asarray
from mtcnn.mtcnn import MTCNN
import numpy as np
from scipy.spatial.distance import cosine
from keras_vggface.vggface import VGGFace
from keras_vggface.utils import preprocess_input
import os
from math import ceil


import sqlite3


def extract_face(filepath,required_size = (224, 224)):
    #load image
    #print(filepath)
    image = filepath
    print("######################################")
    print(image.size)
    print("######################################")
    
    # convert to RGB, if needed
    print(filepath)
    image = image.convert('RGB')
    #if filepath != "C:/Users/Moina/Desktop/Proj_FaceRecognition/face_images/train/Simin/20211225_142558.jpg":
        #image = image.resize((3000, 3000))
    #image = image.transpose(Image.ROTATE_270)
    image =ImageOps.exif_transpose(image)
    #image.show()
    #convert to np array
    pixels = asarray(image)
    
    # create the detector, using default weights
    detector = MTCNN()
    
    #detect faces in the image
    results = detector.detect_faces(pixels)
    
    print("######################################")
    print(results)
    print("######################################")
    if len(results)==0:
        print(results)
        return 1
    
    # extract the bounding box from the first face
    x1, y1, width, height = results[0]['box']
    
    # bug fix
    x1, y1 = abs(x1), abs(y1)
    x2, y2 = x1 + width, y1 + height

    # extract the face
    face = pixels[y1:y2, x1:x2]
    
    # resize pixels to the model size
    image = Image.fromarray(face)
    image = image.resize(required_size)
    numpydata = asarray(image)
    
    #expand the dimensions according to the required tflite model input  
    npd = np.expand_dims(numpydata, axis=0)
    
    #img = cv2.resize(image,(224,224))     # resize image to match model's expected sizing
    #img = image.reshape(1,224,224,3) # return the image with shaping that TF wants.
    print(npd.size)
    face_array = npd
    
    return face_array



# extract faces and calculate face embeddings for a list of photo files
def get_embeddings(filenames):
	# extract faces
	#faces = [extract_face(f) for f in filenames]
    faces = extract_face(filenames)
	# convert into an array of samples
    samples = asarray(faces, 'float32')
	# prepare the face for the model, e.g. center pixels
    samples = preprocess_input(samples, version=2)
    
	# create a vggface model
    model = VGGFace(model='resnet50', include_top=False, input_shape=(224, 224, 3), pooling='avg')
	# perform prediction
	
    yhat = model.predict(samples)
	
    return yhat



def is_match(known_embedding, candidate_embedding,i,thresh=0.50):
    # calculate distance between embeddings
    score = cosine(known_embedding,candidate_embedding)
    if score <= thresh:
        print('>face is a Match (%.3f <= %.3f)' % (score, thresh))
        
        #count =+ 1
    else:
        print('>face is NOT a Match (%.3f > %.3f)' % (score, thresh))
        #show_face(faces[i])

def is_match2(known_embedding, candidate_embedding,thresh=0.50):
    # calculate distance between embeddings
    score = cosine(known_embedding,candidate_embedding)
    if score <= thresh:
        print('>face is a Match (%.3f <= %.3f)' % (score, thresh))
        #theta = (score//0.50)*100*(33.33/100)
        theta = (1-score)*(100/3)
        return [True,theta]
    else:
        print('>face is NOT a Match (%.3f > %.3f)' % (score, thresh))
        #theta = -(((score//1)*100)-50)
        theta = (1-score)*(100/3)
        return [False,theta]

#*#
def get_embedding_id():
    
    conn = sqlite3.connect('faces.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM faces')
    id_list = []
    rows = cursor.fetchall()
    for row in rows:
        id_list.append(str(row[1]))
    conn.close()
    return id_list
    
#*#    
def Insert_embedding(X,embeddings_per_id,name):
    '''
    insert emb1,emb2,emb3 for the new face
    '''
    
    conn = sqlite3.connect('faces.db')
    cursor = conn.cursor()
    emb_list = []
    for i in range(embeddings_per_id):
        img = Image.open(X[i].stream)
        emb=get_embeddings(img)
        emb_list.append(emb)
    n = str(name)
    cursor.execute(''' INSERT INTO faces (name,embeddings1,embeddings2,embeddings3) VALUES(?,?,?,?)''',(n,sqlite3.Binary(emb_list[0].tostring()),sqlite3.Binary(emb_list[1].tostring()),sqlite3.Binary(emb_list[2].tostring()),))
    conn.commit()
    conn.close()   

#*#
def Check_id(ID):
    
    conn = sqlite3.connect('faces.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM faces')
    rows = cursor.fetchall()
    conn.close()
    for row in rows:
        if row[1]== ID:
            return True
    return False
    
#*#
def Check_embedding(X,embeddings_per_id):
     #embeddings = np.load('embeddings.npy')
     #embeddings_id = np.load('embedding_id.npy')
     
     conn = sqlite3.connect('faces.db')
     cursor = conn.cursor()
     cursor.execute('SELECT * FROM faces')
     rows = cursor.fetchall()
     
     score_dict =  dict()
     for row in rows:
         score_dict[row[1]]=0
         
     for i in range(embeddings_per_id):
         img = Image.open(X[i].stream)
         new_embedding=get_embeddings(img)
     
         for idx,name,embedding1,embedding2,embedding3 in rows:
             #convert blob to np array
             pred_1 = is_match2(np.fromstring(embedding1, dtype=np.float32),new_embedding)
             pred_2 = is_match2(np.fromstring(embedding2, dtype=np.float32),new_embedding)
             pred_3 = is_match2(np.fromstring(embedding3, dtype=np.float32),new_embedding)
         
             if (pred_1[0]):
                 score_dict[name]+=pred_1[1]
             else:
                 score_dict[name]-=pred_1[1]
             if (pred_2[0]):
                 score_dict[name]+=pred_2[1]
             else:
                 score_dict[name]-=pred_2[1]
             if (pred_3[0]):
                 score_dict[name]+=pred_3[1]
             else:
                 score_dict[name]-=pred_3[1]
     conn.close()
        
     print(score_dict)
     max_value = max(score_dict.values())
     if max_value >= 90:
         print("possible match, value :",max_value )
         return True
     else:
         print("No Match")
         #pred_class = max(score_dict, key=score_dict.get)
         #print(type(pred_class))
         return False
#*#     
def Check_face(X,embeddings_per_id):
    face_table=[True]*3
    
    for i in range(embeddings_per_id):
         image = Image.open(X[i].stream)
         # convert to RGB, if needed
         image = image.convert('RGB')
         #face align
         image =ImageOps.exif_transpose(image)
         
         #convert to np array
         pixels = asarray(image)
         
         # create the detector, using default weights
         detector = MTCNN()
         
         #detect faces in the image
         results = detector.detect_faces(pixels)
         
         if len(results)==0:
             face_table[i]=False
    truth_count=0
    false_idx=list()
    for j in range(len(face_table)):
        if face_table[j]:
            truth_count+=1
        else:
            false_idx.append(j+1)
    if truth_count == embeddings_per_id:
        return [True,0]
    else:
        return [False,false_idx]
    
    
        
#*#
def pred(X,embeddings_per_id):
     img = Image.open(X.stream)
     new_embedding=get_embeddings(img)
     
     ##
     conn = sqlite3.connect('faces.db')

     cursor = conn.cursor()
     
     cursor.execute('SELECT * FROM faces')
     
     # Fetch all the rows
     rows = cursor.fetchall()
     
     ##
     #embeddings_id = np.load('embedding_id.npy')
     #embeddings = np.load('embeddings.npy')
     
    
     score_dict =  dict()
     for row in rows:
         score_dict[row[1]]=0
     
     for idx,name,embedding1,embedding2,embedding3 in rows:
         #convert blob to np array*
         pred_1 = is_match2(np.fromstring(embedding1, dtype=np.float32),new_embedding)
         pred_2 = is_match2(np.fromstring(embedding2, dtype=np.float32),new_embedding)
         pred_3 = is_match2(np.fromstring(embedding3, dtype=np.float32),new_embedding)
         
         if (pred_1[0]):
             score_dict[name]+=pred_1[1]
         else:
             score_dict[name]-=pred_1[1]
         if (pred_2[0]):
             score_dict[name]+=pred_2[1]
         else:
             score_dict[name]-=pred_2[1]
         if (pred_3[0]):
             score_dict[name]+=pred_3[1]
         else:
             score_dict[name]-=pred_3[1]
     conn.close()
         
    
     
     print(score_dict)
     max_value = max(score_dict.values())
     if max_value <= -15:
         return "No match"
     else:
         print(max_value)
         pred_class = max(score_dict, key=score_dict.get)
         print(type(pred_class))
         return pred_class
     

def delete_face(name):
    conn = sqlite3.connect('faces.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM faces WHERE name ?',(name,))
    conn.commit()
    conn.close()
    return
    
    