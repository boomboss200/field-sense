echo "BUILD START"
    python3.9  pip install --upgrade pip
    python3.9  pip install --upgrade pip setuptools
 python3.9 -m pip install -r requirements.txt
 python3.9 manage.py collectstatic --noinput --clear
 echo "BUILD END"