echo "BUILD START"
    python3 pip install --upgrade pip
    python3 pip install --upgrade pip setuptools
    python3 pip install --upgrade pip windows-curses
 python3 -m pip install -r requirements.txt
 python3 manage.py collectstatic --noinput --clear
 echo "BUILD END"