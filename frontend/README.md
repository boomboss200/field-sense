
# Remote Sensing Time Series Analysis for Crop Monitoring

## Getting Started

1. **Install and Setup MySQL workbench**
   Visit the official MySQL website to download the MySQL Workbench installer.

    MySQL Workbench Download Page: https://dev.mysql.com/downloads/workbench/
    Select the appropriate version based on your operating system (Windows, macOS, Linux) and Install. 

    *Launch MySQL Workbench.
    *Click on the "+" icon next to "MySQL Connections" to create a new connection.
    *Enter a connection name.
    *Set the connection method (e.g., Standard TCP/IP over SSH).
    *Enter the necessary connection details, such as hostname, port, username, and password.
    *Click "Test Connection" to ensure the connection is successful.
    *Click "OK" to save the connection.

    Now you can connect to your MySQL server through MySQL Workbench.


 2. **Create a new Schema in MySQL connection**
    Write a SQL script in Workbench to create a new schema. For example:
    ```
    CREATE SCHEMA `your_schema_name`;
    ```

 3. **Using MySQL connection for Database Schema**
    
    *open the project in the vscode 
    *navigate to the 
       ``` djangobackend/djangobackend/settings.py ```
    *add the following credentials to Database section to establish connection with MySQL
       ```
        NAME: your_schema_name
        USER: your_connection_name
        PASSWORD: your_connection_password
        ```

 4. **Setup & Activate a Python Virtual Environment for Django Backend**

    *Before you begin, ensure that you have the following installed on your system:
        Python: Make sure Python is installed on your machine. You can download it from python.org.

    *Open a terminal or command prompt and run the following command to install virtualenv:  
       ``` 
       pip install virtualenv 
       ```

    *Choose or create a directory where you want to store your virtual environments. Navigate to this directory in the terminal or command prompt and run:
    # On Windows
       ``` 
       python -m venv auth
       ```
    # On macOS
       ```
        python3 -m venv authenv
        ```
     
5. **Install Dependencies**

    ## Install Frontend Dependencies
    ```
    cd fieldSense
    cd frontend
    npm install
    ```

 ## Install Backend Dependencies
    # On Windows
        auth\Scripts\activate
    # On macOS
        source authenv/bin/activate


5. **Replace your apikey for GoogleMapsAPi and Google Earth EngingAPi**
     *Replace Google Earth EngineApikey in Backend
        ```
        fieldSense/djangoBackend/djangoBackend/settings.py
        GEE_PRIVATE_KEY == 'your gee apikey'
        ```
     *Replace Google MapsApikey in Frontend
         ```
        fieldSense/src/pages/Map.jsx
        apiKey == 'your googlemaps apikey'
        ```
        ```
        fieldSense/src/pages/MyFields.jsx
        apiKey == 'your googlemaps apikey'
        ```
        ```
        fieldSense/src/component/MapComponent.jsx
        apiKey == 'your googlemaps apikey'
        ```

6. **Run Project**
    
    ## Run Backend
     ```
    cd fieldSense
    cd djangoBackend
     ```

    *Activate the virtual environment:
    # On Windows
       ``` 
        auth\Scripts\activate 
       ```
    # On macOS
        ```
         source authenv/bin/activate
        ``` 
    ```     
    cd ..
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```
    ## Run Frontend
    ```
    cd fieldSense
    npm start
    ```


Access the application at http://localhost:3000 in your web browser.




