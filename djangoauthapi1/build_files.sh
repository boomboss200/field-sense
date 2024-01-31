echo "BUILD START"
    python3 pip3 install --upgrade pip
    python3 pip install --upgrade pip setuptools
    python3 pip3 install tensorflow==2.15.0

 python3 -m pip install -r requirements.txt
 python3 manage.py collectstatic --noinput --clear
 echo "BUILD END"