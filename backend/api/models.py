from .database import Base, SessionLocal
from sqlalchemy import Column, String, TIMESTAMP, Integer, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    verified = Column(Boolean, nullable=False, default=False)
    hashed_password = Column(String, nullable=False)
    user_type = Column(String, nullable=False, default='student')
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)

    scores = relationship('Score', back_populates='user')

class Score(Base):
    __tablename__ = 'scores'

    id = Column(Integer, primary_key=True, nullable=False)
    activity_id = Column(Integer, ForeignKey('activities.id', ondelete='CASCADE'), nullable=False)
    student_id = Column(String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    score = Column(Float, nullable=False)

    user = relationship('User', back_populates='scores')
    activity = relationship('Activity', back_populates='scores')

class Activity(Base):
    __tablename__ = 'activities'

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    instructions = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)

    scores = relationship('Score', back_populates='activity')

class ServoAngles(Base):
    __tablename__ = 'servo_angles'

    id = Column(Integer, primary_key=True, nullable=False)
    channel_0 = Column(Integer, nullable=False)
    channel_1 = Column(Integer, nullable=False)
    channel_2 = Column(Integer, nullable=False)
    channel_3 = Column(Integer, nullable=False)
    channel_4 = Column(Integer, nullable=False)