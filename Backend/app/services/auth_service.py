from app.core.security import hash_password, verify_password, create_access_token
from sqlmodel import Session, select
from app.models.user import User


def register_user(session: Session, user_data):
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def login_user(session: Session, email: str, password: str):
    user = session.exec(select(User).where(User.email == email)).first()

    if not user or not verify_password(password, user.password_hash):
        return None

    token = create_access_token({"sub": str(user.id)})

    return {"token": token, "user": user}