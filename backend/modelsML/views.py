from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import tensorflow as tf  # or import torch
import numpy as np

from datetime import datetime, timedelta
import json
import ee
import time
from django.conf import settings
import joblib
import numpy as np
import catboost 
import joblib
from tensorflow.keras.models import load_model
from dateutil import parser
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Conv1D, Dense
import os

# Assuming the modelsML folder is located within the bgreen-template-master directory
relative_path = 'backend/modelsML/joblib_model (1).sav'
model_path = os.path.join('/Users/Behzad/Desktop/fieldSense', relative_path)

# model_path = r'E:\bgreen-template-master\djangoauthapi1\modelsML\classification_randomFOrest.joblib'
#model_path = r'E:\bgreen-template-master\djangoauthapi1\modelsML\joblib_model (1).sav'
model = joblib.load(model_path)  
#model_pathharvest = r'E:\bgreen-template-master\djangoauthapi1\modelsML\joblib_model_harvestdate_catboost.sav'
relative_path2 = 'backend/modelsML/joblib_model_harvestdate_catboost.sav'
model_pathharvest = os.path.join('/Users/Behzad/Desktop/fieldSense', relative_path2)
modelharvest = joblib.load(model_pathharvest)  

relative_path3 = 'backend/modelsML/joblib_model_cnn_fertililzer.sav'
model_pathfertilizer = os.path.join('/Users/Behzad/Desktop/fieldSense', relative_path3)
#model_pathfertilizer = r'E:\bgreen-template-master\djangoauthapi1\modelsML\joblib_model_cnn_fertililzer.sav'
# model_cnn= r'E:\bgreen-template-master\djangoauthapi1\modelsML\newnew.hdf5'

#model_cnn= r'E:\bgreen-template-master\djangoauthapi1\modelsML\complete_model.h5'
relative_path4 = 'backend/modelsML/complete_model.h5'
model_cnn = os.path.join('/Users/Behzad/Desktop/fieldSense', relative_path4)
modelcnn = load_model(model_cnn)

relative_path5 = 'backend/modelsML/newnewlabelencoder.pkl'
labelencoderpath = os.path.join('/Users/Behzad/Desktop/fieldSense', relative_path5)
relative_path6 = 'backend/modelsML/newnewscaler.pkl'
scalerpath = os.path.join('/Users/Behzad/Desktop/fieldSense', relative_path6)
#labelencoderpath=r'E:\bgreen-template-master\djangoauthapi1\modelsML\newnewlabelencoder.pkl'
#scalerpath=r'E:\bgreen-template-master\djangoauthapi1\modelsML\newnewscaler.pkl'
loaded_label_encoder = joblib.load(labelencoderpath)
loaded_scaler_encoder = joblib.load(scalerpath)

def days_in_year_360(date_str):
    # Parse the date string into a datetime object
    # date_object = datetime.strptime(date_str)
    date_object = parser.parse(date_str)
    # Perform the day-count calculation
    return (date_object.month - 1) * 30 + date_object.day

def get_year_from_date_str(date_str):
    # Parse the date string into a datetime object
    date_object = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')

    # Extract the year
    sowing_year = date_object.year

    return sowing_year
def calculate_indices(image):
    # Calculate NDVI
      ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
    
    # Calculate EVI
      evi = image.expression(
        '2.5 * ((B8 - B4) / (B8 + 6 * B4 - 7.5 * B3 + 1))', 
        {'B8': image.select('B8'), 'B4': image.select('B4'), 'B3': image.select('B3')}
      ).rename('EVI')
    
    # Calculate GNDVI
      gndvi = image.normalizedDifference(['B8', 'B3']).rename('GNDVI')
    
    # Add NDVI, EVI, and GNDVI bands to the original image
      result_image = image.addBands([ndvi, evi, gndvi])    
      return result_image

def calculate_indicesModelF(image):
    ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
    gndvi = image.normalizedDifference(['B8', 'B3']).rename('GNDVI')

    # Enhanced Vegetation Index (EVI) calculation
    evi = image.expression(
        '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
        {
            'NIR': image.select('B8'),
            'RED': image.select('B4'),
            'BLUE': image.select('B2')
        }
    ).rename('EVI')

    # Soil Adjusted Vegetation Index (SAVI) calculation
    savi = image.expression(
        '((NIR - RED) / (NIR + RED + L) * (1 + L))',
        {
            'NIR': image.select('B8'),
            'RED': image.select('B4'),
            'L': 0.5
        }
    ).rename('SAVI')

    return image.addBands([ndvi, gndvi, evi, savi])




def initialize_gee():
    credentials = ee.ServiceAccountCredentials(
        email=settings.GEE_ACCOUNT,
        key_file=settings.GEE_JSON_KEY_FILE,
    )
    ee.Initialize(credentials)


