from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from .. import schemas, models, auth_utils
from ..database import get_db

router = APIRouter(prefix='/auth', tags=['auth'])

@router.post('/create', response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreateRequest, db: Session = Depends(get_db)):

    existing_id = db.query(models.User).filter(models.User.id == user.id).first()
    if existing_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f'User with id {user.id} already exists.'
        )
    
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f'User with email {user.email} already exists.'
        ) 
    
    user_dict = user.model_dump(exclude={'confirm_password', 'password'})
    user_dict['hashed_password'] = auth_utils.hash(user.password)
    user_dict['created_at'] = datetime.now(timezone.utc)

    new_user = models.User(**user_dict)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post('/signin', response_model=schemas.SignInResponse, status_code=status.HTTP_200_OK)
def sign_in(user_cred: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    """
        Gives you an access token:
        username is the student/employee number.
        password is the password of the user.
    """

    user = db.query(models.User).filter(models.User.id == user_cred.username).first()

    if not user or not auth_utils.verify(user_cred.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Incorrect Student/Employee ID or Password.'
        )
    
    return {
        'access_token': auth_utils.create_access_token(
            data={'user_id': user.id}
        ),
        'token_type': 'bearer'
    }
    
    