# core/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event, Participant, Todo, Theme
from .serializers import EventSerializer, ParticipantSerializer, TodoSerializer, ThemeSerializer
from django.db.models import Prefetch

class EventViewSet(viewsets.ModelViewSet):
    # 최신 이벤트 순으로 정렬하고, Nested Serializer를 위해 모든 관련 데이터(참가자, 할일 등)를 미리 가져옵니다.
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        # 파티 목록을 최신순으로 정렬하여 반환합니다.
        # 인증 기능 추가 후에는 request.user를 사용해 필터링해야 합니다.
        return Event.objects.all().order_by('-date')

    # 초대 코드를 통해 이벤트를 조회하는 커스텀 액션
    @action(detail=False, methods=['get'], url_path='by_invite_code/(?P<invite_code>[^/.]+)')
    def retrieve_by_invite_code(self, request, invite_code=None):
        try:
            # UUID 형식으로 검색
            event = self.queryset.get(invite_code=invite_code)
        except Event.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # 상세 Serializer 사용
        serializer = self.get_serializer(event)
        return Response(serializer.data)


# POST 요청을 오버라이드하여 초대 코드를 통한 참가자 등록 로직 구현
class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    def create(self, request, *args, **kwargs):
        # 요청 데이터에서 이벤트 ID 대신 invite_code와 이름을 가져옵니다.
        invite_code = request.data.get('event')
        name = request.data.get('name')

        if not invite_code or not name:
            return Response({'error': 'Invite code and name are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 초대 코드를 통해 이벤트 객체를 찾습니다.
            event = Event.objects.get(invite_code=invite_code)
        except Event.DoesNotExist:
            return Response({'error': 'Invalid invite code or event not found.'}, status=status.HTTP_404_NOT_FOUND)

        # 새로운 참가자를 생성하고 저장합니다.
        # (참고: 실제 앱에서는 여기서 User 모델과 연결해야 하지만, MVP에서는 단순 이름으로 생성)
        participant = Participant.objects.create(event=event, name=name)
        serializer = self.get_serializer(participant)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TodoViewSet(viewsets.ModelViewSet):
    # TodoViewSet 로직 (Todo 항목 관리)
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

# ----------------------------------------------------
# Theme ViewSet (테마 목록 조회) 추가
# ----------------------------------------------------
class ThemeViewSet(viewsets.ReadOnlyModelViewSet):
    """테마 목록을 조회하는 ViewSet (GET /api/themes/)"""
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer