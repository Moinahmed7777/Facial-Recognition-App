# -*- coding: utf-8 -*-
"""
Created on Tue Mar 15 12:11:28 2022

@author: Necro
"""


from flask import Flask

from flask_restful import Api

from flask_restful import Resource, reqparse,abort,fields,marshal_with,request

from Resouces import face_pred_res,insert_face_id,get_all_id,delete_id
##
app = Flask(__name__)
##
#app = application

api = Api(app)

api.add_resource(face_pred_res, '/face')
api.add_resource(insert_face_id, '/App')
api.add_resource(get_all_id, '/get')

api.add_resource(delete_id, '/delete/<string:NAME>')



if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080)
    #app.run(port=8081, debug=True)
    
    
    
