from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt


import json
import ee
import time
from django.shortcuts import render
import ee
from django.conf import settings

def calculate_ndvi(image):
    ndvi = image.normalizedDifference(['B8', 'B4'])
    return image.addBands(ndvi.rename('NDVI'))


def initialize_gee():
    credentials = ee.ServiceAccountCredentials(
        email=settings.GEE_ACCOUNT,
        key_file=settings.GEE_JSON_KEY_FILE,
    )
    ee.Initialize(credentials)


def check_gee_initialized():
    return ee.data._credentials is not None

@api_view(['POST'])
def average_ndvi(request):
    if(request.method == 'POST'):
        if check_gee_initialized():
            start_time = time.time()
            postData = json.loads(request.body)
            print(request.body)
            polygon_list = postData['polygonList']
            start_date = postData['startDate']
            end_date = postData['endDate']

            sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR")
            collection = sentinel2 \
                .filterDate(start_date, end_date) \


            average_ndvi_computed_list = []

            for polygon in polygon_list:
                polygon_vertices = polygon['coordinates']

                # Convert the polygon vertices to Earth Engine format
                polygon_coords = [(vertex['lng'], vertex['lat'])
                                  for vertex in polygon_vertices]
                polygon_geometry = ee.Geometry.Polygon([polygon_coords])
                sentinel_collection = collection.filterBounds(polygon_geometry)
                # Map the NDVI calculation function over the collection
                sentinel_with_ndvi = sentinel_collection.map(calculate_ndvi)

                # Select the NDVI band from the processed collection
                ndvi_collection = sentinel_with_ndvi.select('NDVI')
                # Calculate the average NDVI for the selected area and time frame
                average_ndvi = ndvi_collection.mean().reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=polygon_geometry,
                    scale=50
                )

                # Get the average NDVI value
                average_ndvi_value = average_ndvi.get('NDVI').getInfo()
                print(average_ndvi_value)
                average_ndvi_computed_list.append(
                    {'averageNDVI': average_ndvi_value, 'polygonVertices': polygon_vertices})

            end_time = time.time()
            elapsed_time = end_time - start_time
            print(f"Total time taken: {elapsed_time:.2f} seconds")

            return JsonResponse({'computedAverageNDVIList': average_ndvi_computed_list})
        else:
            initialize_gee()
            return JsonResponse({'messgae': 'EE is initialized now'})
    else:
        return JsonResponse({'error': 'Invalid request method'})

@api_view(['POST'])
def point_wise_ndvi(request):
    if(request.method == 'POST'):
        if check_gee_initialized():
            start_time = time.time()
            postData = json.loads(request.body)
            polygon_point_list = postData['polyon_Point_List']
            start_date = postData['startDate']
            end_date = postData['endDate']

            point_ndvi_computed_list = []

            for polygonPoint in polygon_point_list:
                overall_average_ndvi = 0
                polygon_vertices = polygonPoint['polygon']['coordinates']
                points_list = polygonPoint['points']

                # Convert polygon vertices to Earth Engine format
                polygon_coords = [(vertex['lng'], vertex['lat'])
                                for vertex in polygon_vertices]
                polygon_geometry = ee.Geometry.Polygon([polygon_coords])

                # Load Sentinel-2 imagery
                sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR")
                sentinel_collection = sentinel2 \
                    .filterDate(start_date, end_date) \
                    .filterBounds(polygon_geometry)

                # Create an EE Geometry MultiPoint from the list of points
                points_geometry = ee.Geometry.MultiPoint(
                    [ee.Geometry.Point(point['lng'], point['lat'])
                        for point in points_list]
                )

                # Filter the image collection using the polygon
                filtered_collection = sentinel_collection.filterBounds(
                    points_geometry)

                # Map the NDVI calculation function over the filtered collection
                filtered_with_ndvi = filtered_collection.map(calculate_ndvi)

                # Select the NDVI band from the processed collection
                ndvi_collection = filtered_with_ndvi.select('NDVI')

                # Get NDVI values for each point
                ndvi_values = ndvi_collection.getRegion(
                    points_geometry, scale=10).getInfo()

                # Extract the NDVI values from the response
                header = ndvi_values[0]
                data = ndvi_values[1:]
                ndvi_index = header.index('NDVI')

                calculated_results = []

                for point, row in zip(points_list, data):
                    ndvi = row[ndvi_index]
                    calculated_results.append({
                        'point': point,
                        'ndvi': ndvi,
                    })
                    overall_average_ndvi = overall_average_ndvi+ndvi
                overall_average_ndvi = overall_average_ndvi/len(points_list)
                print(overall_average_ndvi)
                print("\n\n\n\n")
                point_ndvi_computed_list.append(
                    {'point_ndvi_data': calculated_results, 'polygonVertices': polygon_vertices, 'averageNdvi': overall_average_ndvi})

            end_time = time.time()
            elapsed_time = end_time - start_time
            print(f"Total time taken: {elapsed_time:.2f} seconds")
            return JsonResponse({'computedPointNDVIList': point_ndvi_computed_list})

        else:
            initialize_gee()
            return JsonResponse({'messgae': 'EE is initialized now'})
    else:
        return JsonResponse({'error': 'Invalid request method'})

