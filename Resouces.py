# -*- coding: utf-8 -*-
"""
Created on Tue Mar 15 13:35:48 2022

@author: Necro
"""
from flask_restful import Resource, reqparse,abort,fields,marshal_with,request
import gc



from Face_pred import pred,Insert_embedding,Check_embedding,Check_id,Check_face,get_embedding_id
    
from flask import jsonify

class face_pred_res(Resource):
    parser = reqparse.RequestParser()
    
    def put(self):
        
        data1 = face_pred_res.parser.parse_args()
        embeddings_per_id = 3
        
        if 'image' not in request.files:
            return "No file part"
        
        file = request.files['image']
        
        prediction = pred(file,embeddings_per_id)
        gc.collect()
        return prediction

class insert_face_id(Resource):
    parser = reqparse.RequestParser()
    
    def post(self):
        data1 = face_pred_res.parser.parse_args()
        embeddings_per_id = 3
        if 'image[]' not in request.files:
            print('no files')
        
        file = request.files.getlist("image[]")
        
        form = request.form.get('userId')
        print('form',form)
        face_box= Check_face(file,embeddings_per_id)
        print('#################')
        print(face_box)
        print('#################')
        if (face_box[0]):
            if(Check_id(form)):
                #print('Face ID name already Exist')
                gc.collect()
                return {"message": "Face ID name already Exist."}, 500 # Internal Server Error
            elif(Check_embedding(file,embeddings_per_id)):
                #print('Face embeddings might be same')
                gc.collect()
                return {"message": "Face embeddings might be same."}, 500 # Internal Server Error
            else:
            
                Insert_embedding(file,embeddings_per_id,form)
                #Insert_id(form)
                gc.collect()
                return {"message": "Face id Store success"}, 201
        else:
            print('Face doesnt exist in image',face_box[1])
            le_str=''
            for x in face_box[1]:
                le_str=le_str+str(x)+' , '
            gc.collect()
            return {"message": "Face doesnt exist in image " + le_str}, 500 # Internal Server Error
        

class get_all_id(Resource):
    parser = reqparse.RequestParser()
    
    def get(self):
        data1 = face_pred_res.parser.parse_args()
        list = get_embedding_id()
        print("list",list)
        length=len(list)
        string = ''
        
        for i in range(length):
            if i == (length-1):
                string= string + list[i]
            else:
                string= string + list[i] + ','
        print("all id string",string)
        print( 'type',type(string))
        X = jsonify([{list[0]: list[0]}])
        gc.collect()
        return string 

class delete_id(Resource):
    parser = reqparse.RequestParser()
    def delete(self):
        #form = request.form.get('ID')
        form = request.json.get('ID')

        print('form',form)
        return 'lel'
