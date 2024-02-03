echo "BUILD START"
    python3 pip install --upgrade pip
    python3 pip install --upgrade pip setuptools
    python3 -m pip install django
    python3 -m pip install earthengine-api
 python3 -m pip install -r requirements.txt
 python3 manage.py collectstatic --noinput --clear
 echo "BUILD END"