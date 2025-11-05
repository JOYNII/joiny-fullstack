import uuid
from django.db import models

# ----------------------------------------------------
# 1. Theme 모델 (테마 선택 화면 데이터 제공)
# ----------------------------------------------------
class Theme(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name


# ----------------------------------------------------
# 2. Event 모델 (장소 정보, 테마, 음식 등 필드 확장)
# ----------------------------------------------------
class Event(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()

    #프론트엔드로부터 받을 장소 정보 필드 (4개)
    location_name = models.CharField(max_length=255, blank=True, null=True)  # 장소 이름
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)  # 위도
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)  # 경도
    place_id = models.CharField(max_length=255, blank=True, null=True)  # 구글 Place ID

    #프론트엔드로부터 받을 테마 및 음식 정보
    theme = models.CharField(max_length=50, default='기본')  # 선택된 테마 이름 저장
    food_description = models.CharField(max_length=255, blank=True, null=True)  # 음식/준비물 설명

    # 초대 링크에 사용될 고유 코드 필드
    invite_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return self.name


class Participant(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Todo(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    task = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.task