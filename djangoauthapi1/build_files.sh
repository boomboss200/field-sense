echo "BUILD START"
    python3 pip install --upgrade pip
    python3 pip install --upgrade pip setuptools
    python3 -m pip install django==4.0.3
    python3 -m pip install earthengine-api
    python3 -m pip install urllib3==1.26.7
    # python3 -m pip install urllib3==1.0.2
 python3 -m pip install -r requirements.txt
 python3 manage.py collectstatic --noinput --clear
 echo "BUILD END"