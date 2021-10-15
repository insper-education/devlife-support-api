from typing import Union
from io import TextIOWrapper
import pandas as pd
from pathlib import Path
from django.core.files.base import File


#INPUT
NAME_COL = 'Nome'
LAST_NAME_COL = 'Sobrenome'
USERNAME_COL = 'Nome do usuário'
# OUTPUT
NAME = 'nome'
LAST_NAME = 'sobrenome'
USERNAME = 'username'
EMAIL = 'email'


def get_file_reading_data(filename: Union[str, Path, File]):
    open_func = open
    if isinstance(filename, File):
        suffix = Path(filename.name).suffix
        open_func = TextIOWrapper
    else:
        filename = Path(filename)
        suffix = filename.suffix
    if suffix =='.csv':
        encoding = 'utf-8'
        sep=','
    elif suffix == '.xls':
        encoding = 'utf-16'
        sep='\t'
    else:
        raise RuntimeError(f"Can't load students from {filename}. Reason: unknown extension.")
    return filename, encoding, sep, open_func


def split_name(user_data):
    name = user_data[NAME_COL]
    try:
        last_name = user_data[LAST_NAME_COL]
    except:
        name = name.split(' ')[0]
        last_name = ' '.join(name.split(' ')[1:])
    return name.title(), last_name.title()


def load_blackboard_students(filename: Union[str, Path, File], email_domain: str = 'al.insper.edu.br') -> pd.DataFrame:
    filename, encoding, sep, open_func = get_file_reading_data(filename)
    with open_func(filename, encoding=encoding) as f:
        df = pd.read_csv(f, sep=sep)

        data = {NAME: [], LAST_NAME: [], USERNAME: [], EMAIL: []}
        for _, user_data in df.iterrows():
            name, last_name = split_name(user_data)
            username = user_data[USERNAME_COL]
            email = f'{username}@{email_domain}'

            data[NAME].append(name)
            data[LAST_NAME].append(last_name)
            data[USERNAME].append(username)
            data[EMAIL].append(email)
        return pd.DataFrame(data)
