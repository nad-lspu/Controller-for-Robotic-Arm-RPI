from fastapi import APIRouter, status, HTTPException, Depends, Response
from .. import models, schemas, auth_utils
from ..database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from datetime import datetime, timezone

router = APIRouter(prefix='/activity', tags=['activities'])

@router.get('/', response_model=List[schemas.ActivityResponse])
def get_activities(
    db: Session = Depends(get_db), 
    user: models.User = Depends(auth_utils.get_current_user)
):
    return db.query(models.Activity).all()

@router.get('/{id}', response_model=schemas.ActivityResponse)
def get_activity(
    id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth_utils.get_current_user)
):
    activity = db.query(models.Activity).filter(models.Activity.id == id).first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Requested Activity is not found.'
        )
    
    return activity

@router.post('/', response_model=schemas.ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(
    data: schemas.ActivityRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth_utils.get_current_user)
):
    if user.user_type == 'student':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Not authorized to perform requested action.'
        )

    try:
        activity = models.Activity(**data.model_dump(), created_at=datetime.now(timezone.utc))
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(e)
        )
    
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth_utils.get_current_user)
):
    if user.user_type == 'student':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Not authorized to perform requested action.'
        )
    
    activity_query = db.query(models.Activity).filter(models.Activity.id == id)
    activity = activity_query.first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Requested Activity is not found.'
        )
    
    activity_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
    
@router.put('/{id}', response_model=schemas.ActivityResponse)
def update_activity(
    id: int,
    data: schemas.ActivityRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth_utils.get_current_user)
):
    if user.user_type == 'student':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Not authorized to perform requested action.'
        )
    
    activity_query = db.query(models.Activity).filter(models.Activity.id == id)
    activity = activity_query.first()

    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Requested Activity is not found.'
        )
    
    activity_query.update(data.model_dump(), synchronize_session=False)
    db.commit()
    return activity
        