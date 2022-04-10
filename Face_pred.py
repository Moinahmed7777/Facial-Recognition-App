# -*- coding: utf-8 -*-
"""
Created on Tue Mar 15 12:24:01 2022

@author: Necro
"""
from PIL import Image,ImageOps
from matplotlib import pyplot
from numpy import asarray
from mtcnn.mtcnn import MTCNN
import numpy as np
from scipy.spatial.distance import cosine
from keras_vggface.vggface import VGGFace
from keras_vggface.utils import preprocess_input
import os
from math import ceil


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
    #pyplot.subplot(2, 7, 1)
    #pyplot.axis('off')
    #show_face(face_array)
    return face_array


def show_face(pixels):
    # plot the extracted face
    pyplot.imshow(pixels)
    # show the plot
    pyplot.show()



# extract faces and calculate face embeddings for a list of photo files
def get_embeddings(filenames):
	# extract faces
	#faces = [extract_face(f) for f in filenames]
    faces = extract_face(filenames)
    #print("######################################!!!!!!!!!!!!!!!")
    #print(faces.size)
    #print("######################################!!!!!!!!!!!!!!!")
	# convert into an array of samples
	
    samples = asarray(faces, 'float32')
	# prepare the face for the model, e.g. center pixels
	
    samples = preprocess_input(samples, version=2)
    
	# create a vggface model
	
    model = VGGFace(model='resnet50', include_top=False, input_shape=(224, 224, 3), pooling='avg')
	# perform prediction
	
    
    yhat = model.predict(samples)
	
    return yhat

faces = list()
def get_embeddings_dir(directory):
    
    for f in os.listdir(directory):
        X = extract_face(directory + f)
        if type(X) == int:
            if X == 1 :
                print(X)
                continue
        faces.append(X)
    print("lele")
    samples = asarray(faces,'float32')
    samples = preprocess_input(samples,version=2)
    model = VGGFace(model = 'resnet50', include_top= False, input_shape=(224,224,3), pooling='avg')
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

def func(q):
    print(q)
    if q[0][0] > 0:
        print("func true")
        return False
        
    else:
        return True
'''
import sys
import numpy
numpy.set_printoptions(threshold=sys.maxsize)
'''



def display():
    ###
    
    ###
    embeddings_per_id= 3
    
    all_embeddings = np.load('embeddings.npy')
    embeddings_id= np.load('embedding_id.npy')
    #print(len(all_embeddings))
    #print(all_embeddings[0])
    #print(type(all_embeddings))
    
    print("EMBEDDINGS")
    for index,embedding in enumerate(all_embeddings):
        #this will convert index starting from 0 to 1
        if index >= 0: index += 1
        print(index, embedding)
        #print(ceil(index/embeddings_per_id))
    print("EMBEDDINGS ID")
    for index,embedding in enumerate(embeddings_id):
        #this will convert index starting from 0 to 1
        if index >= 0: index += 1
        print(index, embedding)

def get_embedding_id():
    embeddings_id = np.load('embedding_id.npy')
    id_list = embeddings_id.tolist()
    #jsonString = json.dumps(id_list)
    #print(type(jsonString))
    return id_list
    
    
def Insert_embedding(X,embeddings_per_id):
    '''
    L = list()
    L.append("Mohiuddin Ahmed")
    L.append("Nazmeen Akther")
    L.append("Rifah Mehnaz")
    embeddings_id = np.array(L)
    print(embeddings_id)
    np.save('embedding_id.npy', embeddings_id)
    '''
    embeddings = np.load('embeddings.npy')
    New_embeddings = embeddings
    for i in range(embeddings_per_id):
        img = Image.open(X[i].stream)
        emb=get_embeddings(img)
        print('emb',emb)
        newArray = np.append(New_embeddings, emb, axis = 0)
        New_embeddings = newArray
    print('All embeddings after addition',len(New_embeddings))
    np.save('embeddings.npy', New_embeddings)
    
        

def Insert_id(ID): 
    embeddings_id = np.load('embedding_id.npy')
    embeddings_id = np.append(embeddings_id, [ID])
    #embeddings_id.append(ID)
    print(embeddings_id)
    print(len(embeddings_id))
    print(type(embeddings_id))
    np.save('embedding_id.npy', embeddings_id)

def Find_id(ID):
    embeddings_id = np.load('embedding_id.npy')
    idx = np.where(embeddings_id == ID)
    print(ID," found at index: ", idx)
     
    return idx[0][0]

def Check_id(ID):
    embeddings_id = np.load('embedding_id.npy')
    idx = np.where(embeddings_id == ID)
    if len(idx[0]) == 0:
        return False
    else:
        return True

def Delete_ID_embedding(ID,embeddings_per_id):
    embeddings_id = np.load('embedding_id.npy')
    embeddings = np.load('embeddings.npy')
    
    if (Check_id(ID)):
        id_idx = Find_id(ID)
        delete_id_idx = id_idx + 1
        
        X =delete_id_idx*embeddings_per_id - 1
        Y = X - embeddings_per_id
        
        New_embeddings = embeddings
        for i in range(X,Y,-1):
            curr_emb = np.delete(New_embeddings, i,0)
            New_embeddings = curr_emb
        New_embeddings_id = np.delete(embeddings_id, id_idx)
        
        np.save('embeddings.npy', New_embeddings)
        np.save('embedding_id.npy', New_embeddings_id)

def Check_embedding(X,embeddings_per_id):
     embeddings = np.load('embeddings.npy')
     embeddings_id = np.load('embedding_id.npy')
     score_dict =  dict()
     for i in range(len(embeddings_id)):
         score_dict[embeddings_id[i]]=0
         
     for i in range(embeddings_per_id):
         img = Image.open(X[i].stream)
         emb=get_embeddings(img)
     
     
         
         
         for index,embedding in enumerate(embeddings):
            #this will convert index starting from 0 to 1
            if index >= 0: index += 1
            pred = is_match2(embeddings[index-1],emb)
            
            idx=ceil(index/embeddings_per_id)
            if (pred[0]):
            
                score_dict[embeddings_id[idx-1]]+=pred[1]
            else:
                score_dict[embeddings_id[idx-1]]-=pred[1]
        
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
    
    
        

def pred(X,embeddings_per_id):
     img = Image.open(X.stream)
     emb=get_embeddings(img)
     
     embeddings_id = np.load('embedding_id.npy')
     embeddings = np.load('embeddings.npy')
     #emb = embeddings[0]
     #print(emb)
     score_dict =  dict()
     for i in range(len(embeddings_id)):
         score_dict[embeddings_id[i]]=0
         
     #print(idx_dict)
     for index,embedding in enumerate(embeddings):
        #this will convert index starting from 0 to 1
        if index >= 0: index += 1
        pred = is_match2(embeddings[index-1],emb)
        #print(X)
        idx=ceil(index/embeddings_per_id)
        if (pred[0]):
        
            score_dict[embeddings_id[idx-1]]+=pred[1]
        else:
            score_dict[embeddings_id[idx-1]]-=pred[1]
        #print(embeddings_id[idx-1])
        #print(ceil(index/embeddings_per_id))
        #print(index, embedding)
     print(score_dict)
     max_value = max(score_dict.values())
     if max_value <= -15:
         return "No match"
     else:
         print(max_value)
         pred_class = max(score_dict, key=score_dict.get)
         print(type(pred_class))
         return pred_class
     
     