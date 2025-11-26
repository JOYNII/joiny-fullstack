# joiny_server/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import EventViewSet, ParticipantViewSet, TodoViewSet, ThemeViewSet # ThemeViewSet 추가

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'participants', ParticipantViewSet, basename='participant')
router.register(r'todos', TodoViewSet, basename='todo')
router.register(r'themes', ThemeViewSet, basename='theme') # Theme 라우팅 등록

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # 초대 코드를 통해 이벤트를 조회하는 새로운 엔드포인트
    path('api/events/by_invite_code/<uuid:invite_code>/', EventViewSet.as_view({'get': 'retrieve_by_invite_code'}), name='event-by-invite-code'),
]
