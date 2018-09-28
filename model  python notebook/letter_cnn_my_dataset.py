# -*- coding: utf-8 -*-
"""letter-cnn-my-dataset.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/15bzHr3SY0Gi2uyO8WEocF7s9cy46kIqg
"""

import requests

def download_file_from_google_drive(id, destination):
    URL = "https://docs.google.com/uc?export=download"

    session = requests.Session()

    response = session.get(URL, params = { 'id' : id }, stream = True)
    token = get_confirm_token(response)

    if token:
        params = { 'id' : id, 'confirm' : token }
        response = session.get(URL, params = params, stream = True)

    save_response_content(response, destination)    
def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            return value

    return None

def save_response_content(response, destination):
    CHUNK_SIZE = 32768

    with open(destination, "wb") as f:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)


file_id = '1GN_fx70jjYxcFpeQ2NzZewyJZldMwk4l'
destination = 'my-dataset-v2-shapes.csv'
download_file_from_google_drive(file_id, destination)

import csv as csv
import numpy as np
import pandas as pd 
import random
from keras.models import Sequential
from keras.layers import Dense,Activation,Conv2D,MaxPool2D,Flatten

csv_file = csv.reader(open('my-dataset-v2-shapes.csv'))
#header = csv_file.next()
train_set = []

for row in csv_file:
    train_set.append(row[0:])

train_set = np.array(train_set)


train_set_len = len(train_set)
print(train_set.shape)
print(train_set_len)


#1qagGehTLM4uTuN10ktkHuVbuahlUVEHN
#https://drive.google.com/open?id=1qagGehTLM4uTuN10ktkHuVbuahlUVEHN

used_indexs =[]
def gen_free_index():
  idx =random.randint(0,train_set_len-1)
  if idx in used_indexs :
    return gen_free_index()
  else :
    used_indexs.append(idx)
    return idx

def gen_train_set(batch_size):
  
  #global train_set
  #train_set = np.random.shuffle(train_set)

  x_train=[]
  y_train=[]
  for i in range(0,batch_size):
    t=gen_free_index()
   
    datav = train_set[t]
    datav=datav.astype(float)
    y_v = datav[0]
    x_v = np.delete(datav,[0])
    x_v = np.array(x_v)
    
    
    #y_lable = []
    #y_lable.append(y_v)
    
    x_train.append(x_v)    
    y_train.append(int(y_v))
    
  x_train = np.array(x_train)
  x_train = x_train.reshape((-1,28,28,1))
  y_train = np.array(y_train)
  return x_train,y_train

width = 28
height = 28
batch_size=100
used_indexs = []
x_test,y_test = gen_train_set(200)
used_indexs = []
x_train,y_train = gen_train_set(348)
print(x_train.shape)
print(y_train.shape)

import scipy.misc as smp
from matplotlib import pyplot as plt
str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# Create a 1024x1024x3 array of 8 bit unsigned integers
vl =100
x_train1 =x_train[vl].reshape([28,28])
print(str[y_train[vl]])
for p in x_train1:
  ln1 =''
  for c in p :
    ic = 0
    if int(c*255)>10 :
      ic = 1
    ln1+= "{0}".format(ic)
  print(ln1)
#print(x_train[0])
'''
# Create a 1024x1024x3 array of 8 bit unsigned integers
for vl in range(0,10):

  data = np.zeros( (28,28,3), dtype=np.uint8 )
  for j in range(0,28):
    for i in range(0,28):
      #print(train_set_V[i][j])
      #print(x_test[0][j][i][0])
      data[i,j]= [x_train[vl][j][i][0]*255,0,0] ;
  print(y_train[vl])  
  print(str[y_train[vl]])

  plt.imshow(data, interpolation='nearest')
  plt.show()
'''

model = Sequential()
model.add(Conv2D(80,kernel_size=(5,5),padding='same',activation='relu',input_shape=(width,height,1)))
model.add(MaxPool2D(pool_size= (2,2)))
model.add(Conv2D(80,kernel_size=(3,3),padding='same',activation='relu'))
model.add(MaxPool2D(pool_size= (2,2)))
model.add(Conv2D(80,kernel_size=(3,3),padding='same',activation='relu'))
model.add(MaxPool2D(pool_size= (2,2)))

model.add(Flatten())
model.add(Dense(104,activation='relu'))
model.add(Dense(8,activation='softmax'))
model.compile(optimizer='adadelta',loss='sparse_categorical_crossentropy')

model.summary()

model.fit(x_train, y_train,epochs=10,batch_size= batch_size)

print(y_test[0])
score = model.evaluate(x_test, y_test, batch_size=128)
print(score)

xt= []
xt.append(x_test[0])
xt=np.array(xt)

score = model.predict(x_test)
counter1 =0
for i in range(0,len(score)):
  if np.argmax(score[i]) == y_test[i]:
    counter1 += 1
  #else :
    #print("predict:",np.argmax(score[i]),", lable:", y_test[i])
print(score.shape)
print(counter1/len(score))

model.save('shapes-conv-project-mydataset-v2.h5')  # creates a HDF5 file 'letters-conv-project-mydataset-v1.h5'
from google.colab import files
files.download("shapes-conv-project-mydataset-v2.h5" )