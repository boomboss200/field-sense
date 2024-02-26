echo "BUILD START"
    python2.7 pip install --upgrade pip
    python2.7 pip install --upgrade pip setuptools
    python2.7 -m pip install django==4.0.3
    python2.7 -m pip install earthengine-api
    # python3 -m pip install urllib3==1.0.2
 python2.7 -m pip install -r requirements.txt
 python2.7 manage.py collectstatic --noinput --clear
 echo "BUILD END"