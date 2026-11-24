from .database import SessionLocal
from . import models
from sqlalchemy.orm import Session
from .auth_utils import hash
from datetime import datetime, timezone

def initial_servo_angle_setup():
    db: Session = SessionLocal()
    try:
        servo_angles_query = db.query(models.ServoAngles).filter(models.ServoAngles.id == 1)

        if servo_angles_query.first():
            servo_angles_query.update({
                'channel_0': 90,
                'channel_1': 90,
                'channel_2': 90,
                'channel_3': 90,
                'channel_4': 90,
            }, synchronize_session=False)
            db.commit()
            return
        
        new_servo_angles = models.ServoAngles(
            channel_0=90,
            channel_1=90,
            channel_2=90,
            channel_3=90,
            channel_4=90,
            id=1,
        )

        db.add(new_servo_angles)
        db.commit()
        print('Initial Servo Angle Setup Complete')
    
    finally:
        db.close()

def initial_super_admin_setup():
    db: Session = SessionLocal()
    try:
        super_admin_user = db.query(models.User).filter(models.User.id == '1111-1111').first()
        if super_admin_user:
            return
        
        new_super_admin_user = models.User(
            id='1111-1111',
            name='Super Admin',
            email='superadmin@trixie.com',
            verified=True,
            hashed_password=hash('superadmin123'),
            user_type='admin',
            created_at=datetime.now(timezone.utc)
        )

        db.add(new_super_admin_user)
        db.commit()
        print('Initial Super Admin User Setup Complete')
    
    finally:
        db.close()