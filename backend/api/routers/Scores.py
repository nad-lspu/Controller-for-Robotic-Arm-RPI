from fastapi import APIRouter, Depends, status, HTTPException, Response
from .. import schemas, models, auth_utils
from ..database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Literal

router = APIRouter(
    prefix='/score',
    tags=['scores']
)

@router.get('/', response_model=List[schemas.ScoreResponse])
def get_score(
    db: Session = Depends(get_db),
    user: models.User = Depends(auth_utils.get_current_user),
):
    return db.query(models.Score).filter(models.Score.student_id == user.id).all()

@router.get('/{id}', response_model=List[schemas.ScoreResponse])
def get_scores_sorted(
    id: int | str,
    db: Session = Depends(get_db), 
    user: models.User = Depends(auth_utils.get_current_user),
    sort_by: Literal['student', 'activity'] = 'student',
    sort_mode: Literal['ASC', 'DESC'] = 'ASC'
):
    if user.user_type == 'student':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Not authorized to perform requested action.'
        )

    score_query_id = models.Score.activity_id if sort_by == 'activity' else models.Score.student_id
    score_query_table = models.Activity if sort_by == 'activity' else models.User
    score_order = score_query_id.asc() if sort_mode == 'ASC' else score_query_id.desc()

    id_exists = db.query(score_query_table).filter(score_query_table.id == id).first()

    if not id_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Input id {id} does not exist.'
        )

    scores = db.query(models.Score).filter(score_query_id == id).order_by(score_order).all()
    return scores

@router.post('/', response_model=schemas.ScoreCreateResponse)
def create_score(
    data: schemas.ScoreCreateRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth_utils.get_current_user)
):
    if user.user_type == 'student':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Not authorized to perform requested action.'
        )
    
    try:
        new_score = models.Score(**data.model_dump())
        db.add(new_score)
        db.commit()
        db.refresh(new_score)
        return new_score
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Something went wrong adding the score.'
        )
    
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_score(
    id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth_utils.get_current_user)
):
    if user.user_type == 'student':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Not authorized to perform requested action.'
        )

    delete_score_query = db.query(models.Score).filter(models.Score.id == id)
    delete_score = delete_score_query.first()

    if not delete_score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Requested Score Data not found.'
        )
    
    delete_score_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.put('/{id}', response_model=schemas.ScoreUpdateResponse)
def update_score(
    id: int,
    data: schemas.ScoreUpdateRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth_utils.get_current_user)
):
    if user.user_type == 'student':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Not authorized to perform requested action.'
        )
    
    update_score_query = db.query(models.Score).filter(models.Score.id == id)
    update_score = update_score_query.first()

    if not update_score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Requested Score Data not found.'
        )
    
    new_score = {**data.model_dump(), 'id': id}
    update_score_query.update(new_score, synchronize_session=False)
    db.commit()
    return new_score

