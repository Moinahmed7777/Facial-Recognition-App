# Facial Recognition App

## Overview
This is a fully functional mobile application for facial recognition. The project uses Convolutional Neural Networks (CNNs) to detect and verify faces. It showcases how to apply machine learning in mobile applications, create REST API endpoints using Flask, communicate with SQLite database, and connect the backend server with the front-end user interface.

## Features
- Utilizes Convolutional Neural Networks (CNNs) for facial recognition. MTCNN to detect faces and FACE NET to create a face embedding of the face.
- Front-end user interface designed using React Native.
- Backend REST API designed using the Flask framework.
- Communication with SQLite database to store and retrieve face embeddings.
- Deployment on an AWS server.

## Technologies Used
- React Native.
- Flask.
- SQLite.
- AWS EC2
- NGINX

## Diagrams
![Flowchart (1)](https://user-images.githubusercontent.com/33766593/222327824-70a492b2-358d-44e3-b7e5-3e61ed9da6a8.jpeg)
![image](https://user-images.githubusercontent.com/33766593/222328627-3396f24e-0897-4065-acd0-61afb5860c28.png)

## Demo
![FRdemo](https://user-images.githubusercontent.com/33766593/222335595-8dc46488-dcb0-4a5c-a3a1-e7a6da131eb0.png)

## How to Run
- Clone the repository
- Navigate to Api directory and Create a virtual environment with python version 3.6.13 and install all the dependency from requirement.txt using pip "pip install -r requirements.txt"
- Run the Flask Application using python, "python app.py"
- Navigate to Client directory and run "npx react-native run-android"

## Conclusion
This project demonstrates how to implement facial recognition in a mobile application and provides a useful example of using machine learning, REST APIs, and database communication in a real-world application.

## References
- Deep Learning for Computer Vision, Image Classification, Object Detection, and Face Recognition in Python by Jason Brownlee, Edition: v1.8.
