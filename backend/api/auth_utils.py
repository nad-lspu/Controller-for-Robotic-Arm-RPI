from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordBearer
from . import schemas, models
from jose import JWTError, jwt
from .database import get_db
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/signin')

SECRET_KEY = '2u1i3hg2187yt7812c73861hf78263cb7812387yg12hj3v1276387dasdw'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXP_MINS = 30

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def hash(password: str):
    return bcrypt_context.hash(password)

def verify(password: str, hashed_password: str):
    return bcrypt_context.verify(password, hashed_password)

def create_access_token(data: dict):
    encode_data = data.copy()
    exp = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXP_MINS)
    encode_data['exp'] = exp
    return jwt.encode(encode_data, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token: str, credentials_exception: Exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        if not payload.get('user_id'):
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return schemas.TokenData(user_id=payload.get('user_id'))
    
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Cannot verify access token.',
        headers={'WWW-Authenticate': 'Bearer'}
    )

    token_data = verify_access_token(token, credentials_exception)
    return db.query(models.User).filter(models.User.id == token_data.user_id).first()