def check_gee_initialized():
    return ee.data._credentials is not None




@api_view(['POST'])
def Classify_view(request):
    if(request.method == 'POST'):
        if check_gee_initialized():
            start_time = time.time()
            postData = json.loads(request.body)
            print(request.body)
            polygon = postData['polygon']
            start_date_str = "2023-05-21"
            end_date_str = "2023-06-30"
            start_date = ee.Date(start_date_str)
            end_date = ee.Date(end_date_str)
            sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR")
            collection = sentinel2 \
                .filterDate(start_date,end_date) \

            for polygon in polygon:
                polygon_vertices = polygon['coordinates']
                polygon_coords = [(vertex['lng'], vertex['lat'])
                                  for vertex in polygon_vertices]
                polygon_geometry = ee.Geometry.Polygon([polygon_coords])
                sentinel_collection = collection.filterBounds(polygon_geometry)
                # # Map the NDVI calculation function over the collection
                # print("Size of original collection:", sentinel_collection.size().getInfo())
                # # Map the NDVI calculation function over the collection
                sentinel_with_ndvi = sentinel_collection.map(calculate_indices)
                # print("Size of collection after mapping NDVI function:", sentinel_with_ndvi.size().getInfo())
                collection_image = sentinel_with_ndvi.median().select(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B11', 'B12', 'NDVI', 'EVI', 'GNDVI'])
                chart_data = collection_image.select(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B11', 'B12', 'NDVI', 'EVI', 'GNDVI']).reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=polygon_geometry,
                    scale=10  # Adjust the scale according to your needs
                )
                
                print("chart_data:", chart_data.getInfo())
                b1_values =  chart_data.get('B1').getInfo()
                b2_values =  chart_data.get('B2').getInfo()
                b3_values =  chart_data.get('B3').getInfo()
                b4_values =  chart_data.get('B4').getInfo()
                b5_values =  chart_data.get('B5').getInfo()
                b6_values =  chart_data.get('B6').getInfo()
                b7_values =  chart_data.get('B7').getInfo()
                b8_values =  chart_data.get('B8').getInfo()
                b9_values =  chart_data.get('B9').getInfo()
                b11_values =  chart_data.get('B11').getInfo()
                b12_values =  chart_data.get('B12').getInfo()
                evi_values =  chart_data.get('EVI').getInfo()
                gndvi_values =  chart_data.get('GNDVI').getInfo() 
                ndvi_values = chart_data.get('NDVI').getInfo()
                input_values = np.array([b1_values, b2_values, b3_values, b4_values, b5_values,
                        b6_values, b7_values, b8_values, b9_values, b11_values, b12_values,
                        evi_values, gndvi_values, ndvi_values])
                input_values = input_values.reshape(1, -1)  # assuming a batch size of 1
                predictions = model.predict(input_values)
                print("Model Predictions:", predictions)
                end_time = time.time()
                elapsed_time = end_time - start_time
                print(f"Total time taken: {elapsed_time:.2f} seconds")
                print("Model Predictions:", predictions)
                
                predictedcalll_list = predictions.tolist()

                # Now, you can serialize the list to JSON
                predicted_fer_json = json.dumps(predictedcalll_list)

               # predictions_str = str(predictions)
            return JsonResponse({'Model_Predictions': predicted_fer_json})
        else:
            initialize_gee()
            return JsonResponse({'messgae': 'EE is initialized now'})
    else:
        return JsonResponse({'error': 'Invalid request method'})
    
@api_view(['POST'])
def Fertilizer_view(request):
    if(request.method == 'POST'):
        if check_gee_initialized():
            start_time = time.time()
            postData = json.loads(request.body)
            print(request.body)
            polygon = postData['polygon']
            # start_date_str = "2023-05-21"
            # end_date_str = "2023-06-30"
            # start_date = ee.Date(start_date_str)
            # end_date = ee.Date(end_date_str)
            # sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR")
            # collection = sentinel2 \
            #     .filterDate(start_date,end_date) \

            for polygon in polygon:
                polygon_vertices = polygon['coordinates']
                polygon_coords = [(vertex['lng'], vertex['lat'])
                                for vertex in polygon_vertices]
                polygon_geometry = ee.Geometry.Polygon([polygon_coords])
                # sentinel_collection = collection.filterBounds(polygon_geometry)

                # Specify the time range (May to June)
                your_start_date = datetime.now().date()
                your_end_date= your_start_date - timedelta(days=30) 
                formatted_start_date = your_start_date.isoformat()
                formatted_end_date = your_end_date.isoformat()
                # your_start_date = '2022-05-01'
                # your_end_date = '2022-06-30'

                # Sentinel-2 image collection
                sentinel2 = (ee.ImageCollection("COPERNICUS/S2")
                            .filterBounds(polygon_geometry) #feaeture colleciton or add your polygon field here
                            .filterDate(formatted_end_date, formatted_start_date))

                # Function to calculate NDVI, GNDVI, EVI, and SAVI
                # Map the index calculation function over the image collection
                sentinel2_with_indices = sentinel2.map(calculate_indicesModelF)

                # Select the last three images from the collection
                last_three_images = sentinel2_with_indices.toList(sentinel2_with_indices.size()).reverse().slice(0, 3)

                # Arrays to store values for each index
                ndvi_array = []
                gndvi_array = []
                evi_array = []
                savi_array = []

                # Loop through the last three images and save indices values to arrays
                for i in range(3):
                    one_image = ee.Image(last_three_images.get(i))

                    ndvi_value = one_image.select('NDVI').reduceRegion(ee.Reducer.first(), polygon_geometry, 10).get('NDVI')
                    gndvi_value = one_image.select('GNDVI').reduceRegion(ee.Reducer.first(), polygon_geometry, 10).get('GNDVI')
                    evi_value = one_image.select('EVI').reduceRegion(ee.Reducer.first(), polygon_geometry, 10).get('EVI')
                    savi_value = one_image.select('SAVI').reduceRegion(ee.Reducer.first(), polygon_geometry, 10).get('SAVI')

                    # Append values to arrays
                    ndvi_array.append(ee.Number(ndvi_value).getInfo())
                    gndvi_array.append(ee.Number(gndvi_value).getInfo())
                    evi_array.append(ee.Number(evi_value).getInfo())
                    savi_array.append(ee.Number(savi_value).getInfo())
                # Print the arrays
                print("NDVI Array:", ndvi_array)
                print("GNDVI Array:", gndvi_array)
                print("EVI Array:", evi_array)
                print("SAVI Array:", savi_array)
                input = [[evi_array[0],gndvi_array[0], ndvi_array[0], savi_array[0], evi_array[1], gndvi_array[1], ndvi_array[1],savi_array[1] , evi_array[2], gndvi_array[2], ndvi_array[2], savi_array[2]]]
                X_test_custom = loaded_scaler_encoder.transform(input)
                X_test_custom = X_test_custom.reshape(X_test_custom.shape[0], X_test_custom.shape[1], 1)
                # Make predictions on the test data
                predictions = modelcnn.predict(X_test_custom)
                # Convert predictions to class labels
                predicted_labels = np.argmax(predictions, axis=1)
                # Decode the predicted labels using the label encoder
                predicted_fertilizer = loaded_label_encoder.inverse_transform(predicted_labels)
                print("output", predicted_fertilizer)
               # Assuming predicted_fertilizer is a NumPy array
                predicted_fertilizer_list = predicted_fertilizer.tolist()

                # Now, you can serialize the list to JSON
                predicted_fertilizer_json = json.dumps(predicted_fertilizer_list)


            return JsonResponse({'Model Predictions': predicted_fertilizer_json})
        else:
            initialize_gee()
            return JsonResponse({'messgae': 'EE is initialized now'})
    else:
        return JsonResponse({'error': 'Invalid request method'})
    

@api_view(['POST'])
def HarvestDate_view(request):
    if(request.method == 'POST'):
        if check_gee_initialized():
            start_time = time.time()
            postData = json.loads(request.body)
            print(request.body)
            season =postData['season'].capitalize()
            cropType = postData['cropType'].capitalize()
            sowing_date = postData['sowing_date']
            sowing_day = days_in_year_360(sowing_date)   
            input_parameters= [cropType,season,cropType,sowing_day]
            predictions=modelharvest.predict(input_parameters)
           
            print("Model Predictions:", predictions)
            end_time = time.time()
            elapsed_time = end_time - start_time
            print(f"Total time taken: {elapsed_time:.2f} seconds")
            predictions = modelharvest.predict(input_parameters)

            sowing_year = get_year_from_date_str(sowing_date)
            # Step 1: Add prediction value to sowing_day
            sowing_day_with_prediction = sowing_day + predictions

            # Step 2: Convert the resulting day back to a date in the same year as sowing_day
            predicted_date = (datetime(sowing_year, 1, 1) + timedelta(days=sowing_day_with_prediction)).date()
            print("Model Predictions:", predicted_date)
            return JsonResponse({'Model_Predictions': predicted_date})
        else:
            initialize_gee()
            return JsonResponse({'messgae': 'EE is initialized now'})
    else:
        return JsonResponse({'error': 'Invalid request method'})    